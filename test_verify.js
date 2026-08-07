const http = require('http');

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('Sending OTP with purpose and phone...');
  const sendRes = await postJson('/api/v1/auth/otp/send', { phone: '9876543210', purpose: 'LOGIN' });
  console.log('SEND OTP STATUS:', sendRes.status, sendRes.data);

  if (sendRes.data && sendRes.data.data) {
    const otp = sendRes.data.data;
    console.log('Verifying OTP with code:', otp);
    const verifyRes = await postJson('/api/v1/auth/otp/verify', { phone: '9876543210', otp: otp, purpose: 'LOGIN' });
    console.log('VERIFY STATUS:', verifyRes.status, verifyRes.data);
  }
}

run().catch(console.error);
