#!/usr/bin/env node --loader ./loader.js
/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/* eslint-env node */

import fs from 'fs';
import path from 'path';
import cp from 'child_process';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);

const dir = process.cwd();
const entry = require.resolve('../entries/server-entry.js');

import(entry)
  .then(({start}) => {
    console.log('http://localhost:3000');
    return start({dir, port: 3000}); // handle server bootstrap errors (e.g. port already in use)
  }).catch((e) => {
    console.error(e);
  });
