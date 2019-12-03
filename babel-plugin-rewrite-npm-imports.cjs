
const Module = require('module');
const builtins = new Set(Module.builtinModules);

module.exports = () => plugin;

const plugin = {
  visitor: {
    ImportDeclaration(path) {
      const pkg = path.node.source.value;
      if (builtins.has(pkg)) {
        return;
      }
      if (!pkg.startsWith('.')) {
        path.node.source.value = `/dew/${pkg}`;
      }
    }
  }
};
