var boxer = require('./boxer')();
var box = require('./lib/box')(boxer);

module.exports = box.app();