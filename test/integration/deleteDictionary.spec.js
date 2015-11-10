var assert = require('assert');
var request = require('supertest');

var app = require('../../app');

describe('[INTEGRATION] Delete Dictionary', function(){
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
      describe('when the given record exists', function(){
        it('returns a 200', function(){

        });

        it('removes the record', function(){

        });

        it('returns the removed element as json', function(){

        });
      });

      describe('when the given record does not exist', function(){
        it('returns a 404', function(){

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