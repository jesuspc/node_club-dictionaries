var assert = require('assert'),
    sinon = require('sinon');

var parameterizer = require('../../../../lib/dictionaries/api/parameterizer');

describe('Parameterizer', function() {
    var createMockResponse = function() {
        return {
            send: function() {},
            status: function() {},
            sendStatus: function() {}
        };
    };
    beforeEach(function(){
        this.parameterizer = parameterizer();
    });

    describe('nameInBody', function() {
        beforeEach(function(){
            this.nameInBody = this.parameterizer.nameInBody;
        });

        it('should be a function', function() {
            assert.equal('function', typeof this.nameInBody);
        });

        it('should set body.name if name param and body not named', function() {
            var req = {
                params: {
                    name: 'George'
                },
                body:{}
            };
            var res = createMockResponse();

            this.nameInBody(req, res, function(){});

            assert.equal(req.body.name, 'George');
        });

        it('should not change body.name if name param but body has name', function() {
            var req = {
                params: {
                    name: 'George'
                },
                body:{
                    name:'Ethel'
                }
            };
            var res = createMockResponse();

            this.nameInBody(req, res, function(){});

            assert.equal(req.body.name, 'Ethel');
        });

        it('should call next', function() {
            var req = {
                params: {
                    name: 'George'
                },
                body:{}
            };
            var spyNext = sinon.spy();
            var res = createMockResponse();

            this.nameInBody(req, res, spyNext);

            assert(spyNext.calledOnce);
        });

    });
    describe('default', function() {
        beforeEach(function(){
            this.default = this.parameterizer.default;
        });

        it('should be a function', function() {
            assert.equal('function', typeof this.default);
        });

        it('should invoke next when a users scope is passed', function() {
            var req = {
                params: {
                    scope: 'users'
                }
            };
            var res = createMockResponse();
            var spyNext = sinon.spy();

            this.default(req, res, spyNext);

            assert(spyNext.calledOnce);
        });


        it('should invoke next when an accounts scope is passed', function() {
            var req = {
                params: {
                    scope: 'accounts'
                }
            };
            var res = createMockResponse();
            var spyNext = sinon.spy();

            this.default(req, res, spyNext);

            assert(spyNext.calledOnce);
        });

        it('should send 400 with error for an invalid scope', function() {
            var req = {
                params: {
                    scope: 'badgers'
                }
            };
            var res = createMockResponse();
            var spySend = sinon.spy(res, 'send');
            var spyStatus = sinon.spy(res, 'status');
            var spyNext = sinon.spy();

            this.default(req, res, spyNext);

            assert(spyStatus.calledOnce);
            assert(spyStatus.calledWithExactly(400));
            assert(spySend.calledOnce);
            assert(spySend.calledWithExactly({
                'error':'scope does not have a valid value'
            }));
            assert(!spyNext.called);
        });

        it('should change the string current in the params uuid to the logged user uuid', function(){
            var req = {
                params: {
                    uuid: 'current'
                },
                currentUser: {
                    uuid: 'fake-user-uuid'
                }
            };
            var res = createMockResponse();

            this.default(req, res, function(){});

            assert.deepEqual(req.params.uuid, 'fake-user-uuid');
        });
    });
    describe('filterFormat', function() {
        beforeEach(function(){
            this.filterFormat = this.parameterizer.filterFormat;
        });

        it('should be a function', function() {
            assert.equal('function', typeof this.filterFormat);
        });
        it('should create a empty object if no filters are sent', function(){
            var req = {
                query: {}
            };

            var res = createMockResponse();
            var spySendStatus = sinon.spy(res, 'sendStatus');
            var spyNext = sinon.spy();

            this.filterFormat(req, res, spyNext);

            assert(req.query.hasOwnProperty('filters'));
            assert(!spySendStatus.called);
            assert.deepEqual(req.query.filters, {});
            assert(spyNext.called);
        });
        it('should send 400 if the filter recieved is not an obj', function(){
            var req = {
                query: {filters: 'blorpblorp'}
            };

            var res = createMockResponse();
            var spySendStatus = sinon.spy(res, 'sendStatus');
            var spyNext = sinon.spy();

            this.filterFormat(req, res, spyNext);

            assert(spySendStatus.calledOnce);
            assert(spySendStatus.calledWithExactly(400));
            assert(!spyNext.called);
        });
    });

});
