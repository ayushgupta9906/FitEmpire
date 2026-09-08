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

const batch4Path = path.resolve(__dirname, '..', 'jira_issues_batch4.csv');
const final200Path = path.resolve(__dirname, '..', 'jira_issues_final_200.csv');

console.log('--- VALIDATING BATCH 4 (60 ISSUES) ---');
const b4Rows = parseCSV(fs.readFileSync(batch4Path, 'utf8'));
console.log('Headers:', b4Rows[0]);
console.log('Total issues:', b4Rows.length - 1);

let errors = 0;
if (b4Rows.length - 1 !== 60) {
  console.error(`❌ Expected 60 issues in Batch 4, found ${b4Rows.length - 1}`);
  errors++;
}

b4Rows.slice(1).forEach((r, idx) => {
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

console.log('\n--- VALIDATING FINAL 200 ISSUES ---');
const finalRows = parseCSV(fs.readFileSync(final200Path, 'utf8'));
console.log('Final master total issues:', finalRows.length - 1);
if (finalRows.length - 1 !== 200) {
  console.error(`❌ Expected 200 issues in Final Master CSV, found ${finalRows.length - 1}`);
  errors++;
}

if (errors === 0) {
  console.log('🎉 ALL 60 BATCH-4 ISSUES & ALL 200 FINAL MASTER ISSUES VALIDATED 100% PERFECTLY!');
} else {
  console.error(`❌ Validation failed with ${errors} errors.`);
  process.exit(1);
}
