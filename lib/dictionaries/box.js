module.exports = function(boxer) {
  boxer.set('dbConnection', function(){
    return boxer.fetcher('api')('persistence.dbConnection');
  });

  boxer.set('api.middleware', function(){
    return require('./api')(boxer.fetcher('api'));
  });

  boxer.set('api.serialize', function(){
    return require('./serializer')().base;
  });

  boxer.set('api.parameterizer', function() {
    return require('./api/parameterizer')();
  });

  boxer.set('api.authorize', function(){
    var isOwner = function(req) {
      return req.currentUser.uuid === req.params.uuid;
    };
    var inAccount = function(req) {
      return req.currentUser.account.uuid === req.params.uuid;
    };

    return require('./api/authorizer')({
      conditions: [isOwner, inAccount]
    });
  });

  boxer.set('transactions.index', function(){
    var transaction = require('./transactions/index');
    return transaction(boxer.fetcher('transactions'));
  });

  boxer.set('transactions.show', function(){
    var transaction = require('./transactions/show');
    return transaction(boxer.fetcher('transactions'));
  });

  boxer.set('transactions.upsert', function(){
    var transaction = require('./transactions/upsert');
    return transaction(boxer.fetcher('transactions'));
  });

  boxer.set('transactions.destroy', function(){
    var transaction = require('./transactions/destroy');
    return transaction(boxer.fetcher('transactions'));
  });
};