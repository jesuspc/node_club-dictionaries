var Q = require('q');
var assert = require('assert');
var sinon = require('sinon');
var builder = require('../../../lib/cirrus/client');

describe('cirrusClient', function(){
    beforeEach(function(){
        this.mockRequest = function() {
            var that = this;

            this.request = function(opts, callback) {
                if(that.successfulAuthorization) {
                    responseBody = '{ "some_key": "some_value" }';
                    response = { statusCode: 200, body: responseBody };
                    callback(null, response, responseBody);
                } else {
                    error = 'someError';
                    callback(error, null, null);
                }
            };
        };

        this.setup = function(opts) {
            var that = this;
            opts = opts || {};

            if(opts.mockRequest) { this.mockRequest(); }

            this.authUrl = 'blah';
            this.logger = { info: function(){}, debug: function(){} };

            this.cirrusClient = builder({
                request: this.request,
                authUrl: this.authUrl,
                logger: this.logger
            });
        };
    });

    describe('getCurrentUser', function(){
        it('requests Cirrus with the given url and cookies', function(){
            var requestSpy = sinon.spy();
            var expectedRequestArgs = {
                url: 'blah',
                headers: { 'Cookie': 'some_cookies' }
            };
            this.request = function(opts, callback) {
                requestSpy(opts, callback);
                callback(null, {
                    statusCode: 200,
                    body: '{ "some_key": "some_value" }'
                });

                assert(requestSpy.withArgs(expectedRequestArgs).calledOnce);
            };
            this.setup();

            return this.cirrusClient.getCurrentUser('some_cookies');
        });

        describe('when the request is successful', function(){
            beforeEach(function(){
                this.successfulAuthorization = true;
                this.setup({ mockRequest: true });
            });

            it('resolves with the received user data', function(){
                return this.cirrusClient.getCurrentUser('some_cookies')
                    .then(function(userData){
                        assert.deepEqual(userData, {some_key: 'some_value'});
                    });
            });
        });

        describe('when the request is not successful', function(){
            beforeEach(function(){
                this.successfulAuthorization = false;
                this.setup({ mockRequest: true });
            });

            it('fails with the request error', function(){
                return this.cirrusClient.getCurrentUser('some_cookies')
                    .catch(function(error){
                        assert.equal(error, 'someError');
                    });
            });
        });
    });

    describe('Health check', function(){
        it('returns that is healthy when the client is alive', function(done) {
            this.request = function(opts, callback) {
                callback(null, {
                    statusCode: 200
                });
            };
            this.setup();

            this.cirrusClient.isHealthy().then(function(healthCheck){
                assert.equal(healthCheck.healthy, true);
                done();
            });
        });

        it('returns that is not healthy and an error message when client is dead', function(done){
            this.request = function(opts, callback) {
                callback(null, {
                    statusCode: 500
                });
            };
            this.setup();

            this.cirrusClient.isHealthy().then(function(healthCheck){
                assert.equal(healthCheck.healthy, false);
                done();
            });
        });
    });
});
