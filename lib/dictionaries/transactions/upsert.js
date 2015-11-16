var Q = require('q');

module.exports = function(opts){
  var dbConnection = opts.dbConnection;

  return function(filters, dictionaryData){
    var deferred = Q.defer();

    dbConnection().then(function(db){
      db.collection('dictionaries').findOneAndUpdate(filters, dictionaryData, {upsert: true, returnOriginal: false}).then(function(dict){
        deferred.resolve(dict.value);
      })
    })
    
    return deferred.promise;
  };
};