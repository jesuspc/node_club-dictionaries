var repl = require("repl");
var boxer = require('./boxer')();
var box = require('./lib/box')(boxer);

console.log('>>> Welcome to the Dictionaries microservice Repl.');
console.log('>>> The box object is available from here.');
r = repl.start("tokens> ");
r.context.box = box;
r.context.$ = function(inspectable) {
  console.log('' + inspectable);
};