const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

const search = (index, body) => {
    return esClient.search({index: index, body: body});
  };
  
  const test = () => {
    let body = {
      size: 20,
      from: 0,
      query: {
        match_all: {}
      }
    };
  
    search('library', body)
    .then(results => {
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      console.log(`returned article titles:`);
      results.hits.hits.forEach(
        (hit, index) => console.log(
          `\t${body.from + ++index} - ${hit._source.title}`
        )
      )
    })
    .catch(console.error);
  };
  
test()