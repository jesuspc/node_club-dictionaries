module.exports = function(boxer) {
  var fetch = boxer.fetcher('');

  boxer.set('config', function(){
    return boxer.root('config').persistence;
  })

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

  boxer.set('client', function(){
    return require('./dbClient')(fetch);
  });

  boxer.set('dbConnection', function(){
    return fetch('client').connection;
  });
};