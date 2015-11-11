var request = require('supertest');
var Q = require('q');

module.exports = {
  include: function(box){
    var dbConnection = box.persistence.client(),
        app = box.app();

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
            .get(that.getUrl())
            .set('Accept', 'application/json');

          setExpectations(req);
        });
      };

      this.teardownDb(done);
    });

    beforeEach(function(){
      this.getUrl = function(){ return '' };
      this.dictionaries = [];
    });

    afterEach(function(done){
      this.teardownDb(done);
    });
  }
};