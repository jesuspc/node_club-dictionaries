var Q = require('q');

module.exports = function(inject){
  var dbConnection = inject('dbConnection');

  return function(filters){
    var deferred = Q.defer();

    dbConnection().then(function(db){
      db.collection('dictionaries').findOne(filters).then(function(dict){
        deferred.resolve(dict);
      });
    });

    return deferred.promise;
  };
};