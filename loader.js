import {promises as fs} from 'fs';
import path from 'path';
import Module from 'module';
import process from 'process';
import { URL, pathToFileURL } from 'url';
import babel from '@babel/core';
import shared from './shared.js';

const relativeRegex = /^\.{0,2}[/]/;
const builtins = new Set(Module.builtinModules);
const baseURL = pathToFileURL(process.cwd()).href;

export async function resolve(
  specifier,
  parentModuleURL = baseURL,
  defaultResolver
) {
  console.log('loader', shared.value);
  shared.add();
  console.log('after loader', shared.value);

  if (builtins.has(specifier)) {
    return {
      url: specifier,
      format: 'builtin'
    };
  }

  if (!relativeRegex.test(specifier)) {
    // node_modules
    return defaultResolver(specifier, parentModuleURL);
  } else {
    // relative
    const url = new URL(specifier, parentModuleURL);
    const contents = await fs.readFile(url.pathname, 'utf-8');
    const transformed = babel.transform(
      contents,
      {configFile: './.babelrc.server'}
    );
    const newPath = path.join(
      path.dirname(url.pathname),
      path.basename(url.pathname)
        .replace(/\.js$/, '.server.js')
        .replace(/^/, '.')
    );
    await fs.writeFile(newPath, transformed.code);
    return {
      url: new URL(newPath, parentModuleURL).href,
      format: 'module'
    };
  }
}
