module.exports = function(opts){
  var dbConnection = opts.dbConnection;

  return function(filters, callback){
    dbConnection(function(db, dbCallback){
      db.collection('dictionaries').findOne(filters).then(function(dict) {
        callback(dict, dbCallback, db);
      });
    });
  };
};