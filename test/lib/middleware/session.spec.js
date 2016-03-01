var Q = require('q');
var assert = require('assert');
var sinon = require('sinon');
var session = require('../../../lib/middleware/session');

describe('Session', function(){
    beforeEach(function(){
        this.buildMockObject = function() {
            var that = this;

            this.next = this.next || function(){};
            this.req = { headers: { cookie: 'someCookie' } };
            this.res = {
                status: function() { return this; },
                json: function() { return this; },
                end: function() { return this; }
            };
            this.resStatusSpy = sinon.spy(this.res.status);
            this.resJsonSpy = sinon.spy(this.res.json);
        };

        this.setup = function() {
            var that = this;

            this.buildMockObject();

            this.authenticator = {
                getCurrentUser: function(cookies){
                    var deferred = Q.defer();

                    if(that.loggedIn){
                        deferred.resolve('userData');
                    } else {
                        deferred.reject();
                    }

                    return deferred.promise;
                }
            };

            this.logger = { info: function(){}, debug: function(){} };
            this.session = session(function(depName){
                return {
                    cirrusClient: this.authenticator,
                    loggerTool: this.logger
                }[depName];
            }.bind(this));
        };
    });

    describe('when the current user can be fetched', function(){
        beforeEach(function(){
            this.loggedIn = true;
            this.setup();
        });

        it('calls sets the current user in the req', function(){
            var req = this.req;

            return this.session(req, this.res, this.next).finally(function(){
                assert.equal(req.currentUser, 'userData');
            });
        });

        it('calls next', function(){
            var next = sinon.spy();

            return this.session(this.req, this.res, next).finally(function(){
                assert(next.called);
            });
        });
    });

    describe('when the current user can not be fetched', function(){
        beforeEach(function(){
            this.loggedIn = false;
            this.setup();
        });

        it('responds with status unauthorized', function(){
            var resStatusSpy = sinon.spy(this.res, 'status');

            return this.session(this.req, this.res, this.next)
                .finally(function(){
                    assert(resStatusSpy.withArgs(401).calledOnce);
                });
        });

        it('responds with body', function(){
            var resJsonSpy = sinon.spy(this.res, 'json');

            return this.session(this.req, this.res, this.next)
                .finally(function(){
                    error_json = {
                        "error_code": "not_logged_in",
                        "error_msg": "Not logged in"
                    };
                    assert(resJsonSpy.withArgs(error_json).calledOnce);
                });
        });
    });
});