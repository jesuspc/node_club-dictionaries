module.exports = function() {
  var defined = {};
  var memoized = {};

  var delimiter = '.';

  var set = function(name, generator){
    defined[name] = generator;
  };

  var get = function(name) {
    memoized_elm = memoized[name];

    if(!!memoized_elm) {
      return memoized_elm;
    } else {
      generated = defined[name]();
      memoized[name] = generated;
      return generated;
    }
  };

  var fetcher = function(context) {
    return function(dependencyName) {
      var atThislevel = Object.keys(defined).filter(function(prop) {
        return prop.startsWith(context);
      }).filter(function(prop){
        if(!!context) {
          return prop === context + delimiter + dependencyName;
        } else {
          return prop === dependencyName;
        }
      })[0];

      if(atThislevel || context === '') {
        if(atThislevel) {
          returnValue = get(atThislevel);
        } else {
          returnValue = undefined;
        }
      } else {
        newContext = context.split(delimiter).slice(0, -1).join(delimiter);
        fetcher(newContext)(dependencyName);
      }

      return returnValue;
    }
  };

  var box = function(){
    var accum = {};
    var splitted, serveFunction;

    var expandTree = function(prop){
      splitted = prop.split(delimiter);

      buildPropertyTree(splitted, accum, function(){
        return get(prop);
      });
    };

    for (var property in defined) {
      if (defined.hasOwnProperty(property)) { expandTree(property); }
    }
    return accum;
  };

  var buildPropertyTree = function(itinerary, accum, fn){
    var newAccum;
    var key;

    if(itinerary.length == 1){
      accum[itinerary.shift()] = fn;
    } else {
      key = itinerary.shift();
      accum[key] = accum[key] || {};
      buildPropertyTree(itinerary, accum[key], fn);
    }
  };

  return { set: set, get: get, box: box, fetcher: fetcher };
};