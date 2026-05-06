const http = require('http');

const data = JSON.stringify({
  name: 'Test Project',
  email: 'test@example.com',
  message: 'Testing the new unique endpoint'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/execute/booking',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('NEW ENDPOINT STATUS:', res.statusCode, body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
