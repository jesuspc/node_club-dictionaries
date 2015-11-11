var assert = require('assert');
var request = require('supertest');
var Q = require('q');

var box = require('../box')(),
    dbConnection = box.persistence.client(),
    app = box.app();

describe('[INTEGRATION] Get Dictionary', function(){
  before(function(done){
    this.setupDb = function() {
      var that = this;
      var deferred = Q.defer();

      dbConnection().then(function(db){
        db.collection('dictionaries').insertMany(that.dictionaries).then(function(res){
          deferred.resolve();
        });
      });

      return deferred.promise;
    };

    this.teardownDb = function(callback) {
      dbConnection().then(function(db){
        db.collection('dictionaries').removeMany({}, {}, callback);
      });
    };

    this.doRequest = function(setExpectations) {
      var that = this;

      this.setupDb().then(function(){
        var req = request(app)
          .get('/api/v1.0/users/myUuid/dictionaries/' + that.dictName + '.json')
          .set('Accept', 'application/json');

        setExpectations(req);
      });
    };

    this.teardownDb(done);
  });

  beforeEach(function(){
    this.expectedBody = {};
    this.dictName = 'dict1';
    this.dict1 = { "name" : "dict1", "field1" : "value1", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dict2 = { "name" : "dict2", "field2" : "value2", "meta" : { "uuid" : "myUuid", "scope" : "users" } };
    this.dictionaries = [this.dict1, this.dict2];
  });

  afterEach(function(done){
    this.teardownDb(done);
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
        it('returns a 403', function(){

        });

        it('returns a json message with error details', function(){

        });
      });
    });
  });

  describe.skip('when user not logger in', function(){
    it('returns a 401', function(){

    });

    it('returns a json message with error details', function(){

    });
  });
});