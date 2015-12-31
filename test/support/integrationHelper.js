var request = require('supertest');
var nock = require('nock');
var Q = require('q');

module.exports = {
  include: function(box){
    var dbConnection = box.persistence.dbConnection(),
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

      this.doRequest = function(yielded) {
        var that = this;
        that.method = that.method || 'get';

        this.setupDb().then(function(){
          var req = request(app)[that.method](that.getUrl())
            .set('Accept', 'application/json')
            .set('FakeUser', JSON.stringify(that.getFakeUser()));

          yielded(req);
        });
      };

      this.teardownDb(done);
    });

    beforeEach(function(){
      this.getUrl = function() { return ''; };
      this.dictionaries = [];
      this.getFakeUser = function() {
        return {
          uuid: this.userUuid,
          account: {
            uuid: this.accountUuid
          }
        };
      };
      this.userUuid = 'myUuid';
      this.accountUuid = 'myAccountUuid';

      this.mockCirrusAuth = function(opts) {
        opts = opts || {};
        var defaultReplyBody = this.getFakeUser();
        var replyStatusCode = opts.replyStatusCode || 200;
        var replyBody = opts.replyBody || defaultReplyBody;

        nock(box.cirrus.baseUrl()).get(box.cirrus.authPath())
          .reply(replyStatusCode, replyBody);
      };
    });

    afterEach(function(done){
      this.teardownDb(done);
    });
  }
};
