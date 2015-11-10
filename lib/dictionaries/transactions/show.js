module.exports = function(opts){
  var dbConnection = opts.dbConnection;

  return function(filters, callback){
    dbConnection(function(db, dbCallback){
      db.collection('dictionaries').findOne(filters, {}, function(err, dict) {
        if(err){
          throw err;
        } else {
          callback(dict, dbCallback, db);
        }
      });
    });
  };
};