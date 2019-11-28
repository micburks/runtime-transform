import React from "https://dev.jspm.io/react";
import browserRender from './browser-render.js';
import App from './app.js';
export default function () {
  if (false) {
    console.log('node good');
    return serverRender(React.createElement(App, null));
  }
}

if (true) {
  console.log('browser good');
  browserRender(React.createElement(App, null));
}