const http = require('http');

const data = JSON.stringify({
  name: "Sulayman",
  email: "test@example.com",
  message: "Test message from the test suite",
  tier: "Custom"
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/contact',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, body));
});
req.on('error', e => console.error(e));
req.write(data);
req.end();
