var repl = require("repl");
var modules = require('./lib/boxer').modules();

console.log('>>> Welcome to the Dictionaries microservice Repl.');
console.log('>>> The modules object is available from here.');
r = repl.start("tokens> ");
r.context.modules = modules;
r.context.$ = function(inspectable) {
  console.log('' + inspectable);
};