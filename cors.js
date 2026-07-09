process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
fetch('https://ayush150152-fitempire-api.hf.space/api/v1/auth/login', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://fitempire.netlify.app',
    'Access-Control-Request-Method': 'POST'
  }
}).then(async res => {
  console.log('Status: ' + res.status);
  const text = await res.text();
  console.log('Body: ' + text.substring(0, 500));
}).catch(console.error);
