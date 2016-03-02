module.exports = function(boxer) {
  boxer.set('dbConnection', function(){
    return boxer.fetcher()('persistence.dbConnection');
  });

  boxer.set('index');
  boxer.set('show');
  boxer.set('upsert');
  boxer.set('destroy');
};