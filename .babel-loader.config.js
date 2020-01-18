import path from 'path';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);

export default {
  cache: true,
  runtime: 'server',
  configs: [
    { name: 'server', configFile: require.resolve('./.babelrc.server') },
    { name: 'browser', configFile: require.resolve('./.babelrc.browser') },
  ],
  alias: {
    '__SECRET_I18N_MANIFEST_INSTRUMENTATION_LOADER__!': null,
    '__FUSION_ENTRY_PATH__!': path.resolve('./src/main.js'),
    '__FUSION_ENTRY_PATH__': path.resolve('./src/main.js'),
    'fusion-react': require.resolve('./fusion-react/src/index.js'),
    'fusion-core': require.resolve('./fusion-core/src/index.js'),
  }
};
