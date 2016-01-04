module.exports = function(boxer) {
  boxer.set('persistence.database', function(){
    return 'dictionaries';
  });

  boxer.set('persistence.location', function(){
    return 'localhost:27017';
  });

  boxer.set('persistence.mongo.client', function(){
    return require('mongodb').MongoClient;
  });

  boxer.set('persistence.mongo.url', function(){
    var box = boxer.box();

    return 'mongodb://' + box.persistence.location() + '/' + box.persistence.database();
  });

  boxer.set('persistence.client', function(){
    var box = boxer.box();
    var Q = require('q');

    return require('./dbClient')({
      client: box.persistence.mongo.client(),
      url: box.persistence.mongo.url()
    });
  });

  boxer.set('persistence.dbConnection', function(){
    var box = boxer.box();

    return box.persistence.client().connection;
  });
};