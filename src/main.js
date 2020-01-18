
import React from 'react';
import FusionApp from 'fusion-react';
import noBuild from './no-build.js';
import Root from './app.js';

export default function () {
  const app = new FusionApp(<Root />);
  if (__NODE__) {
    app.middleware(noBuild);
  }
  return app;
}
