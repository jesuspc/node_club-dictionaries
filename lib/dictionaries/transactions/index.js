module.exports = function(opts){
  var dbConnection = opts.dbConnection;

  return function(filters, callback){
    dbConnection(function(db, dbCallback){
      db.collection('dictionaries').find(filters).toArray(function(err, dicts){
        if(err){
          throw err;
        } else {
          callback(dicts, dbCallback, db);
        }
      });
    });
  };
};