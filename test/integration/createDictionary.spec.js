var assert = require('assert');
var request = require('supertest');

var box = require('../box')(),
    shared = require('../support/apiShared'),
    app = box.app();

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
      shared.respondsToNotAuthorized();

      it('does not create a record', function(){

      });
    });
  });

  describe.skip('when user not logger in', function(){
    shared.respondsToNotLoggedIn();
  });
});