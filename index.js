
const https = require('http');
const FeedParser = require('feedparser');
const moment = require('moment');
const rss = require('./src/rss/rss');

let id = 0;
const process = el => new Promise((resolve) => {
  const items = [];
  https.get(el.feed, (response) => {
    const feedparser = new FeedParser({});
    let name;
    feedparser.on('meta', (meta) => {
      console.log('==== %s ====', meta.title);
      name = meta.title;
    });
    feedparser.on('readable', () => {
      const stream = feedparser;
      let item = stream.read();
      // chunkデータを保存する
      while (item) {
        const ep = {
          id,
          site: name,
          title: item.title,
          mediaUrl: item.link,
          date: moment(item.pubDate).format('YYYY-MM-DD hh:mm:ss'),
        };
        id += 1;
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
  id = 0;
  const processes = [];
  rss.list.forEach((el) => {
    processes.push(process(el));
  });
  const rssList = await Promise.all(processes);
  const sortedlist = rssList
    .reduce((previous, current) => {
      previous.push(...current);
      return previous;
    })
    .sort((val1, val2) => (val1.date < val2.date ? 1 : -1));
  return sortedlist;
};
