module.exports = function(boxer) {
  var fetch = boxer.fetch;

  boxer.autoloadInner();

  boxer.set('config', function(){
    return boxer.root('config').persistence;
  });

  boxer.set('database', function(){
    return fetch('config').database;
  });

  boxer.set('location', function(){
    return fetch('config').location;
  });

  boxer.set('mongoClient', function(){
    return require('mongodb').MongoClient;
  });

  boxer.set('mongo.url', function(){
    return 'mongodb://'+fetch('location')+'/'+fetch('database');
  });

  boxer.set('dbConnection', function(){
    return fetch('client').connection;
  });
};