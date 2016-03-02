module.exports = function(boxer){
  var fetch = boxer.fetch;

  boxer.set('databaseClient', function(){
    return fetch('persistence.client');
  });

  boxer.set('cirrusClient', function(){
    return fetch('cirrus.client');
  });

  boxer.set('loggerTool', function(){
    return fetch('loggerFactory').getLogger('api');
  });

  boxer.set('logger', function(){
    return require('morgan')('dev');
  });

  boxer.set('bodyParser.json', function(){
    return require('body-parser').json();
  });

  boxer.set('bodyParser.urlEncoded', function(){
    return require('body-parser').urlencoded({ extended: false });
  });

  boxer.set('publicFiles', function(){
    var express = require('express'),
        path    = require('path');
    return express.static(path.join(__dirname, 'public'));
  });

  boxer.set('cookieParser', function(){
    return require('cookie-parser')();
  });

  boxer.set('errorHandler.notFound', function(){
    return function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    };
  });

  boxer.set('errorHandler.stackTrace', function(){
    return function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    };
  });

  boxer.set('errorHandler.silent', function(){
    return function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    };
  });

  boxer.set('healthcheck');
  boxer.set('session');

  boxer.set('swaggerUi', function(){
    var express = require('express');
    return express.static('public/swagger');
  });
};
