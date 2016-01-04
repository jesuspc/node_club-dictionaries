var assert = require('assert');
var sinon = require('sinon');

describe('Authorizer', function(){
    beforeEach(function(){
        this.conditions = [];
        this.req = {};
        this.res = {
            status: function() { return this; },
            json: function() { return this; }
        };
        this.next = sinon.spy();

        this.getSubject = function(){
            return require('../../../lib/middleware/authorizer')({
                conditions: this.conditions
            });
        };

        this.doAction = function(){
            this.setAuthorizers();
            this.getSubject()(this.req, this.res, this.next);
        }

        this.setAuthorizers = function() {
            this.conditions = [];
        };
    });

    describe('when no conditions provided', function(){
        beforeEach(function() { this.conditions = null });

        it('returns 403', function(){
            var resStatusSpy = sinon.spy(this.res, 'status');
            this.doAction();
            assert(resStatusSpy.withArgs(403).calledOnce);
        });

        it('does not call next', function(){
            this.doAction();
            assert(!this.next.called);
        });
    });

    describe('when conditions provided', function(){
        beforeEach(function() {
            this.setAuthorizers = function(){
                this.conditions = [this.condition1, this.condition2]
            };
        });

        describe('when one condition evaluates to true', function(){
            beforeEach(function(){
                this.condition1 = function(req){ return true; };
                this.condition2 = function(req){ return false; };
            });

            it('evaluates only to the first truthy conditions', function(){
                this.condition1 = sinon.spy(this.condition1);
                this.condition2 = sinon.spy(this.condition2);
                this.doAction();
                assert(this.condition1.withArgs(this.req).calledOnce);
                assert(!this.condition2.called);
            });

            it('calls next', function(){
                this.doAction();
                assert(this.next.calledOnce);
            });

            it('does not return 403', function(){
                var resStatusSpy = sinon.spy(this.res, 'status');
                this.doAction();
                assert(!resStatusSpy.called);
            });
        });

        describe('when no condition evaluates to true', function(){
            beforeEach(function() {
                this.condition1 = function(req){ return false; };
                this.condition2 = function(req){ return false; };
            });

            it('evaluates each condition against the req', function(){
                this.condition1 = sinon.spy(this.condition1);
                this.condition2 = sinon.spy(this.condition2);
                this.doAction();
                assert(this.condition1.withArgs(this.req).calledOnce);
                assert(this.condition2.withArgs(this.req).calledOnce);
            });

            it('returns 403', function(){
                var resStatusSpy = sinon.spy(this.res, 'status');
                this.doAction();
                assert(resStatusSpy.withArgs(403).calledOnce);
            });

            it('does not call next', function(){
                this.doAction();
                assert(!this.next.called);
            });
        });
    });
});