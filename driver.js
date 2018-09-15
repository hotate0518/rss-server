const lambda = require('./index');

const test = async () => {
  const result = await lambda.handler();
  console.log(JSON.stringify(result, null, 3));
};
test();
