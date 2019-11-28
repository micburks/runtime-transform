#!/usr/bin/env node --loader ./loader.js

import {createReadStream, promises as fs} from 'fs';
import http from 'http';
import path from 'path';
import babel from '@babel/core';

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/') {
      const {default: render} = await import('./src/main.js');
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(render());
      res.end();
    } else {
      const filePath = path.resolve(
        path.join('src', req.url.replace(/^\//, ''))
      );
      const fileContents = await fs.readFile(filePath, 'utf-8');
      const newPath = path.join(
        path.dirname(filePath),
        path.basename(filePath)
          .replace(/\.js$/, '.browser.js')
          .replace(/^/, '.')
      );
      const transformed = babel.transform(
        fileContents,
        {configFile: './.babelrc.browser'}
      );
      await fs.writeFile(newPath, transformed.code);
      res.writeHead(200, {
        'Content-Type': 'application/javascript',
      });
      res.write(transformed.code);
      res.end();
    }
  } catch (e) {
    res.writeHead(500, {
      'Content-Type': 'text/html'
    });
    res.write('<h1>No good</h1>');
    res.end(`<p>${e.message}</p>`);
  }
});

server.listen(5000, () => {
  console.log(`http://localhost:${server.address().port}`);
});
