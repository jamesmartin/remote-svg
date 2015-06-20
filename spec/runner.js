// spec/runner.js

import JS from 'jstest';

var ROOT = JS.ENV.ROOT || '.'
JS.cache = false

import {RemoteSvg} from '../lib/remote_svg';

import helpers from './helpers';
helpers(JS);

import sinon from 'sinon';
import spec from './remote_svg_spec';

spec(sinon, RemoteSvg);
var run = function() { JS.Test.autorun() }
run();

