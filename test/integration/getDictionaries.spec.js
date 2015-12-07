var assert = require('assert');

var box = require('../box')(),
    shared = require('../support/apiShared'),
    helper = require('../support/integrationHelper');

describe('[INTEGRATION] Get Dictionaries', function(){
  helper.include(box);

  beforeEach(function(){
    this.scope = 'users';
    this.getUrl = function() {
      return '/api/v1.0/' + this.scope + '/myUuid/dictionaries.json';
    }
    this.expectedBody = {};
    this.dict1 = { "name" : "dict1", "field1" : "value1", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dict2 = { "name" : "dict2", "field2" : "value2", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dict3 = { "name" : "dict3", "field3" : "value3", "meta" : { "uuid" : "myUuid", "scope" : "accounts" } };
    this.withFilters = { "name" : "withFilters", "field1" : "value1", "field2" : "value2", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dictionaries = [this.dict1, this.dict2, this.dict3, this.withFilters];
  });

  describe('when user logged in', function(){
    describe('when successful authorization', function(){
      describe('when there are records in the database matching the request params', function(){
        describe('when no filters provided', function(){
          it('returns a 200', function(done){
            this.doRequest(function(req){
              req.expect(200, done);
            });
          });

          it('returns the expected list of dictionaries', function(done){
            var expectedBody = [{ name: "dict1", field1: "value1" }, { name: "dict2", field2: "value2" }, { "name" : "withFilters", "field1" : "value1", "field2" : "value2"}];

            this.doRequest(function(req){
              var correctBody = function(res) {
                assert.deepEqual(res.body, expectedBody);
              };

              req.expect(correctBody).end(done);
            });
          });
        });

        describe('when filter provided with no key', function(){
          beforeEach(function(){
            this.getUrl = function() {
              return '/api/v1.0/' + this.scope + '/myUuid/dictionaries.json?filters=dict1';
            };
          });

          it('it is considered a bad request and returns a 400', function(done){
            this.doRequest(function(req){
              req.expect(400, done);
            });
          });
        });

        describe('when filters provided with keys', function(){
          beforeEach(function(){
            this.getUrl = function() {
              return '/api/v1.0/' + this.scope + '/myUuid/dictionaries.json?filters[field1]=value1&filters[field2]=value2';
            };
          });

          it('returns a 200', function(done){
            this.doRequest(function(req){
              req.expect(200, done);
            });
          });

          it('returns the expected list of dictionaries', function(done){
            var expectedBody = [ { name: "withFilters", field1: "value1", field2: "value2" } ];

            this.doRequest(function(req){
              var correctBody = function(res) {
                assert.deepEqual(res.body, expectedBody);
              };

              req.expect(correctBody).end(done);
            });
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
          })
        })
        describe('when scope is accounts', function() {
          beforeEach(function() {
            this.scope = 'accounts';
          });
          it('allows scope accounts', function(done) {
            this.doRequest(function(req) {
              req.expect(200, done);
            });
          })
        })
        describe('when scope is not valid', function() {
          beforeEach(function() {
            this.scope = 'broken';
          });
          it('rejects scope broken', function(done) {
            this.doRequest(function(req) {
              req.expect(400, {'error':'scope does not have a valid value'}, done);
            });
          })
        })
      });

      describe('when there are not records in the database matching the request params', function(){
        beforeEach(function(){
          this.dictionaries = [{}];
        });

        it('returns a 200', function(done){
          this.doRequest(function(req){
            req.expect(200, done);
          });
        });

        it('returns an empty collection as body', function(done){
          this.doRequest(function(req){
            var correctBody = function(res) {
              assert.deepEqual(res.body, []);
            };

            req.expect(correctBody).end(done);
          });
        });
      });
    });

    describe('when unsuccessful authorization', function(){
      shared.respondsToNotAuthorized();
    });
  });

  describe.skip('when user not logger in', function(){
    shared.respondsToNotLoggedIn();
  });
});
