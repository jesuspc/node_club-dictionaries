module.exports = function(opts) {
    var Q = require('q');
    var url = opts.url;
    var client = opts.client;

    var connection = function(){
        var deferred = Q.defer();

        client.connect(url).then(function(db){
            return deferred.resolve(db);
        }).then(function(db) {
            db.close();
        }).catch(function(err){
            deferred.reject(err);
        });

        return deferred.promise;
    };

    return {
        connection: connection,
        isHealthy: function(){
            var deferred = Q.defer();
            connection().then(function(db){
                db.admin().ping().then(function(pingResult) {
                    deferred.resolve({
                        healthy: true
                    });
                });
            }).fail(function(err) {
                deferred.resolve({
                    healthy: false,
                    error:  err
                });
            });
            return deferred.promise;

        }
    };
};
