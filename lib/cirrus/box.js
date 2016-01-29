module.exports = function(boxer) {
    boxer.set('cirrus.logger', function(){
        var box = boxer.box();

        return box.loggerFactory().getLogger('cirrus-client');
    });

    boxer.set('cirrus.baseUrl', function(){
        var box = boxer.box();

        return box.config().cirrus.baseUrl;
    });

    boxer.set('cirrus.authPath', function(){
        var box = boxer.box();

        return box.config().cirrus.paths.auth;
    });

    boxer.set('cirrus.authUrl', function(){
        var box = boxer.box();

        return box.config().cirrus.baseUrl + box.cirrus.authPath();
    });

    boxer.set('cirrus.isAlivePath', function(){
        var box = boxer.box();

        return box.config().cirrus.paths.isAlive;
    });

    boxer.set('cirrus.isAliveUrl', function(){
        var box = boxer.box();

        return box.cirrus.baseUrl() + box.cirrus.isAlivePath();
    });

    boxer.set('cirrus.client', function(){
        var box = boxer.box();

        return require('./client')({
          authUrl: box.cirrus.authUrl(),
          isAliveUrl: box.cirrus.isAliveUrl(),
          request: box.httpRequest(),
          logger: box.cirrus.logger()
        });
    });
};