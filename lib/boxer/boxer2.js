module.exports = function(rootPath) {

    var autobind = function(basePath) {
        dirname = rootPath + '/' + basePath + '/box.js'
        newSelf = { autobind: autobind, dirname: (rootPath + '/' + basePath + '/box.js') }
        innerBox = require(dirname)(newSelf);
    }

    var self = { autobind: autobind, dirname: rootPath };

    return self;
}