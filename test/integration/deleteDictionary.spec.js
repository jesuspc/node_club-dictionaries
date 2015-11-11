var assert = require('assert');
var request = require('supertest');

var box = require('../box')(),
    shared = require('../support/apiShared'),
    dbConnection = box.persistence.client(),
    app = box.app();

describe.skip('[INTEGRATION] Delete Dictionary', function(){
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
      shared.respondsToNotAuthorized();

      it('does not remove the record', function(){

      });
    });
  });

  describe.skip('when user not logger in', function(){
    shared.respondsToNotLoggedIn();
  });
});