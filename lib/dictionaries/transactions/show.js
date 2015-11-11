var Q = require('q');

module.exports = function(opts){
  var dbConnection = opts.dbConnection;

  function findOneDictionary(filters){
    var deferred = Q.defer();

    dbConnection().then(function(db){
      db.collection('dictionaries').findOne(filters).then(function(dict){
        deferred.resolve(dict);
      });
    });

    return deferred.promise;
  };

  return findOneDictionary;
};