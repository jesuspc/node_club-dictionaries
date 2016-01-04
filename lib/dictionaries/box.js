module.exports = function(boxer) {
    boxer.set('dictionaries.api.middleware', function(){
        var api = require('./api');
        var box = boxer.box();
        var isOwner = function(req) {
          return req.currentUser.uuid === req.params.uuid;
        };
        var inAccount = function(req) {
          return req.currentUser.account.uuid === req.params.uuid;
        };

        return api({
          router: box.router(),
          transactions: {
            index: box.dictionaries.transactions.index(),
            show: box.dictionaries.transactions.show(),
            upsert: box.dictionaries.transactions.upsert(),
            destroy: box.dictionaries.transactions.destroy()
          },
          parameterizer: box.dictionaries.api.parameterizer(),
          authorize: box.middleware.authorizer()({
            conditions: [isOwner, inAccount]
          }),
          serialize: box.dictionaries.serializer().base
        });
    });

    boxer.set('dictionaries.serializer', function(){
        return require('./serializer')();
    });

    boxer.set('dictionaries.api.parameterizer', function() {
        return require('./api/parameterizer')();
    });

    boxer.set('dictionaries.transactions.index', function(){
        var transaction = require('./transactions/index');
        var box = boxer.box();

        return transaction({
          dbConnection: box.persistence.dbConnection()
        });
    });

    boxer.set('dictionaries.transactions.show', function(){
        var transaction = require('./transactions/show');
        var box = boxer.box();

        return transaction({
          dbConnection: box.persistence.dbConnection()
        });
    });

    boxer.set('dictionaries.transactions.upsert', function(){
        var transaction = require('./transactions/upsert');
        var box = boxer.box();

        return transaction({
          dbConnection: box.persistence.dbConnection()
        });
    });

    boxer.set('dictionaries.transactions.destroy', function(){
        var transaction = require('./transactions/destroy');
        var box = boxer.box();

        return transaction({
          dbConnection: box.persistence.dbConnection()
        });
    });
};