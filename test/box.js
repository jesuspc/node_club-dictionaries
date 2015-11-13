module.exports = function(){
  var boxer = require('../boxer')();
  var box = require('../box')(boxer, function(overrides){
    overrides.set('persistence.database', function(){
      return 'dictionaries_test';
    });
    overrides.set('middleware.logger', function(){
      return function(req, res, next) { next(); };
    });
    overrides.set('middleware.session', function(){
      return function(req, res, next) {
        req.currentUser = JSON.parse(req.headers.fakeuser);
        next();
      };
    });
  });

  return box;
};
