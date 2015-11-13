var assert = require('assert');

var box = require('../box')(),
    shared = require('../support/apiShared'),
    helper = require('../support/integrationHelper');


var dbConnection = box.persistence.client();

describe('[INTEGRATION] Create Dictionary', function(){
  helper.include(box);

  beforeEach(function(){
    this.dictName = "newDict"
    this.method = "put"
    this.getUrl = function() { return '/api/v1.0/users/myUuid/dictionaries/'+this.dictName+'.json'; }

    this.expectedBody = {};
    this.dict1 = { "name" : "dict1", "field1" : "value1", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dict1Overwrite = { "name" : "dict1", "field1" : "value2", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dictUnnamedPayload = {"unnamedField" : "unnamedValue", "meta" : { "uuid" : "myUuid", "scope" : "accounts" } };
    this.dictionaries = [this.dict1];
  });


  describe('when user logged in', function(){
    describe('when successful authorization', function(){
      describe('when payload provided', function(){
        beforeEach(function(){
          this.dictName = 'unnamedPayload';
        })

        it('returns a 200', function(done){
          that = this
            this.doRequest(function(req){
              req.send(that.dictUnnamedPayload);
              req.expect(200, done);
            })
        });

        it('creates a record with by merging the given name and the payload', function(done){
          that = this;
          var expectedPayload = {"name": "unnamedPayload", "unnamedField" : "unnamedValue"};

          this.doRequest(function(req){
            req.send(that.dictUnnamedPayload)
            req.end(function(){
              dbConnection().then(function(db){
                db.collection('dictionaries').findOne({name: that.dictName}).then(function(dict){
                    try{
                      assert.deepEqual(dict.name, expectedPayload.name);
                      assert.deepEqual(dict.unnamedField, expectedPayload.unnamedField);
                      done();
                    } catch(err) {
                      done(err);
                    }
                });
              });
            });
          });
        });

        it('returns the created element as json', function(done){
          var expectedBody = { name: "unnamedPayload", unnamedField: "unnamedValue" };
          that = this;
          this.doRequest(function(req){
            req.send(that.dictUnnamedPayload)
            var correctBody = function(res) {
              assert.deepEqual(res.body, expectedBody);
            };

            req.expect(correctBody).end(done);
          });
        });
      });

      describe('when no payload provided', function(done){
        it('returns a 200', function(done){
          that = this
            this.doRequest(function(req){
              req.expect(200, done);
            })
        });

        it('creates a record with by with the given name', function(done){
          that = this;
          var expectedPayload = {"name": "newDict"};

          this.doRequest(function(req){
            req.end(function(){
              dbConnection().then(function(db){
                db.collection('dictionaries').findOne({name: that.dictName}).then(function(dict){
                    try{
                      assert.deepEqual(dict.name, expectedPayload.name);
                      done();
                    } catch(err) {
                      done(err);
                    }
                });
              });
            });
          });
        });

        it('returns the created element as json', function(done){
          var expectedBody = {name: "newDict"};
          that = this;
          this.doRequest(function(req){
            var correctBody = function(res) {
              assert.deepEqual(res.body, expectedBody);
            };

            req.expect(correctBody).end(done);
          });
        });
      });

      describe('when there was a previous entry with the given name', function(){
        it('overrides the previous entry', function(done){
          var expectedBody = { "name" : "dict1", "field1" : "value2"};
          that = this;

          this.doRequest(function(req){
            req.send(that.dict1Overwrite)
            var correctBody = function(res) {
              assert.deepEqual(res.body, expectedBody);
            };

            req.expect(correctBody).end(done);
          });
        });
      });
    });

    describe.skip('when unsuccessful authorization', function(){
      shared.respondsToNotAuthorized();

      it('does not create a record', function(){

      });
    });
  });

  describe.skip('when user not logger in', function(){
    shared.respondsToNotLoggedIn();
  });
});