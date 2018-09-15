
const https = require('http');
const FeedParser = require('feedparser');
const rss = require('./src/rss/rss.json');

const process = el => new Promise((resolve) => {
  const items = [];
  https.get(el.url, (response) => {
    const feedparser = new FeedParser({});
    feedparser.on('meta', (meta) => {
      console.log('==== %s ====', meta.title);
    });
    feedparser.on('readable', () => {
      const stream = feedparser;
      let item = stream.read();
      // chunkデータを保存する
      while (item) {
        const ep = {
          title: item.title,
          mediaUrl: item.link,
          publicationDate: item.pubDate,
        };
        items.push(ep);
        item = stream.read();
      }
    });
    feedparser.on('end', () => {
      console.log('feedparser end');
      resolve(items);
    });
    response.pipe(feedparser);
    response.on('end', () => {
      console.log('response end');
    });
  });
});

// event: 受信パラメータ
// context AWS lambdaで使用する様々なパラメータ。
exports.handler = async (event) => {
  console.log(`event received: ${JSON.stringify(event, null, 4)}`);
  const processes = [];
  rss.forEach((el) => {
    processes.push(process(el));
  });
  const rssList = await Promise.all(processes);
  return rssList;
};
