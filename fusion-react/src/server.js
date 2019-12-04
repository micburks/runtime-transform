/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/* eslint-env node */
import React from 'react';
import ReactDOMServer from 'react-dom/server.js';
const {renderToString} = ReactDOMServer;

export default (el: React.Element<*>) =>
  `<div id='root'>${renderToString(el)}</div>`;
