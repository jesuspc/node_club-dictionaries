module.exports = function() {
  return {
    default: function(req, res, next) {
      if(req.params.scope !== 'users' && req.params.scope !== 'accounts') {
        res.status(400);
        res.send({'error':'scope does not have a valid value'});
        return;
      } else {
        next();
      }
    },
    ensureDictionaryName: function(req, res, next) {
      if(req.body.name === undefined) {
        req.body.name = req.params.name;
      }
      next();
    },
    ensureCorrectFilterFormat: function(req, res, next){
      if(req.query.filters){
        var incomingFilters = req.query.filters;
        if (typeof incomingFilters == 'object'){
          for (var key in incomingFilters){
            filters[key] = incomingFilters[key];
          }
        }else{
          res.sendStatus(400);
        }
      }
      next();
    }
  }
};