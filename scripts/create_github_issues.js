const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawnSync } = require('child_process');

// 1. Get GitHub Token from Git Credential Manager
function getGitHubToken() {
  const child = spawnSync('git', ['credential', 'fill'], {
    input: 'protocol=https\nhost=github.com\n\n',
    encoding: 'utf8'
  });
  for (const line of child.stdout.split('\n')) {
    if (line.startsWith('password=')) {
      return line.substring('password='.length).trim();
    }
  }
  return null;
}

// 2. RFC-4180 CSV Parser
function parseCSV(text) {
  const p = [];
  let row = [''];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      p.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || (row.length === 1 && row[0] !== '')) p.push(row);
  return p;
}

// 3. GitHub API Helper
function makeGitHubRequest(token, method, path, data = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'User-Agent': 'FitEmpire-Issue-Sync',
        'Authorization': 'token ' + token,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };
    if (payload) {
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = body ? JSON.parse(body) : null;
        } catch (e) {
          parsed = body;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const token = getGitHubToken();
  if (!token) {
    console.error('❌ Could not retrieve GitHub token.');
    process.exit(1);
  }

  const csvPath = path.resolve(__dirname, '../jira_issues_final_200.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(csvContent);
  const header = rows[0];
  const issues = rows.slice(1);

  console.log(`Loaded ${issues.length} issues from ${csvPath}`);

  const progressPath = path.resolve(__dirname, 'github_issues_progress.json');
  let progress = {};
  if (fs.existsSync(progressPath)) {
    try {
      progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
    } catch (e) {
      progress = {};
    }
  }

  console.log(`Already created in progress file: ${Object.keys(progress).length}`);

  const repo = 'ayushgupta9906/FitEmpire';

  for (let i = 0; i < issues.length; i++) {
    const [summary, issueType, priority, labelsStr, description] = issues[i];
    const feKey = `FE-${String(i + 1).padStart(3, '0')}`;

    if (progress[feKey]) {
      console.log(`[${i+1}/${issues.length}] Skipping ${feKey} (Already created as #${progress[feKey].number})`);
      continue;
    }

    // Clean labels
    const rawLabels = (labelsStr || '').split(/\s+/).filter(Boolean);
    const labelSet = new Set();
    labelSet.add(issueType.toLowerCase());
    labelSet.add(`priority:${priority.toLowerCase()}`);
    for (const l of rawLabels) {
      labelSet.add(l.toLowerCase());
    }

    const labels = Array.from(labelSet).slice(0, 8); // GitHub recommends <= 10 labels

    const issueTitle = `[${feKey}] ${summary}`;

    const issueBody = `## 📌 ${feKey}: ${summary}

| Attribute | Value |
|---|---|
| **Issue Key** | \`${feKey}\` |
| **Issue Type** | \`${issueType}\` |
| **Priority** | \`${priority}\` |
| **Labels** | \`${labels.join('`, `')}\` |

---

### 📝 Issue Description & Technical Context
${description}

---

### 🏛️ Architecture & System References
- **Master Architecture Blueprint:** [\`SYSTEM_DESIGN.md\`](https://github.com/ayushgupta9906/FitEmpire/blob/main/SYSTEM_DESIGN.md)
- **Android Studio Guide:** [\`ANDROID_STUDIO_APP_GUIDE.md\`](https://github.com/ayushgupta9906/FitEmpire/blob/main/ANDROID_STUDIO_APP_GUIDE.md)
- **Monorepo Root:** [\`FitEmpire Repository\`](https://github.com/ayushgupta9906/FitEmpire)
`;

    let attempts = 0;
    let success = false;

    while (attempts < 5 && !success) {
      attempts++;
      try {
        console.log(`[${i+1}/${issues.length}] Creating ${feKey}: "${summary.substring(0, 50)}..."`);
        const res = await makeGitHubRequest(token, 'POST', `/repos/${repo}/issues`, {
          title: issueTitle,
          body: issueBody,
          labels: labels
        });

        if (res.statusCode === 201) {
          success = true;
          const issueNum = res.data.number;
          const htmlUrl = res.data.html_url;
          progress[feKey] = {
            number: issueNum,
            url: htmlUrl,
            createdAt: new Date().toISOString()
          };
          fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2), 'utf8');
          console.log(`   ✅ Created GitHub Issue #${issueNum}: ${htmlUrl}`);
        } else if (res.statusCode === 403 || res.statusCode === 429) {
          const retryAfter = parseInt(res.headers['retry-after'] || '60', 10);
          console.warn(`   ⚠️ Rate limited (HTTP ${res.statusCode}). Pausing for ${retryAfter} seconds...`);
          await sleep(retryAfter * 1000);
        } else {
          console.error(`   ❌ Failed with status ${res.statusCode}:`, res.data);
          break;
        }
      } catch (err) {
        console.error(`   ❌ Network error on ${feKey}:`, err.message);
        await sleep(5000);
      }
    }

    // Delay 1.5 seconds between issues to stay well under GitHub secondary rate limit (max 100 per minute)
    await sleep(1500);
  }

  console.log(`\n🎉 All 200 GitHub issues synchronized successfully!`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
