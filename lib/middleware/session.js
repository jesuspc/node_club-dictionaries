module.exports = function(opts) {
  var authenticator = opts.authenticator;

  return function(req, res, next) {
    authenticator.getCurrentUser(req.headers.cookie).then(function (userData){
      req.currentUser = userData;
      next();
    }).fail(function (){
      res.status(401).json({
        "error_code": "not_logged_in", "error_msg": "Not logged in"
      });
    });
  };
};
