const http = require('http');
const lambda = require('./index');

const header = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};
const port = 8081;
console.log(`Listen port ${port}`);
http.createServer(async (request, response) => {
  let result = {};
  result = await lambda.handler();
  response.writeHead(200, header);
  response.write(JSON.stringify(result));
  console.log(JSON.stringify(result, null, 4));
  response.end();
}).listen(port);
