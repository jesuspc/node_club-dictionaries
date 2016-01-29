module.exports = function(boxer){
  boxer.set('middleware.loggerTool', function(){
    var box = boxer.box();
    return box.loggerFactory().getLogger('api');
  });

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

  boxer.set('middleware.authorizer', function(){
    return require('./authorizer');
  });

  boxer.set('middleware.healthcheck', function(){
    var api = require('./healthcheck');
    var box = boxer.box();

    return api({
      databaseClient: box.persistence.client(),
      cirrusClient: box.cirrus.client()
    });
  });

  boxer.set('middleware.session', function() {
    var box = boxer.box();

    return require('./session')({
      authenticator: box.cirrus.client(),
      logger: box.middleware.loggerTool()
    });
  });

  boxer.set('middleware.swaggerUi', function(){
    var express = require('express');
    return express.static('public/swagger');
  });
};
