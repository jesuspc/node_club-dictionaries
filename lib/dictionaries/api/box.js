module.exports = function(boxer) {
  boxer.autoloadInner();

  boxer.set('serialize', function(){
    return boxer.fetch('serializer').base;
  });

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