var Q = require('q');

module.exports = function(opts) {
  var request = opts.request;
  var authUrl = opts.authUrl;
  var isAliveUrl = opts.isAliveUrl;

  return {
    getCurrentUser: function(cookies) {
      var deferred = Q.defer();
      var requestOpts = { url: authUrl, headers: { 'Cookie': cookies } };
      request(requestOpts, function (error, response) {
        var userData;

        if(!error && response.statusCode === 200) {
          userData = JSON.parse(response.body);
          deferred.resolve(userData);
        } else {
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
