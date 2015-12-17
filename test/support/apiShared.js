var assert = require('assert');

module.exports = {
  respondsToNotAuthorized: function(){
    beforeEach(function(){
      this.userUuid = 'unexisting';
    });

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

  respondsToNotLoggedIn: function(){
    it('returns a 401', function(){

    });

    it('returns a json message with error details', function(){

    });
  }
};