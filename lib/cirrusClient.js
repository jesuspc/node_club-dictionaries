var Q = require('q');

module.exports = function(opts) {
  var request = opts.request;
  var authUrl = opts.authUrl;

  return {
    getCurrentUser: function(cookies) {
      var deferred = Q.defer();
      var requestOpts = { url: authUrl, headers: { 'Cookie': cookies } }
      request(requestOpts, function (error, response, body) {
        var userData;

        if(!error && response.statusCode === 200) {
          userData = JSON.parse(response.body);
          deferred.resolve(userData);
        } else {
          deferred.reject(error);
        }
      });

      return deferred.promise;
    }
  }
};