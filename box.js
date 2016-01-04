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
    return require('./lib/middleware/authorizer');
  });

  boxer.set('middleware.healthcheck', function(){
    var api = require('./lib/middleware/healthcheck');
    return api({
      router: box.router(),
      dependencies: {
        databaseClient: box.persistence.client(),
        cirrusClient: box.cirrus.client()
      }
    });
  });

  boxer.set('dictionaries.api.middleware', function(){
    var api = require('./lib/dictionaries/api');
    var isOwner = function(req) {
      return req.currentUser.uuid === req.params.uuid;
    };
    var inAccount = function(req) {
      return req.currentUser.account.uuid === req.params.uuid;
    };

    return api({
      router: box.router(),
      transactions: {
        index: box.dictionaries.transactions.index(),
        show: box.dictionaries.transactions.show(),
        upsert: box.dictionaries.transactions.upsert(),
        destroy: box.dictionaries.transactions.destroy()
      },
      parameterizer: box.dictionaries.api.parameterizer(),
      authorize: box.middleware.authorizers()({
        conditions: [isOwner, inAccount]
      }),
      serialize: box.dictionaries.serializer().base
    });
  });

  boxer.set('dictionaries.serializer', function(){
    return require('./lib/dictionaries/serializer')();
  });


  boxer.set('dictionaries.api.parameterizer', function() {
    return require('./lib/dictionaries/api/parameterizer')();
  });

  boxer.set('httpRequest', function(){
    return require('request');
  });

  boxer.set('cirrus.baseUrl', function(){
    return 'https://qa.workshare.com';
  });

  boxer.set('cirrus.authPath', function(){
    return '/api/v1.4/current_user.json?includes=a.core';
  });

  boxer.set('cirrus.authUrl', function(){
    return box.cirrus.baseUrl() + box.cirrus.authPath();
  });

  boxer.set('cirrus.isAliveUrl', function(){
    return box.cirrus.baseUrl() + '/is_alive';
  });

  boxer.set('cirrus.client', function(){
    return require('./lib/cirrusClient')({
      authUrl: box.cirrus.authUrl(),
      isAliveUrl: box.cirrus.isAliveUrl(),
      request: box.httpRequest()
    });
  });

  boxer.set('middleware.session', function() {
    return require('./lib/middleware/session')({
      authenticator: box.cirrus.client()
    });
  });

  boxer.set('dictionaries.transactions.index', function(){
    var transaction = require('./lib/dictionaries/transactions/index');
    return transaction({
      dbConnection: box.persistence.dbConnection()
    });
  });

  boxer.set('dictionaries.transactions.show', function(){
    var transaction = require('./lib/dictionaries/transactions/show');
    return transaction({
      dbConnection: box.persistence.dbConnection()
    });
  });

  boxer.set('dictionaries.transactions.upsert', function(){
    var transaction = require('./lib/dictionaries/transactions/upsert');
    return transaction({
      dbConnection: box.persistence.dbConnection()
    });
  });

  boxer.set('dictionaries.transactions.destroy', function(){
    var transaction = require('./lib/dictionaries/transactions/destroy');
    return transaction({
      dbConnection: box.persistence.dbConnection()
    });
  });

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
    return 'mongodb://' + box.persistence.location() + '/' + box.persistence.database();
  });

  boxer.set('persistence.client', function(){
    var Q = require('q');
    return require('./lib/dbClient')({
      client: box.persistence.mongo.client(),
      url: box.persistence.mongo.url()
    });

  });

  boxer.set('persistence.dbConnection', function(){
    return box.persistence.client().connection;
  });

  boxer.set('router', function(){
    var express = require('express');
    return express.Router();
  });

  boxer.set('middleware.swaggerUi', function(){
    var express = require('express');
    return express.static('public/swagger');
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
    app.use(box.middleware.session());
    app.use('/admin', box.middleware.healthcheck());
    app.use('/swagger', box.middleware.swaggerUi());
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
