var Q = require('q');

module.exports = function(opts) {
  var request = opts.request;
  var authUrl = opts.authUrl;
  var isAliveUrl = opts.isAliveUrl;
  var logger = opts.logger;

  return {
    getCurrentUser: function(cookies) {
      var deferred = Q.defer();
      var requestOpts = { url: authUrl, headers: { 'Cookie': cookies } };

      logger.info(
        "Requesting authentication agains " + authUrl + " with Cookies " +
        cookies
      );

      request(requestOpts, function (error, response) {
        var userData;

        if(!error && response.statusCode === 200) {
          logger.debug(
            "[SUCCESS] For " + authUrl + " for cookies: " + cookies
          );

          userData = JSON.parse(response.body);
          deferred.resolve(userData);
        } else {
          logger.debug(
            "[FAILURE] For " + authUrl + " for cookies: " + cookies
          );

          deferred.reject(error);
        }
      });

      return deferred.promise;
    },
    isHealthy: function(){
      var deferred = Q.defer();
      var requestOpts = { url: isAliveUrl };

      request(requestOpts, function (error, response, body){
        if (response.statusCode === 200) {
          deferred.resolve({
            healthy: true
          });
        } else {
          deferred.resolve({
            healthy: false
          });
        }
      });

      return deferred.promise;
    }
  };
};
