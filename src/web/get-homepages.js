const feeds = require('../feeds/feeds');

exports.main = async () => {
  const homepages = [];

  feeds.list.forEach((el) => {
    homepages.push({
      name: el.name,
      homepage: el.homepage,
    });
  });
  return homepages;
};
