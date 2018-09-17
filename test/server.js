const http = require('http');
const lambda = require('../index');

const header = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};
const port = 8081;
console.log(`Listen port ${port}`);

const responseRss = async (event, request, response) => {
  const result = await lambda.handler(event);
  response.writeHead(200, header);
  response.write(JSON.stringify(result));
  console.log(JSON.stringify(result, null, 4));
  response.end();
};

http.createServer((request, response) => {
  const event = {};
  switch (request.url) {
    case '/get-articles':
      event.service = 'get-articles';
      break;
    case '/get-homepages':
      event.service = 'get-homepages';
      break;
    default:
      response.end();
      break;
  }
  responseRss(event, request, response);
}).listen(port);
