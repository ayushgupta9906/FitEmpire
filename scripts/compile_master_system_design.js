const fs = require('fs');
const path = require('path');

const sectionsDir = path.resolve(__dirname, 'design_sections');
const outputFile = path.resolve(__dirname, '../SYSTEM_DESIGN.md');

console.log('Compiling Master System Design from sections...');

const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.md')).sort();

let totalContent = '';

for (const file of files) {
  const filePath = path.join(sectionsDir, file);
  console.log(`Reading ${file}...`);
  const content = fs.readFileSync(filePath, 'utf8');
  totalContent += content.trim() + '\n\n';
}

fs.writeFileSync(outputFile, totalContent.trim() + '\n', 'utf8');

const stats = fs.statSync(outputFile);
const lineCount = totalContent.split('\n').length;
const wordCount = totalContent.split(/\s+/).length;

console.log(`\n======================================================`);
console.log(`✅ Master SYSTEM_DESIGN.md Compilation Complete!`);
console.log(`   - Output File: ${outputFile}`);
console.log(`   - Total Size: ${(stats.size / 1024).toFixed(2)} KB (${stats.size} bytes)`);
console.log(`   - Total Lines: ${lineCount}`);
console.log(`   - Total Words: ${wordCount}`);
console.log(`   - Total Sections Compiled: ${files.length}`);
console.log(`======================================================\n`);
