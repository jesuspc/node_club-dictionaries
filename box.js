module.exports = function(boxer, overrides) {
  var box;

  boxer.set('middleware.logger', function(){
    var logger = require('morgan');
    return logger('dev');
  });

  boxer.set('middleware.bodyParser.json', function(){
    var bodyParser = require('body-parser');
    return bodyParser.json();
  });

  boxer.set('middleware.bodyParser.urlEncoded', function(){
    var bodyParser = require('body-parser');
    return bodyParser.urlencoded({ extended: false });
  });

  boxer.set('middleware.publicFiles', function(){
    var express = require('express'),
        path    = require('path');
    return express.static(path.join(__dirname, 'public'));
  });

  boxer.set('middleware.cookieParser', function(){
    var cookieParser = require('cookie-parser');
    return cookieParser();
  });

  boxer.set('middleware.errorHandler.notFound', function(){
    return function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    };
  });

  boxer.set('middleware.errorHandler.stackTrace', function(){
    return function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    };
  });

  boxer.set('middleware.errorHandler.silent', function(){
    return function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    };
  });

  boxer.set('middleware.authorizers', function(){
    return require('./lib/middleware/authorizers')();
  });

  boxer.set('dictionaries.api.middleware', function(){
    var api = require('./lib/dictionaries/api');
    return api({
      router: box.router(),
      transactions: {
        index: box.dictionaries.transactions.index(),
        show: box.dictionaries.transactions.show(),
        create: box.dictionaries.transactions.create(),
        destroy: box.dictionaries.transactions.destroy()
      },
      parameterize: box.dictionaries.api.parameterizer().default,
      authorize: box.middleware.authorizers().ownerOrAccount,
      serialize: box.dictionaries.serializer().base
    });
  });

  boxer.set('dictionaries.serializer', function(){
    return require('./lib/dictionaries/serializer')();
  });


  boxer.set('dictionaries.api.parameterizer', function() {
    return require('./lib/dictionaries/api/parameterizer')();
  });

  boxer.set('middleware.session', function() {
    return require('./lib/middleware/session')();
  });

  boxer.set('dictionaries.transactions.index', function(){
    var transaction = require('./lib/dictionaries/transactions/index');
    return transaction({
      dbConnection: box.persistence.client()
    });
  });

  boxer.set('dictionaries.transactions.show', function(){
    var transaction = require('./lib/dictionaries/transactions/show');
    return transaction({
      dbConnection: box.persistence.client()
    });
  });

  boxer.set('dictionaries.transactions.create', function(){
    var transaction = require('./lib/dictionaries/transactions/create');
    return transaction({
      dbConnection: box.persistence.client()
    });
  });

  boxer.set('dictionaries.transactions.destroy', function(){
    var transaction = require('./lib/dictionaries/transactions/destroy');
    return transaction({
      dbConnection: box.persistence.client()
    });
  });

  boxer.set('persistence.database', function(){
    return 'dictionaries';
  });

  boxer.set('persistence.location', function(){
    return 'localhost:27017';
  });

  boxer.set('persistence.client', function(){
    var client = require('mongodb').MongoClient;
    var Q = require('q');
    var url = 'mongodb://' + box.persistence.location() + '/' + box.persistence.database();

    return function() {
      var deferred = Q.defer();

      client.connect(url).then(function(db){
        deferred.resolve(db);
      }).then(function() {
        db.close;
      });

      return deferred.promise;
    };
  });

  boxer.set('router', function(){
    var express = require('express');
    return express.Router();
  });

  boxer.set('app', function(){
    var path = require('path'),
        app  = require('express')();

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(box.middleware.logger());
    app.use(box.middleware.bodyParser.json());
    app.use(box.middleware.bodyParser.urlEncoded());
    app.use(box.middleware.cookieParser());
    app.use(box.middleware.publicFiles());
    // Session middleware should request authentication to Cirrus and
    // add current user to the request object
    app.use(box.middleware.session());
    app.use('/api/v1.0', box.dictionaries.api.middleware());
    app.use(box.middleware.errorHandler.notFound());

    if(app.get('env') === 'development'){
      app.use(box.middleware.errorHandler.stackTrace());
    } else {
      app.use(box.middleware.errorHandler.silent());
    }

    return app;
  });

  if(overrides) overrides(boxer);

  box = boxer.box();

  return box;
};
