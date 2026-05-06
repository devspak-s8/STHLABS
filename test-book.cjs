const http = require('http');

const data = JSON.stringify({
  name: 'Test',
  email: 'test@example.com',
  message: 'Hello'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/book',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('BOOK POST STATUS:', res.statusCode, body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
