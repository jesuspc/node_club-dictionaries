module.exports = function() {
  var defined = {};
  var memoized = {};
  var mainBoxFolder;

  var delimiter = '.';

  var dMerge = function(head, tail) {
    return [head, tail].join(delimiter);
  };

  var dSplit = function(namespace) {
    return namespace.split(delimiter);
  };

  var dJoin = function(collection) {
    return collection.join(delimiter);
  };

  var pathToNamespace = function(path) {
    return path.split('/').filter(function(e){ return e; }).join(delimiter);
  };

  var globPathToNamespace = function(path) {
    return pathToNamespace(path.replace(mainBoxFolder, ''));
  };

  var namespaceToPath = function(namespace) {
    return dSplit(namespace).join('/');
  };

  var namespaceToGlobPath = function(namespace) {
    return mainBoxFolder + '/' + namespaceToPath(namespace);
  };

  var prefixed = function(prefix) {
    var _fetcher = function(context) {
      return fetcher(dMerge(prefix, context));
    };

    return {
      set: function(name, generator) {
        return set(dMerge(prefix, name), generator);
      },

      get: function(name) {
        return get(dMerge(prefix, name));
      },

      fetch: function(dependencyName) {
        return _fetcher()(dependencyName);
      },

      fetcher: _fetcher,

      box: function() { return box; },

      enbox: function(folderPath) {
        return enbox(dSplit(prefix).join('/') + '/' + folderPath);
      },

      root: root,

      autoloadInner: function(folderPath) {
        autoloadInner(namespaceToGlobPath(prefix));
      }
    };
  };

  var autoloadInner = function(folderPath) {
    var fs = require('fs');
    folderPath = folderPath || mainBoxFolder;

    fs.readdirSync(folderPath).filter(function(fileOrFolderPath){
      return fs.lstatSync(folderPath + '/' + fileOrFolderPath).isFile();
    }).filter(function(fileName) {
      return !fileName.endsWith('box.js');
    }).map(function(fileName){
      var fileNameWoExtension = fileName.split('.')[0];
      var namespace = [globPathToNamespace(folderPath), fileNameWoExtension]
        .filter(function(e){ return e; }).join('.');
      set(namespace);
    });
  };

  var set = function(namespace, generator){
    generator = generator || function() {
      return require(namespaceToGlobPath(namespace))(fetcher(namespace));
    };

    defined[namespace] = generator;
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
        newContext = dJoin(dSplit(context).slice(0, -1));
        fetcher(newContext)(dependencyName);
      }

      return returnValue;
    };
  };

  var fetch = function(dependencyName) {
    return fetcher()(dependencyName);
  };

  var enbox = function(folderPath) {
    var boxPath = mainBoxFolder + '/' + folderPath + '/box';
    var splittedFolderPath = folderPath.split('/');
    var namespace = dJoin(splittedFolderPath);

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

  return {
    set: set, get: get, box: box, enbox: enbox,
    setMainBoxFolder: setMainBoxFolder, fetch: fetch, fetcher: fetcher,
    autoloadInner: autoloadInner
  };
};