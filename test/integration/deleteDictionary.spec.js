var assert = require('assert');

var box = require('../box')(),
    shared = require('../support/apiShared'),
    helper = require('../support/integrationHelper');

var dbConnection = box.persistence.client();


describe.only('[INTEGRATION] Delete Dictionary', function(){
  helper.include(box);


  beforeEach(function(){
    this.getUrl = function() { return '/api/v1.0/users/myUuid/dictionaries/'+this.dictName+'.json'; }
    this.method = "delete"
    this.dictName = "dict1"

    this.expectedBody = {};
    this.dict1 = { "name" : "dict1", "field1" : "value1", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dict2 = { "name" : "dict2", "field2" : "value2", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dict3 = { "name" : "dict3", "field3" : "value3", "meta" : { "uuid" : "myUuid", "scope" : "accounts" } };
    this.dictionaries = [this.dict1, this.dict2, this.dict3];
  });


  describe('when user logged in', function(){
    describe('when successful authorization', function(){
      describe('when the given record exists', function(){
        it('returns a 200', function(done){
            this.doRequest(function(req){
              req.expect(200, done);
            })
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

        it('returns the removed element as json', function(){

        });
      });

      describe('when the given record does not exist', function(){
        it('returns a 404', function(){

        });
      });
    });

    describe.skip('when unsuccessful authorization', function(){
      shared.respondsToNotAuthorized();

      it('does not remove the record', function(){

      });
    });
  });

  describe.skip('when user not logger in', function(){
    shared.respondsToNotLoggedIn();
  });
});