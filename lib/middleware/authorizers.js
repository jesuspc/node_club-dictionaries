module.exports = function() {
  var isOwner = function(req) {
    return req.currentUser.uuid === req.params.uuid;
  };

  var inAccount = function(req) {
    return req.currentUser.account.uuid === req.params.uuid;
  };

  return {
    ownerOrAccount: function(req, res, next){
      if (isOwner(req) || inAccount(req)) {
        next();
      } else {
        res.status(403).json({
          error_code: "forbidden",
          error_msg: "You are not allowed to access this scope"
        });
      }
    }
  };
};