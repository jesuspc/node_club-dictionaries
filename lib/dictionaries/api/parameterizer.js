module.exports = function() {
  var changeCurrent = function(req) {
    if (req.params.uuid === 'current') {
      req.params.uuid = req.currentUser.uuid;
    }
  };

  return {
    default: function(req, res, next) {
      changeCurrent(req);

      if(req.params.scope !== 'users' && req.params.scope !== 'accounts') {
        res.status(400);
        res.send({'error':'scope does not have a valid value'});
        return;
      } else {
        next();
      }
    },
    nameInBody: function(req, res, next) {
      if(req.body.name === undefined) {
        req.body.name = req.params.name;
      }
      next();
    },
    filterFormat: function(req, res, next){
      if(!req.query.filters){
        req.query.filters = {};
      } else if (typeof req.query.filters != 'object'){
        res.sendStatus(400);
        return;
      }
      next();
    }
  };
};
