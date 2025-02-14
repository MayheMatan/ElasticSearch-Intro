const elasticsearch = require('elasticsearch');
const fs = require('fs');

const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
});


const bulkIndex = (index, type, data) => {
    let bulkBody = [];

    data.forEach(item => {
      bulkBody.push({
        index: {
          _index: index,
          _type: type,
          _id: item.id
        }
      });
  
      bulkBody.push(item);
    });
  
    esClient.bulk({body: bulkBody})
    .then(response => {
      console.log('here');
      let errorCount = 0;
      response.items.forEach(item => {
        if (item.index && item.index.error) {
          console.log(++errorCount, item.index.error);
        }
      });
      console.log(
        `Successfully indexed ${data.length - errorCount}
         out of ${data.length} items`
      );
    })
    .catch(console.err);
  };
  
  const test = () => {
    const articlesRaw = fs.readFileSync('data.json');
    const articles = JSON.parse(articlesRaw);
    console.log(`${articles.length} items parsed from data file`);
    bulkIndex('library', 'article', articles);
  };

  test();
  