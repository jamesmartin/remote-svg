// spec/runner.js

var run = function() { JS.Test.autorun() }

var ROOT = JS.ENV.ROOT || '.'
JS.cache = false

JS.load(  ROOT + '/lib/remote_svg.js',
          ROOT + '/spec/helpers.js',
          ROOT + '/spec/remote_svg_spec.js',
          ROOT + '/build/sinon-1.15.0.js',

          // add files here as the project grows

          run)
