var Q = require('q');

module.exports = function(opts){
  var dbConnection = opts.dbConnection;

  return function(filters, dictionaryData){
    var deferred = Q.defer();
    var reqOpts = {upsert: true, returnOriginal: false};

    dbConnection().then(function(db){
      db.collection('dictionaries')
        .findOneAndUpdate(filters, dictionaryData, reqOpts).then(function(dict){
          deferred.resolve(dict.value);
        });
    });

    return deferred.promise;
  };
};