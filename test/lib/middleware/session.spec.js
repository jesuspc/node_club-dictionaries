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
                status: function() { return this },
                json: function() { return this },
                end: function() { return this }
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

            this.session = session({authenticator: this.authenticator});
        };
    });

    describe('when the current user can be fetched', function(){
        beforeEach(function(){
            this.loggedIn = true;
            this.setup();
        });

        it('calls next and sets the current user in the req', function(done){
            var req = this.req;
            this.next = function(){
                assert.equal(req.currentUser, 'userData');
                done();
            };

            return this.session(this.req, this.res, this.next);
        });
    });

    describe('when the current user can not be fetched', function(){
        beforeEach(function(){
            this.loggedIn = false;
            this.setup();
        });

        it('responds with status unauthorized', function(){
            var resStatusSpy = sinon.spy(this.res, 'status');
            this.res.end = function(){
                assert(resStatusSpy.withArgs(401).calledOnce);
            };

            return this.session(this.req, this.res, this.next);
        });

        it('responds with body', function(done){
            var resJsonSpy = sinon.spy(this.res, 'json')
            this.res.end = function(){
                error_json = {
                    "error_code": "not_logged_in", "error_msg": "Not logged in"
                }
                assert(resJsonSpy.withArgs(error_json).calledOnce);
                done();
            };

            return this.session(this.req, this.res, this.next);
        });
    });
});