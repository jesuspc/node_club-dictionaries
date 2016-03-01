module.exports = function(boxer) {
    var fetch = boxer.fetcher('cirrus');

    boxer.set('cirrus.logger', function(){
        return fetch('loggerFactory').getLogger('cirrus-client');
    });

    boxer.set('cirrus.config', function(){
        return boxer.fetcher('')('config').cirrus;
    });

    boxer.set('cirrus.baseUrl', function(){
        return fetch('config').baseUrl;
    });

    boxer.set('cirrus.authPath', function(){
        return fetch('config').paths.auth;
    });

    boxer.set('cirrus.authUrl', function(){
        return fetch('baseUrl') + fetch('authPath');
    });

    boxer.set('cirrus.isAlivePath', function(){
        return fetch('config').paths.isAlive;
    });

    boxer.set('cirrus.isAliveUrl', function(){
        return fetch('baseUrl') + fetch('isAlivePath');
    });

    boxer.set('cirrus.request', function(){
        return fetch('httpRequest');
    });

    boxer.set('cirrus.client', function(){
        var box = boxer.box();

        return require('./client')(fetch);
    });
};