
const {dirname, join, resolve} = require('path');
const Module = require('module');
const builtins = new Set(Module.builtinModules);

module.exports = (config, options) => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const target = path.node.source.value;
        if (target.startsWith('.')) {
          let package = options.parent.startsWith('@')
           ? options.parent.match(/(@.+?\/.+?)\//)
           : options.parent.match(/(.+?)\//);
          package = package ? package[1] : options.parent;
          const relative = join(dirname(options.parentFilePath), target);
          const resolved = relative.slice(relative.indexOf(package));
          path.node.source.value = `/npm/${resolved}`;
        } else {
          path.node.source.value = `/npm/${target}`;
        }
      }
    }
  };
};
