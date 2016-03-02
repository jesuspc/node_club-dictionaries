module.exports = function() {
  var defined = {};
  var memoized = {};

  var delimiter = '.';

  var prefixed = function(prefix) {
    return {
      set: function(name, generator) {
        return set([prefix, name].join(delimiter), generator);
      },

      get: function(name) {
        return get([prefix, name].join(delimiter));
      },

      fetcher: function(context) {
        return fetcher([prefix, context].join(delimiter));
      },

      box: function() { return box },

      enbox: function(folderPath) {
        return enbox(folderPath);
      },

      autoloadInner: function(folderPath) {
        console.log(folderPath)
        return autoloadInner(folderPath);
      },

      setFromFile: function(filePath) {
        return setFromFile(filePath);
      },

      root: root
    }
  };

  var autoloadInner = function(folderPath, prefix) {
    var fs = require('fs');

    fs.readdirSync(folderPath).filter(function(fileOrFolderPath){
      return fs.lstatSync(folderPath + '/' + fileOrFolderPath).isFile();
    }).filter(function(fileName) {
      return !fileName.endsWith('box.js');
    }).map(function(fileName){
      setFromFile(folderPath + '/' + fileName, fileName);
    });
  };

  var setFromFile = function(filePath, name, prefix) {
    var prefix = prefix || ''
    console.log('Setting from File: ' + filePath + ' as ' + name);
    self.set(name, function(){
      //Careful with fetcher!
      return require(filePath)(self.fetcher());
    });
  };

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

  var enbox = function(folderPath) {
    var boxPath = folderPath + '/box';
    var splittedFolderPath = folderPath.split('/');
    var namespace = splittedFolderPath[splittedFolderPath.length - 1];

    require(boxPath)(prefixed(namespace));
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

  var root = fetcher('');

  var self = { set: set, get: get, box: box, fetcher: fetcher, enbox: enbox };

  return self;
};