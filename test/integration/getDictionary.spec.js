var assert = require('assert');
var request = require('supertest');

var app = require('../../app');

describe('[INTEGRATION] Get Dictionary', function(){
  beforeEach(function(){
    this.setupDb = function() {

    };

    this.teardownDb = function() {

    };

    this.doRequest = function() {

    };
  });

  afterEach(function(){
    this.teardownDb();
  });

  describe('when user logged in', function(){
    describe('when the provided dictionary does not exists', function(){
      it('returns a 404', function(){

      });
    });

    describe('when the provided dictionary exists', function(){
      describe('when successful authorization', function(){
        it('returns a 200', function(){

        });

        it('returns the expected dictionary', function(){

        });
      });

      describe('when unsuccessful authorization', function(){
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