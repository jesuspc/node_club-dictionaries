module.exports = function(boxer, overrides) {
  var box;

  require('./lib/middleware/box')(boxer);
  require('./lib/persistence/box')(boxer);
  require('./lib/cirrus/box')(boxer);
  require('./lib/dictionaries/box')(boxer);

  boxer.set('config', function(){
    var fs = require('fs');
    var filePath;

    if(fs.existsSync('./config/application.json')) {
      filePath = './config/application.json';
    } else {
      filePath = './config/application-sample.json';
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  });

  boxer.set('loggerFactory', function(){
    var log4js = require('log4js');
    log4js.configure(box.config().loggers.config, {});

    return log4js;
  });

  boxer.set('httpRequest', function(){
    return require('request');
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
    app.use(box.middleware.session());
    app.use('/admin/healthcheck', box.middleware.healthcheck());
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
