var assert = require('assert');
var request = require('supertest');

var app = require('../../app');

describe.skip('[INTEGRATION] Create Dictionary', function(){
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
      describe('when payload provided', function(){
        it('returns a 200', function(){

        });

        it('creates a record with by merging the given name and the payload', function(){

        });

        it('returns the created element as json', function(){

        });
      });

      describe('when no payload provided', function(){
        it('returns a 200', function(){

        });

        it('creates a record with by with the given name', function(){

        });

        it('returns the created element as json', function(){

        });
      });

      describe('when there was a previous entry with the given name', function(){
        it('overrides the previous entry', function(){

        });
      });
    });

    describe.skip('when unsuccessful authorization', function(){
      it('returns a 403', function(){

      });

      it('does not create a record', function(){

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