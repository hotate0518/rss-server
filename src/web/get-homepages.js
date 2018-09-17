const feeds = require('../feeds/feeds');

exports.main = async () => {
  const homepages = [];

  feeds.list.forEach((el) => {
    homepages.push({
      id: el.id,
      title: el.title,
      homepage: el.homepage,
    });
  });
  return homepages;
};
