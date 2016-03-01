module.exports = function(inject){
    var databaseClient = inject('databaseClient');
    var cirrusClient = inject('cirrusClient');

    return function(req, res, next) {
        var Q = require('q');
        var status = {};

        return Q.all([
            databaseClient.isHealthy(),
            cirrusClient.isHealthy()
        ]).spread(function(databaseHealth, cirrusHealth){
            var statusCode,
                allHealthy = true;

            status.mongo = databaseHealth;
            status.cirrus = cirrusHealth;


            for(var key in status) {
                allHealthy = allHealthy && status[key].healthy;
            }

            if (allHealthy) {
                statusCode = 200;
            } else {
                statusCode = 500;
            }

            res.status(statusCode).json(status);
        }).fail(function(error){
            res.sendStatus(500);
        });
    };
};
