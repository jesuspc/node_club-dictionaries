module.exports = function(){
  var boxer = require('../boxer')();
  var box = require('../box')(boxer, function(overrides){
    overrides.set('persistence.database', function(){
      return 'dictionaries_test';
    });
  });

  return box;
};