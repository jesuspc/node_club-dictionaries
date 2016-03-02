module.exports = function(boxer) {
  boxer.autoloadInner();
  boxer.set('dbConnection', function(){
    return boxer.fetch('persistence.dbConnection');
  });
};