fetch('https://ayush150152-fitempire-api.hf.space/api/v1/auth/login', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://fitempire.netlify.app',
    'Access-Control-Request-Method': 'POST'
  }
}).then(res => {
  console.log('Status:', res.status);
  console.log('Headers:');
  for (let [key, value] of res.headers.entries()) {
    console.log(`${key}: ${value}`);
  }
}).catch(console.error);
