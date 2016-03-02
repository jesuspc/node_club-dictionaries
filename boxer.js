module.exports = function() {
  var defined = {};
  var memoized = {};
  var mainBoxFolder = undefined;

  var delimiter = '.';

  var prefixed = function(prefix) {
    var _fetcher = function(context) {
      return fetcher([prefix, context].join(delimiter));
    };

    return {
      set: function(name, generator) {
        return set([prefix, name].join(delimiter), generator);
      },

      get: function(name) {
        return get([prefix, name].join(delimiter));
      },

      fetcher: _fetcher,

      fetch: function(dependencyName) {
        return _fetcher()(dependencyName);
      },

      box: function() { return box },

      enbox: function(folderPath) {
        return enbox(prefix.split(delimiter).join('/') + '/' + folderPath);
      },

      getMainBoxFolder: mainBoxFolder + '/' + prefix.split(delimiter).join('/'),

      root: root,

      autoloadInner: function(folderPath) {
        var folderPath = mainBoxFolder + '/' + prefix.split(delimiter).join('/');

        autoloadInner(folderPath);
      }
    }
  };

  var autoloadInner = function(folderPath) {
    var folderPath = folderPath || mainBoxFolder;
    var fs = require('fs');

    fs.readdirSync(folderPath).filter(function(fileOrFolderPath){
      return fs.lstatSync(folderPath + '/' + fileOrFolderPath).isFile();
    }).filter(function(fileName) {
      return !fileName.endsWith('box.js');
    }).map(function(fileName){
      var fileName = fileName.split('.')[0]
      var relativePath = folderPath.replace(mainBoxFolder, '') + '/' + fileName;
      var namespace = relativePath.slice(1).split('/').join(delimiter);
      set(namespace);
    });
  };

  var set = function(name, generator){
    var generator = generator || function() {
      var nameSplits = name.split(delimiter);
      return require(mainBoxFolder + '/' + nameSplits.join('/'))(self.fetcher(nameSplits.slice(0, -1).join(delimiter)));
    }

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

  var fetch = function(dependencyName) {
    return fetcher()(dependencyName);
  };

  var enbox = function(folderPath) {
    var boxPath = mainBoxFolder + '/' + folderPath + '/box';
    var splittedFolderPath = folderPath.split('/');
    var namespace = splittedFolderPath.join(delimiter);

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

  var setMainBoxFolder = function(path) {
    mainBoxFolder = path;
  };

  var root = fetcher('');

  var self = { set: set, get: get, box: box, fetcher: fetcher, enbox: enbox, setMainBoxFolder: setMainBoxFolder, getMainBoxFolder: mainBoxFolder, fetch: fetch };

  return self;
};