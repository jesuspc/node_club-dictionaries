module.exports = function(inject) {
  var authenticator = inject('cirrus.client');
  var logger = inject('loggerTool');

  return function(req, res, next) {
    var cookie = req.headers.cookie;

    return authenticator.getCurrentUser(cookie).then(function (userData){
      logger.info(
        "[API][Session][ACCEPTED] Authorization ACCEPTED for request " +
        req.path + " with cookies " + cookie
      );

      req.currentUser = userData;
      next();
    }).fail(function (){
      logger.info(
        "[API][Session][REJECTED] Authorization REJECTED for request " +
        req.path + " with cookies " + cookie
      );

      res.status(401).json({
        "error_code": "not_logged_in", "error_msg": "Not logged in"
      }).end();
    });
  };
};
