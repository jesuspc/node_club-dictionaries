module.exports = function(){
  var boxer = require('../boxer')();
  var box = require('../box')(boxer, function(overrides){
    overrides.set('persistence.database', function(){
      return 'dictionaries_test';
    });
    overrides.set('middleware.logger', function(){
      return function(req, res, next) { next(); };
    });
  });

  return box;
};
