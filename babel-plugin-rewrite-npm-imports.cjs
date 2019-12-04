
const Module = require('module');
const builtins = new Set(Module.builtinModules);
const {resolve, relative} = require('path');

builtins.delete('assert');

const loaderConfig = {
  alias: {
    '__FUSION_ENTRY_PATH__!': './src/main.js',
    '__FUSION_ENTRY_PATH__': './src/main.js',
    'fusion-react': './fusion-react/src/index.js',
    'fusion-core': './fusion-core/src/index.js',
  }
};

module.exports = () => plugin;

function transform(path) {
  if (!path.node.source) {
    return;
  }
  const pkg = path.node.source.value;
  if (builtins.has(pkg)) {
    return;
  }
  if (pkg in loaderConfig.alias) {
    const resolved = relative(this.file.opts.filename, loaderConfig.alias[pkg]);
    path.node.source.value = resolved.startsWith('.') ? resolved : `./${resolved}`;
    return;
  }
  if (!pkg.startsWith('.')) {
    path.node.source.value = `/dew/${pkg}`;
  } else {
    const resolvedWithExt = pkg.endsWith('.js') ? pkg : `${pkg}.js`;
    path.node.source.value = resolvedWithExt;
  }
}

const plugin = {
  visitor: {
    ImportDeclaration(path) {
      transform.call(this, path);
    },
    ExportNamedDeclaration(path) {
      transform.call(this, path);
    }
  }
};
