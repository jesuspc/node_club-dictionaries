var assert = require('assert');

var box = require('../box')(),
    shared = require('../support/apiShared'),
    helper = require('../support/integrationHelper');

describe('[INTEGRATION] Get Dictionary', function(){
  helper.include(box);

  beforeEach(function(){
    this.expectedBody = {};
    this.dictName = 'dict1';
    this.scope = 'users';
    this.getUrl = function(){
      return '/api/v1.0/' + this.scope + '/myUuid/dictionaries/' + this.dictName + '.json';
    };
    this.dict1 = { "name" : "dict1", "field1" : "value1", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dict2 = { "name" : "dict2", "field2" : "value2", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dict3 = { "name" : "dict1", "field1" : "value1", "meta" : { "uuid" : "myUuid", "scope" : "accounts" } };
    this.dict4 = { "name" : "dict2", "field2" : "value2", "meta" : { "uuid" : "myUuid", "scope" : "accounts" } };
    this.dictionaries = [this.dict1, this.dict2, this.dict3, this.dict4];
  });

  describe('when user logged in', function(){
    describe('when the provided dictionary does not exists', function(){
      beforeEach(function(){
        this.dictName = 'Unexisting';
      });

      it('returns a 404', function(done){
        this.doRequest(function(req){
          req.expect(404, done);
        });
      });
    });

    describe('when validating scope with parameterizer', function() {
      describe('when scope is users', function() {
        beforeEach(function() {
          this.scope = 'users';
        });
        it('allows scope users', function(done) {
          this.doRequest(function(req) {
            req.expect(200, done);
          });
        });
      });
      describe('when scope is accounts', function() {
        beforeEach(function() {
          this.scope = 'accounts';
        });
        it('allows scope accounts', function(done) {
          this.doRequest(function(req) {
            req.expect(200, done);
          });
        });
      });
      describe('when scope is not valid', function() {
        beforeEach(function() {
          this.scope = 'broken';
        });
        it('rejects scope broken', function(done) {
          this.doRequest(function(req) {
            req.expect(400, {'error':'scope does not have a valid value'}, done);
          });
        });
      });
    });

    describe('when the provided dictionary exists', function(){
      describe('when successful authorization', function(){
        beforeEach(function(){
          this.dictName = 'dict1';
        });

        it('returns a 200', function(done){
          this.doRequest(function(req){
            req.expect(200, done);
          });
        });

        it('returns the expected dictionary', function(done){
          var expectedBody = { name: "dict1", field1: "value1" };

          this.doRequest(function(req){
            var correctBody = function(res) {
              assert.deepEqual(res.body, expectedBody);
            };

            req.expect(correctBody).end(done);
          });
        });
      });

      describe('when unsuccessful authorization', function(){
        shared.respondsToNotAuthorized();
      });
    });
  });

  describe.skip('when user not logger in', function(){
    shared.respondsToNotLoggedIn();
  });
});
