module.exports = function(boxer) {
  boxer.set('dictionaries.dbConnection', function(){
    return boxer.fetcher('dictionaries.api')('persistence.dbConnection');
  });

  boxer.set('dictionaries.api.middleware', function(){
    return require('./api')(boxer.fetcher('dictionaries.api'));
  });

  boxer.set('dictionaries.api.serialize', function(){
    return require('./serializer')().base;
  });

  boxer.set('dictionaries.api.parameterizer', function() {
    return require('./api/parameterizer')();
  });

  boxer.set('dictionaries.api.authorize', function(){
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

  boxer.set('dictionaries.transactions.index', function(){
    var transaction = require('./transactions/index');
    return transaction(boxer.fetcher('dictionaries.transactions'));
  });

  boxer.set('dictionaries.transactions.show', function(){
    var transaction = require('./transactions/show');
    return transaction(boxer.fetcher('dictionaries.transactions'));
  });

  boxer.set('dictionaries.transactions.upsert', function(){
    var transaction = require('./transactions/upsert');
    return transaction(boxer.fetcher('dictionaries.transactions'));
  });

  boxer.set('dictionaries.transactions.destroy', function(){
    var transaction = require('./transactions/destroy');
    return transaction(boxer.fetcher('dictionaries.transactions'));
  });
};