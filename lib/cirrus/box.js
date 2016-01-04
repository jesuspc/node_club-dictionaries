module.exports = function(boxer) {
    boxer.set('cirrus.baseUrl', function(){
        return 'https://qa.workshare.com';
    });

    boxer.set('cirrus.authPath', function(){
        return '/api/v1.4/current_user.json?includes=a.core';
    });

    boxer.set('cirrus.authUrl', function(){
        var box = boxer.box();

        return box.cirrus.baseUrl() + box.cirrus.authPath();
    });

    boxer.set('cirrus.isAliveUrl', function(){
        var box = boxer.box();

        return box.cirrus.baseUrl() + '/is_alive';
    });

    boxer.set('cirrus.client', function(){
        var box = boxer.box();

        return require('./client')({
          authUrl: box.cirrus.authUrl(),
          isAliveUrl: box.cirrus.isAliveUrl(),
          request: box.httpRequest()
        });
    });
};