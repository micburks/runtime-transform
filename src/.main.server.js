import React from 'react';
import serverRender from './server-render.js';
import App from './app.js';
export default function () {
  if (true) {
    console.log('node good');
    return serverRender(React.createElement(App, null));
  }
}

if (false) {
  console.log('browser good');
  browserRender(React.createElement(App, null));
}