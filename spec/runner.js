// spec/runner.js

var JS = require('jstest');

var run = function() { JS.Test.autorun() }

var ROOT = JS.ENV.ROOT || '.'
JS.cache = false

require('remotesvg');
require('./helpers')
require('./remote_svg_spec')
run();

//JS.load(  ROOT + '/lib/remote_svg.js',
//          ROOT + '/spec/helpers.js',
//          ROOT + '/spec/remote_svg_spec.js',
//          run)
