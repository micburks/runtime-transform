import {existsSync, promises as fs} from 'fs';
import path from 'path';
import Module, {createRequire} from 'module';
import process from 'process';
import { URL, pathToFileURL } from 'url';
import babel from '@babel/core';
import {promisify} from 'util';
import {exec} from 'child_process';
import loaderConfig from './.babel-loader.config.js';

const relativeRegex = /^\.{0,2}[/]/;
const builtins = new Set(Module.builtinModules);
const baseURL = pathToFileURL(process.cwd()).href;
const run = promisify(exec);
const require = createRequire(import.meta.url);
const blackList = [
  path.resolve('./.babel-loader.config.js')
];

export async function resolve(
  specifier,
  parentModuleURL = baseURL,
  defaultResolver
) {
  if (builtins.has(specifier)) {
    return {
      url: specifier,
      format: 'builtin'
    };
  }

  if (specifier.startsWith('raw:')) {
    return defaultResolver(
      specifier.replace(/^raw\:\/?/, ''),
      parentModuleURL
    );
  }

  if (!relativeRegex.test(specifier)) {
    // node_modules
    return defaultResolver(specifier, parentModuleURL);
  } else {
    // relative
    const newPath = await babelLoader(
      new URL(specifier, parentModuleURL),
      'server',
    );
    return {
      url: new URL(newPath, parentModuleURL).href,
      format: 'module'
    };
  }
}

export async function resolveNodeModules(nodeModule) {
  let hash;
  const url = require.resolve(nodeModule);
  try {
    const {stdout: md5Hash} = await run(`md5sum ${url}`);
    hash = md5Hash.slice(0, 6);
  } catch (e) {
    console.log(e);
    return url;
  }
  const newPath = getFileName(url, 'nm', hash);
  if (existsSync(newPath)) {
    // regardless of loaderConfig.cache
    return newPath;
  }
  const contents = await fs.readFile(url, 'utf-8');
  const transformed = babel.transform(
    contents,
    {
      plugins: [
        ['babel-plugin-transform-cjs-dew', {
          define: {
            'process.env.NODE_ENV': '"development"'
          },
        }],
        '@babel/plugin-syntax-dynamic-import',
        [require.resolve('./babel-plugin-relative-npm-imports.cjs'), {
          parent: nodeModule,
          parentFilePath: url,
        }],
      ],
      presets: [
        '@babel/preset-react'
      ]
    },
  );
  await fs.writeFile(newPath, transformed.code);
  return newPath;
}

export async function babelLoader(url, env) {
  let envPath, hash;
  url = url.pathname ? url.pathname : url;
  if (blackList.includes(url)) {
    return url;
  }
  try {
    const {stdout: md5Hash} = await run(`md5sum ${url}`);
    hash = md5Hash.slice(0, 6);
  } catch (e) {
    return url;
  }
  if (loaderConfig.cache) {
    const maybePath = getFileName(url, env, hash);
    if (existsSync(maybePath)) {
      return maybePath;
    }
    const contents = await fs.readFile(url, 'utf-8');
    for (const config of loaderConfig.configs) {
      const newPath = getFileName(url, config.name, hash);
      const transformed = babel.transform(
        contents,
        {configFile: config.configFile}
      );
      await fs.writeFile(newPath, transformed.code);
      if (env === config.name) {
        envPath = newPath;
      }
    }
    if (!envPath) {
      throw new Error(`invalid env passed to babel runtime loader: ${env}`);
    }
    return envPath;
  } else {
    const config = loaderConfig.configs.find(config => config.name === env);
    if (!config) {
      throw new Error(`invalid env passed to babel runtime loader: ${env}`);
    }
    const newPath = getFileName(url, config.name, hash);
    const contents = await fs.readFile(url, 'utf-8');
    const transformed = babel.transform(
      contents,
      {configFile: config.configFile}
    );
    await fs.writeFile(newPath, transformed.code);
    return newPath;
  }
}

function getFileName (url, env, hash) {
  return path.join(
    path.dirname(url),
    path.basename(url)
      .replace(/^/, '.')
      .replace(/\.js$/, loaderConfig.cache ? `.${env}.${hash}.js` : `.${env}.js`)
  );
}
