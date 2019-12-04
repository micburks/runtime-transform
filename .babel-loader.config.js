import path from 'path';

export default {
  cache: false,
  configs: [
    { name: 'server', configFile: './.babelrc.server' },
    { name: 'browser', configFile: './.babelrc.browser' },
  ],
  alias: {
    '__SECRET_I18N_MANIFEST_INSTRUMENTATION_LOADER__!': null,
    '__FUSION_ENTRY_PATH__!': path.resolve('./src/main.js'),
    '__FUSION_ENTRY_PATH__': path.resolve('./src/main.js'),
    'fusion-react': path.resolve('./fusion-react/src/index.js'),
    'fusion-core': path.resolve('./fusion-core/src/index.js'),
  }
};
