
const Module = require('module');
const builtins = new Set(Module.builtinModules);

module.exports = () => plugin;

const plugin = {
  visitor: {
    ImportDeclaration(path) {
      const pkg = path.node.source.value;
      if (!/^\./.test(pkg) && !builtins.has(pkg)) {
        path.node.source.value = `https://dev.jspm.io/${pkg}`;
      }
    }
  }
};
