const fs = require('fs');
const path = require('path');

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

const batch3Path = path.resolve(__dirname, '..', 'jira_issues_batch3_100.csv');
const masterPath = path.resolve(__dirname, '..', 'jira_issues_master_140.csv');

console.log('--- VALIDATING BATCH 3 (100 ISSUES) ---');
const b3Rows = parseCSV(fs.readFileSync(batch3Path, 'utf8'));
console.log('Headers:', b3Rows[0]);
console.log('Total issues:', b3Rows.length - 1);

let errors = 0;
if (b3Rows.length - 1 !== 100) {
  console.error(`❌ Expected 100 issues in Batch 3, but found ${b3Rows.length - 1}`);
  errors++;
}

b3Rows.slice(1).forEach((r, idx) => {
  const issueNum = idx + 1;
  if (r.length !== 5) {
    console.error(`Issue #${issueNum} column mismatch: found ${r.length}, expected 5`);
    errors++;
  }
  const [summary, issueType, priority, labels, description] = r;
  
  if (!summary || summary.trim().length === 0) {
    console.error(`Issue #${issueNum}: Summary is empty`);
    errors++;
  }

  // Priority check: all Improvements and CR Tasks must be Low
  if ((issueType === 'Improvement' || summary.includes('[CR]') || issueType === 'Task') && priority !== 'Low') {
    console.error(`Issue #${issueNum} (${summary}): Improvement/CR must be Low priority, found ${priority}`);
    errors++;
  }

  // Label check: strictly 1-2 words
  const words = labels.trim().split(/\s+/).length;
  if (words > 2) {
    console.error(`Issue #${issueNum} label "${labels}" has ${words} words (must be <= 2 words)`);
    errors++;
  }

  // Description check: 7 sections
  const requiredSections = [
    '[SEVERITY & IMPACT]',
    '[AFFECTED FILES & LINES]',
    '[TECHNICAL ROOT CAUSE]',
    '[STEPS TO REPRODUCE]',
    '[EXPECTED BEHAVIOR]',
    '[ACTUAL BEHAVIOR]',
    '[PROPOSED RESOLUTION]'
  ];
  for (const sec of requiredSections) {
    if (!description.includes(sec)) {
      console.error(`Issue #${issueNum} missing section: ${sec}`);
      errors++;
    }
  }
});

console.log('\n--- VALIDATING MASTER 140 ISSUES ---');
const masterRows = parseCSV(fs.readFileSync(masterPath, 'utf8'));
console.log('Master total issues:', masterRows.length - 1);
if (masterRows.length - 1 !== 140) {
  console.error(`❌ Expected 140 issues in Master CSV, found ${masterRows.length - 1}`);
  errors++;
}

if (errors === 0) {
  console.log('🎉 ALL 100 BATCH-3 ISSUES & 140 MASTER ISSUES VALIDATED 100% PERFECTLY!');
} else {
  console.error(`❌ Validation failed with ${errors} errors.`);
  process.exit(1);
}
