var assert = require('assert');

var box = require('../box')(),
    shared = require('../support/apiShared'),
    helper = require('../support/integrationHelper');

var dbConnection = box.persistence.dbConnection();

describe('[INTEGRATION] Delete Dictionary', function(){
  helper.include(box);

  beforeEach(function(){
    this.dictName = "dict1";
    this.method = "delete";
    this.getUrl = function() { return '/api/v1.0/users/myUuid/dictionaries/'+this.dictName+'.json'; };

    this.expectedBody = {};
    this.dict1 = { "name" : "dict1", "field1" : "value1", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dict2 = { "name" : "dict2", "field2" : "value2", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dict3 = { "name" : "dict3", "field3" : "value3", "meta" : { "uuid" : "myUuid", "scope" : "accounts" } };
    this.dictionaries = [this.dict1, this.dict2, this.dict3];
  });

  describe('when user logged in', function(){
    describe('when successful authorization', function(){
      beforeEach(function(){
        this.mockCirrusAuth();
      });

      describe('when the given record exists', function(){
        it('returns a 200', function(done){
            this.doRequest(function(req){
              req.expect(200, done);
            });
        });

        it('removes the record', function(done){
          var that = this;
          this.doRequest(function(req){
            req.end(function(){
              dbConnection().then(function(db){
                db.collection('dictionaries').find({name: that.dictName}).toArray().then(function(dicts){
                    try{
                      assert.deepEqual(dicts, []);
                      done();
                    } catch(err) {
                      done(err);
                    }
                });
              });
            });
          });
        });

        it('returns the removed element as json', function(done){
          var expectedBody = { name: "dict1", field1: "value1" };

          this.doRequest(function(req){
            var correctBody = function(res) {
              assert.deepEqual(res.body, expectedBody);
            };

            req.expect(correctBody).end(done);
          });
        });
      });

      describe('when the given record does not exist', function(){
        beforeEach(function(){
          this.dictName = 'nonExistingDict';
        });

        shared.returnsNotFound();
      });
    });

    describe('when unsuccessful authorization', function(){
      beforeEach(function(){
        this.userUuid = 'someone_else';
        this.mockCirrusAuth();
      });

      shared.respondsToNotAuthorized();

      it('does not remove the record', function(){
        var that = this;

        this.doRequest(function(req){
          req.end(function(){
            dbConnection().then(function(db){
              db.collection('dictionaries').findOne({name: that.dictName})
                .then(function(dict){
                  try{
                    assert(dict);
                    done();
                  } catch(err) {
                    done(err);
                  }
                });
            });
          });
        });
      });
    });
  });

  describe('when user not logger in', function(){
    beforeEach(function(){
      this.mockCirrusAuth({replyStatusCode: 401, replyBody: {}});
    });

    shared.respondsToNotLoggedIn();
  });
});