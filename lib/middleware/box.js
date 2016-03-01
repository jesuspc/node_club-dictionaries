module.exports = function(boxer){
  boxer.set('middleware.databaseClient', function(){
    return boxer.fetcher('middleware')('persistence.client');
  });

  boxer.set('middleware.cirrusClient', function(){
    return boxer.fetcher('middleware')('cirrus.client');
  });

  boxer.set('middleware.loggerTool', function(){
    return boxer.fetcher('middleware')('loggerFactory').getLogger('api');
  });

  boxer.set('middleware.logger', function(){
    return require('morgan')('dev');
  });

  boxer.set('middleware.bodyParser.json', function(){
    return require('body-parser').json();
  });

  boxer.set('middleware.bodyParser.urlEncoded', function(){
    return require('body-parser').urlencoded({ extended: false });
  });

  boxer.set('middleware.publicFiles', function(){
    var express = require('express'),
        path    = require('path');
    return express.static(path.join(__dirname, 'public'));
  });

  boxer.set('middleware.cookieParser', function(){
    return require('cookie-parser')();
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

  boxer.set('middleware.healthcheck', function(){
    return require('./healthcheck')(boxer.fetcher('middleware'));
  });

  boxer.set('middleware.session', function() {
    return require('./session')(boxer.fetcher('middleware'));
  });

  boxer.set('middleware.swaggerUi', function(){
    var express = require('express');
    return express.static('public/swagger');
  });
};
