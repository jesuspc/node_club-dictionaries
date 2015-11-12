module.exports = function() {
  return {
    default: function(req, res, next) {
      if(req.params.scope !== 'users' && req.params.scope !== 'accounts') {
        res.status(400);
        res.send({'error':'scope does not have a valid value'});
        return;
      }
      next();
    }
  }
};