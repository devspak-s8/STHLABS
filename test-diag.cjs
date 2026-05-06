const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/protocol-status',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', res.headers);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('BODY:', body));
});

req.on('error', e => console.error(e));
req.end();
