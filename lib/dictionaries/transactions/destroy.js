var Q = require('q');

module.exports = function(opts){
  var dbConnection = opts.dbConnection;

  return function(filters){
    var deferred = Q.defer();

    dbConnection().then(function(db){
      db.collection('dictionaries').findOneAndDelete(filters).then(function(dict){
        deferred.resolve(dict.value);
      });
    });

    return deferred.promise;
  };
};