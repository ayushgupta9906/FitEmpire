const http = require('http');

const data = JSON.stringify({ phone: '9876543210' });

const req = http.request({
  hostname: 'localhost',
  port: 8080,
  path: '/api/v1/auth/otp/send',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('RESPONSE:', body);
    const parsed = JSON.parse(body);
    if (parsed.data) {
      testVerify(parsed.data);
    }
  });
});

req.on('error', (e) => console.error('ERROR:', e));
req.write(data);
req.end();

function testVerify(otp) {
  const verifyData = JSON.stringify({ phone: '9876543210', otp: otp });
  const verifyReq = http.request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/v1/auth/otp/verify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': verifyData.length
    }
  }, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('\nVERIFY STATUS:', res.statusCode);
      console.log('VERIFY RESPONSE:', body);
    });
  });
  verifyReq.write(verifyData);
  verifyReq.end();
}
