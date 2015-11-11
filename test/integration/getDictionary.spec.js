var assert = require('assert');

var box = require('../box')(),
    shared = require('../support/apiShared'),
    helper = require('../support/integrationHelper');

describe('[INTEGRATION] Get Dictionary', function(){
  helper.include(box);

  beforeEach(function(){
    this.expectedBody = {};
    this.dictName = 'dict1';
    this.getUrl = function(){
      return '/api/v1.0/users/myUuid/dictionaries/' + this.dictName + '.json';
    }
    this.dict1 = { "name" : "dict1", "field1" : "value1", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dict2 = { "name" : "dict2", "field2" : "value2", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dictionaries = [this.dict1, this.dict2];
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

      describe.skip('when unsuccessful authorization', function(){
        shared.respondsToNotAuthorized();
      });
    });
  });

  describe.skip('when user not logger in', function(){
    shared.respondsToNotLoggedIn();
  });
});