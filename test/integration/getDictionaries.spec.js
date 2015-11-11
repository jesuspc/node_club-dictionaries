var assert = require('assert');
var request = require('supertest');

var app = require('../../app');

describe.skip('[INTEGRATION] Get Dictionaries', function(){
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
    describe('when successful authorization', function(){
      describe('when no filters provided', function(){
        it('returns a 200', function(){

        });

        it('returns the expected list of dictionaries', function(){

        });
      });

      describe('when filters provided', function(){
        it('returns a 200', function(){

        });

        it('returns the expected list of dictionaries', function(){

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

  describe.skip('when user not logger in', function(){
    it('returns a 401', function(){

    });

    it('returns a json message with error details', function(){

    });
  });
});