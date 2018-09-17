const getArticles = require('./src/articles/get-articles');
const getHomepages = require('./src/web/get-homepages');
// event: 受信パラメータ
// context AWS lambdaで使用する様々なパラメータ。
exports.handler = (event) => {
  let result = {};
  console.log(`event received: ${JSON.stringify(event, null, 4)}`);
  if (!event || !event.service) {
    console.log('no service');
    return result;
  }

  switch (event.service) {
    case 'get-articles':
      console.log('articles');
      result = getArticles.main();
      return result;
    case 'get-homepages':
      console.log('homepages');
      result = getHomepages.main();
      return result;
    default:
      return result;
  }
};
