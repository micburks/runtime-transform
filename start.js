#!/usr/bin/env node --loader ./babel-loader.js

import {promises as fs} from 'fs';
import http from 'http';
import path from 'path';
import {babelLoader, resolveNodeModules} from 'raw:./babel-loader.js';

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/npm/')) {
      const nodeModule = req.url.replace('/npm/', '');
      const newPath = await resolveNodeModules(nodeModule);
      const fileContents = await fs.readFile(newPath, 'utf-8');
      res.writeHead(200, {
        'Content-Type': 'application/javascript',
      });
      res.write(fileContents);
      res.end();
    } else if (req.url.startsWith('/dew/')) {
      const pkg = req.url.replace('/dew/', '');
      res.writeHead(200, {
        'Content-Type': 'application/javascript',
      });
      res.write(`import {dew} from '/npm/${pkg}';\nexport default dew();`);
      res.end();
    } else if (req.url.endsWith('.js')) {
      const filePath = path.resolve(
        path.join('src', req.url.replace(/^\//, ''))
      );
      const newPath = await babelLoader(filePath, 'browser');
      const fileContents = await fs.readFile(newPath, 'utf-8');
      res.writeHead(200, {
        'Content-Type': 'application/javascript',
      });
      res.write(fileContents);
      res.end();
    } else if (req.url.includes('.')) {
      res.writeHead(404, {
        'Content-Type': 'text/html',
      });
      res.write('<h1>not found</h1>');
      res.end();
    } else {
      const {default: render} = await import('./src/main.js');
      const rendered = render(req.url);
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(rendered);
      res.end();
    }
  } catch (e) {
    console.error(e);
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
