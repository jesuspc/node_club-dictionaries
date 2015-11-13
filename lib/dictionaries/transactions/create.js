var Q = require('q');

module.exports = function(opts){
  var dbConnection = opts.dbConnection;

  return function(filters, payload){
    var deferred = Q.defer();

    dbConnection().then(function(db){
      db.collection('dictionaries').findOneAndUpdate(filters, payload, {upsert: true, returnOriginal: false} ).then(function(dict){
        deferred.resolve(dict.value);
      })
  	})
    
    return deferred.promise;
  };;
};


/*


      db.collection('dictionaries').findOneAndUpdate(filters, {name:'dict1'}, {upsert: true}, function(dict){
      	console.log('dict = ')
      	console.log(dict)
      	deferred.resolve(dict)
*/