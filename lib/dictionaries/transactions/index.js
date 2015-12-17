var Q = require('q');

module.exports = function(opts){
  var dbConnection = opts.dbConnection;

  return function(filters){
    var deferred = Q.defer();

    dbConnection().then(function(db){
      db.collection('dictionaries').find(filters).toArray().then(function(dicts){
        deferred.resolve(dicts);
      });
    });

    return deferred.promise;
  };
};