var assert = require('assert'),
    Q = require('q');


var dbClientOK = true;

var inject = function(depName) {
    return {
        mongoClient: {
            connect: function(){
                var deferConnect = Q.defer();
                if (dbClientOK) {
                    deferConnect.resolve({
                        admin: function () {
                            return {
                                ping: function () {
                                    var deferPing = Q.defer();
                                    deferPing.resolve({});
                                    return deferPing.promise;
                                }
                            };
                        }
                    });
                } else {
                    deferConnect.reject('some-error');
                }
                return deferConnect.promise;
            }
        }
    }[depName];
};

var dbClient = require('../../lib/persistence/client')(inject);

describe('dbClient', function() {
    describe('healthcheck', function() {

        it('returns that is healthy when the connection is ok', function(done) {
            dbClient.isHealthy().then(function(healthCheck){
                assert.equal(healthCheck.healthy, true);
                done();
            });
        });

        it('returns that is not healthy and an error message when connection is not ok', function(done){
            dbClientOK = false;

            dbClient.isHealthy().then(function(healthCheck){
                assert.equal(healthCheck.healthy, false);
                assert.equal(healthCheck.error, 'some-error');
                done();
            });
        });
    });
});
