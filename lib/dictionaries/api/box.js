module.exports = function(boxer) {
  boxer.set('middleware');

  boxer.set('serialize', function(){
    return boxer.fetcher()('serializer').base;
  });

  boxer.set('parameterizer');

  boxer.set('authorize', function(){
    var isOwner = function(req) {
      return req.currentUser.uuid === req.params.uuid;
    };
    var inAccount = function(req) {
      return req.currentUser.account.uuid === req.params.uuid;
    };

    return require('./authorizer')({
      conditions: [isOwner, inAccount]
    });
  });
};