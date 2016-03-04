module.exports = function(boxer) {
  boxer.setMainBoxFolder(__dirname);

  boxer.autoloadInner();

  boxer.enbox('middleware');
  boxer.enbox('persistence');
  boxer.enbox('cirrus');
  boxer.enbox('dictionaries');

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
};
