var assert = require('assert');

var box = require('../box')(),
    shared = require('../support/apiShared'),
    helper = require('../support/integrationHelper');

describe('[INTEGRATION] Get Dictionaries', function(){
  helper.include(box);

  beforeEach(function(){
    this.getUrl = function() { return '/api/v1.0/users/myUuid/dictionaries.json'; }
    this.expectedBody = {};
    this.dict1 = { "name" : "dict1", "field1" : "value1", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dict2 = { "name" : "dict2", "field2" : "value2", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dict3 = { "name" : "dict3", "field3" : "value3", "meta" : { "uuid" : "myUuid", "scope" : "accounts" } };
    this.dictionaries = [this.dict1, this.dict2, this.dict3];
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
            var expectedBody = [{ name: "dict1", field1: "value1" }, { name: "dict2", field2: "value2" }];

            this.doRequest(function(req){
              var correctBody = function(res) {
                assert.deepEqual(res.body, expectedBody);
              };

              req.expect(correctBody).end(done);
            });
          });
        });

        describe.skip('when filters provided', function(){
          it('returns a 200', function(){

          });

          it('returns the expected list of dictionaries', function(){

          });
        });
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

    describe.skip('when unsuccessful authorization', function(){
      shared.respondsToNotAuthorized();
    });
  });

  describe.skip('when user not logger in', function(){
    shared.respondsToNotLoggedIn();
  });
});