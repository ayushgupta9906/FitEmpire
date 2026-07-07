import { spawn } from 'child_process';

console.log('Starting Surge deployment...');

const child = spawn('npx.cmd', ['surge', './dist', 'fitempire-admin-2026.surge.sh'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

child.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  
  if (output.toLowerCase().includes('email:')) {
    child.stdin.write('ayush.fitempire@mailinator.com\n');
  }
  if (output.toLowerCase().includes('password:')) {
    child.stdin.write('FitEmpire2026!\n');
  }
});

child.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

child.on('close', (code) => {
  console.log('\nDeployment process exited with code', code);
  if (code === 0) {
    console.log('Successfully deployed to http://fitempire-admin-2026.surge.sh');
  }
});
