var findit = require('findit');
var path = require('path');
var fs = require('fs');

var createSpecObj = function(path, root) {
    return {
        path: function() { return path; },
        relativePath: function() { return path.replace(root, '').replace(/^[\/\\]/, ''); },
        directory: function() { return path.replace(/[\/\\][\s\w\.-]*$/, ""); },
        relativeDirectory: function() { return relativePath().replace(/[\/\\][\s\w\.-]*$/, ""); },
        filename: function() { return path.replace(/^.*[\\\/]/, ''); }
    };
};

var SpecCollection = function() {
  this.specs = [];
};

SpecCollection.prototype.load = function(loadpath, matcher) {

    var wannaBeSpecs = findit.sync(loadpath)

    for (var i = 0; i < wannaBeSpecs.length; i++) {
        var file = wannaBeSpecs[i];
        try {
            if (fs.statSync(file).isFile()) {
                if (!/.*node_modules.*/.test(file) && matcher.test(path.basename(file))) {
                    this.specs.push(createSpecObj(file));
                }
            }
        } catch(e) {
            // nothing to do here
        }
    }
    
    return this;
};

SpecCollection.prototype.getSpecs = function() {
  return this.specs;
};

exports.create = function() {
  return new SpecCollection();
};

