module.exports = function(boxer) {
    var fetch = boxer.fetcher();

    boxer.set('logger', function(){
        return fetch('loggerFactory').getLogger('cirrus-client');
    });

    boxer.set('config', function(){
        return boxer.root('config').cirrus;
    });

    boxer.set('baseUrl', function(){
        return fetch('config').baseUrl;
    });

    boxer.set('authPath', function(){
        return fetch('config').paths.auth;
    });

    boxer.set('authUrl', function(){
        return fetch('baseUrl') + fetch('authPath');
    });

    boxer.set('isAlivePath', function(){
        return fetch('config').paths.isAlive;
    });

    boxer.set('isAliveUrl', function(){
        return fetch('baseUrl') + fetch('isAlivePath');
    });

    boxer.set('request', function(){
        return fetch('httpRequest');
    });

    boxer.set('client', function(){
        return require('./client')(fetch);
    });
};