var assert = require('assert'),
    sinon = require('sinon');

var parameterizer = require('../../lib/dictionaries/api/parameterizer');



describe('Parameterizer', function() {

    var createMockResponse = function() {
        return {
            send: function() {},
            status: function() {},
            sendStatus: function() {}
        }
    };

    it('should be a function', function() {
        var p = parameterizer().default;
        assert.equal('function', typeof p);
    });

    it('should invoke next when a users scope is passed', function() {

        var req = {
            params: {
                scope: 'users'
            }
        };
        var statusSet;
        var res = {
            sendStatus: function (status) {
                statusSet = status;
            }
        };

        var nextCalled =false;
        function next() {
            nextCalled = true;
        }

        parameterizer().default(req, res, next);

        assert.equal(true, nextCalled);
    });


    it('should invoke next when an accounts scope is passed', function() {

        var req = {
            params: {
                scope: 'accounts'
            }
        };
        var statusSent, body;
        var res = {
            send: function (status, body) {
                statusSent = status;
                bodySent = body;
            }
        };

        var nextCalled =false;
        function next() {
            nextCalled = true;
        }

        parameterizer().default(req, res, next);

        assert.equal(true, nextCalled);
        assert(statusSent === undefined);
    });

    it('should invoke send 400 with an error response for an invalid scope', function() {
        var req = {
            params: {
                scope: 'badgers'
            }
        };

        var res = createMockResponse();
        var spySend = sinon.spy(res, 'send');
        var spyStatus = sinon.spy(res, 'status');

        var nextCalled =false;
        function next() {
            nextCalled = true;
        }

        parameterizer().default(req, res, next);

        assert(spyStatus.calledOnce);
        assert(spyStatus.calledWithExactly(400));
        assert(spySend.calledOnce);
        assert(spySend.calledWithExactly({'error':'scope does not have a valid value'}));
        assert.equal(false, nextCalled);
    })

});