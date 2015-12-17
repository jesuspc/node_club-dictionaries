var assert = require('assert'),
    Q = require('q'),
    sinon = require('sinon');


var fakeRouter = {
    get: function(url, callback) {
        this.getHealthcheck = callback;
    }
};

var mongoHealthy = true,
    cirrusHealthy = true;

var healthcheck = require('../../../lib/middleware/healthcheck')({
    router: fakeRouter,
    dependencies: {
        databaseClient: {
            isHealthy: function(){
                var deferred = Q.defer();
                deferred.resolve({
                    healthy: mongoHealthy
                });
                return deferred.promise;
            }
        },
        cirrusClient: {
            isHealthy: function(){
                var deferred = Q.defer();
                deferred.resolve({
                    healthy: cirrusHealthy
                });
                return deferred.promise;
            }
        }
    }
});

describe('Healthcheck', function() {
    describe('default', function() {

        it('return everything is ok and 200', function(done) {
            var fakeRes = {};

            fakeRes.status = function(statusCode){
                assert.deepEqual(statusCode, 200);
                return this;
            };
            fakeRes.json = function(status) {
                assert.deepEqual(status.mongo.healthy, true);
                //assert.deepEqual(status.cirrus.healthy, true);

                done();
            };



            healthcheck.getHealthcheck({}, fakeRes);
        });

        it('returns mongo is down and 500', function(done) {
            var fakeRes = {};

            mongoHealthy = false;
            fakeRes.status = function(statusCode){
                assert.deepEqual(statusCode, 500);
                return this;
            };
            fakeRes.json = function(status) {
                assert.deepEqual(status.mongo.healthy, false);
                done();
            };

            healthcheck.getHealthcheck({}, fakeRes);
        });

        it('returns cirrus is down and 500', function() {
            var fakeRes = {};

            cirrusHealthy = false;
            fakeRes.status = function(statusCode){
                assert.deepEqual(statusCode, 500);
                return this;
            };
            fakeRes.json = function(status) {
                assert.deepEqual(status.cirrus.healthy, false);
                done();
            };


            healthcheck.getHealthcheck({}, fakeRes);
        });

    });
});
