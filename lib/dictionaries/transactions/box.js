module.exports = function(boxer) {
  boxer.autoloadInner();
  boxer.set('dbConnection', function(){
    return boxer.fetcher()('persistence.dbConnection');
  });
};