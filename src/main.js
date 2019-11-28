
import React from 'react';
import browserRender from './browser-render.js';
import serverRender from './server-render.js';
import App from './app.js';

export default function () {
  if (__NODE__) {
    console.log('node good');
    return serverRender(<App />);
  }
}

if (__BROWSER__) {
  console.log('browser good');
  browserRender(<App />);
}
