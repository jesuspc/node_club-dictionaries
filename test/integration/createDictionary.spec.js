var assert = require('assert');

var box = require('../box')(),
    shared = require('../support/apiShared'),
    helper = require('../support/integrationHelper');

var dbConnection = box.persistence.dbConnection();

describe('[INTEGRATION] Create Dictionary', function(){
  helper.include(box);

  beforeEach(function(){
    this.dictName = "newDict";
    this.method = "put";
    this.getUrl = function() {
      return '/api/v1.0/users/myUuid/dictionaries/'+this.dictName+'.json';
    };

    this.expectedBody = {};
    this.dict1 = { "name" : "dict1", "field1" : "value1", "meta" : {
      "uuid" : "myUuid", "scope" : "users" }
    };
    this.dict1Overwrite = { "name" : "dict1", "field1" : "value2", "meta" : {
      "uuid" : "myUuid", "scope" : "users" }
    };
    this.unnamedDict = {"unnamedField" : "unnamedValue", "meta" : {
      "uuid" : "myUuid", "scope" : "accounts" }
    };
    this.dictionaries = [this.dict1];
  });

  describe('when user logged in', function(){
    describe('when successful authorization', function(){
      beforeEach(function(){
        this.mockCirrusAuth();
      });

      describe('when dictionary provided', function(){
        beforeEach(function(){
          this.dictName = 'unnamedDict';
        });

        it('returns a 200', function(done){
          var that = this;
            this.doRequest(function(req){
              req.send(that.unnamedDict);
              req.expect(200, done);
            });
        });

        it('creates a record with by merging the given name and the dictionary',
          function(done){
            var that = this;
            var expectedDictionary = {
              "name": "unnamedDict", "unnamedField" : "unnamedValue"
            };

            this.doRequest(function(req){
              req.send(that.unnamedDict);
              req.end(function(){
                dbConnection().then(function(db){
                  db.collection('dictionaries').findOne({name: that.dictName})
                    .then(function(dict){
                      try{
                        assert.deepEqual(dict.name, expectedDictionary.name);
                        assert.deepEqual(
                          dict.unnamedField, expectedDictionary.unnamedField
                        );
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
          var expectedBody = {
            name: "unnamedDict", unnamedField: "unnamedValue"
          };
          var that = this;
          this.doRequest(function(req){
            req.send(that.unnamedDict);
            var correctBody = function(res) {
              assert.deepEqual(res.body, expectedBody);
            };

            req.expect(correctBody).end(done);
          });
        });
      });

      describe('when no dictionary provided', function(done){
        it('returns a 200', function(done){
          var that = this;
          this.doRequest(function(req){
            req.expect(200, done);
          });
        });

        it('creates a record with by with the given name', function(done){
          var that = this;
          var expectedDictionary = {"name": "newDict"};

          this.doRequest(function(req){
            req.end(function(){
              dbConnection().then(function(db){
                db.collection('dictionaries').findOne({name: that.dictName})
                  .then(function(dict){
                      try{
                        assert.deepEqual(dict.name, expectedDictionary.name);
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
          var that = this;
          this.doRequest(function(req){
            var correctBody = function(res) {
              assert.deepEqual(res.body, expectedBody);
            };

            req.expect(correctBody).end(done);
          });
        });
      });

      describe('when there was a previous entry with that name', function(){
        it('overrides the previous entry', function(done){
          var expectedBody = { "name" : "dict1", "field1" : "value2"};
          var that = this;

          this.doRequest(function(req){
            req.send(that.dict1Overwrite);
            var correctBody = function(res) {
              assert.deepEqual(res.body, expectedBody);
            };

            req.expect(correctBody).end(done);
          });
        });
      });
    });

    describe('when unsuccessful authorization', function(){
      beforeEach(function(){
        this.userUuid = 'someone_else';
        this.mockCirrusAuth();
      });

      shared.respondsToNotAuthorized();

      it('does not create a record', function(done){
        var that = this;

        this.doRequest(function(req){
          req.end(function(){
            dbConnection().then(function(db){
              db.collection('dictionaries').findOne({name: that.dictName})
                .then(function(dict){
                  try{
                    assert(!dict);
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
