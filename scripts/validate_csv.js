const fs = require('fs');

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

const batch2 = parseCSV(fs.readFileSync('jira_issues_batch2.csv', 'utf8'));
console.log('Batch 2 Header:', batch2[0]);
console.log('Batch 2 Issues count:', batch2.length - 1);
let errors = 0;
batch2.slice(1).forEach((r, i) => {
  if (r.length !== 5) {
    console.error(`Row ${i+1} has ${r.length} columns, expected 5!`);
    errors++;
  }
  if (r[1] === 'Improvement' && r[2] !== 'Low') {
    console.error(`Row ${i+1} (${r[0]}): Improvement must be Low priority, got ${r[2]}!`);
    errors++;
  }
  const labelWords = r[3].trim().split(/\s+/).length;
  if (labelWords > 2) {
    console.warn(`Row ${i+1} label "${r[3]}" has ${labelWords} words!`);
  }
});

const all40 = parseCSV(fs.readFileSync('jira_issues_all_40.csv', 'utf8'));
console.log('All 40 Header:', all40[0]);
console.log('All 40 Issues count:', all40.length - 1);
all40.slice(1).forEach((r, i) => {
  if (r.length !== 5) {
    console.error(`All40 Row ${i+1} has ${r.length} columns!`);
    errors++;
  }
});

if (errors === 0) {
  console.log('🎉 ALL CSV VALIDATIONS PASSED PERFECTLY!');
} else {
  console.error(`❌ Found ${errors} validation errors.`);
  process.exit(1);
}
