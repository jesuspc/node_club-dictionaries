var assert = require('assert');

module.exports = {
  respondsToNotAuthorized: function(){
    it('returns a 403', function(done){
      this.doRequest(function(req){
        req.expect(403, done);
      });
    });

    it('returns a json message with error details', function(done){
      var expectedBody = { "error_code": "forbidden", "error_msg": "You are not allowed to access this scope" };

      this.doRequest(function(req){
        var correctBody = function(res) {
          assert.deepEqual(res.body, expectedBody);
        };

        req.expect(correctBody).end(done);
      });
    });
  },

  returnsNotFound: function(){
    it('returns a 404', function(done){
      this.doRequest(function(req){
        req.expect(404, done);
      });
    });
  },

  respondsToNotLoggedIn: function(){
    it.skip('returns a 401', function(){
      this.doRequest(function(req){
        req.expect(401, done);
      });
    });

    it.skip('returns a json message with error details', function(){
      var expectedBody = { "error_code": "not_logged_in", "error_msg": "Not logged in" };

      this.doRequest(function(req){
        var correctBody = function(res) {
          assert.deepEqual(res.body, expectedBody);
        };

        req.expect(correctBody).end(done);
      });
    });
  }
};