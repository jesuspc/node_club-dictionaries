module.exports = function(opts) {
  var conditions = opts.conditions || [];

  return function(req, res, next) {
    var isAuthorized = conditions.reduce(function(sum, auth) {
      return sum || auth(req);
    }, false);

    if (isAuthorized) {
      next();
    } else {
      res.status(403).json({
        error_code: "forbidden",
        error_msg: "You are not allowed to access this scope"
      });
    }
  };
};