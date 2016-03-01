module.exports = function(boxer) {
  var fetch = boxer.fetcher('persistence');

  boxer.set('persistence.config', function(){
    return boxer.fetcher('')('config').persistence;
  })

  boxer.set('persistence.database', function(){
    return fetch('config').database;
  });

  boxer.set('persistence.location', function(){
    return fetch('config').location;
  });

  boxer.set('persistence.mongoClient', function(){
    return require('mongodb').MongoClient;
  });

  boxer.set('persistence.mongo.url', function(){
    return 'mongodb://'+fetch('location')+'/'+fetch('database');
  });

  boxer.set('persistence.client', function(){
    return require('./dbClient')(fetch);
  });

  boxer.set('persistence.dbConnection', function(){
    return fetch('client').connection;
  });
};