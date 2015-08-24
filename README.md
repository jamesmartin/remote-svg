# Remote SVG

Embed and transform SVG documents from remote locations. 

Add CSS classes, remove comments, add description and title elements and specify height and width attributes.

## Install

RemoteSVG is an ES6 module that can be installed via [jspm](http://jspm.io). For example, install version 0.1.0 like this:

`jspm install remote-svg=github:jamesmartin/remote-svg@0.1.0`

## Use

Simply add a (ideally hidden) DOM element in your document, with an ID and (at least) the following data attribute:

```html
<h1>My Document</h1>

<div id='my-svg' data-remote-svg-uri='http://example.com/my-doc.svg'></div>

<script>
  import {RemoteSvg} from 'lib/remote_svg';
  new RemoteSvg(document.getElementById('my-svg'));
</script>
```

The SVG will be fetched from the remote location and embedded in place of your
div, like this:

```html
<h1>My Document</h1>

<svg id='my-svg'>
  <!-- svg data ... -->
</svg>
```

The RemoteSvg constructor returns a promise, so you can run your own code once the SVG has been fetched from the remote URI, transformed and embedded inline:

```html
<script>
  new RemoteSvg(document.getElementById('my-svg'))
  .then(function() { console.log('My SVG has been loaded!'); })
  .catch(function(err) { console.log('Something went wrong: ' + err); });
</script>
```

## Transformations

You can choose to apply transformations to the SVG by adding data attributes to the placeholder div. The following options are available:

|key      | description
|:------- | :---------- 
|`id`     | the ID of the placeholder element will be applied to the SVG
|`class`  | set a CSS class attribute on the SVG
|`size`   | set width and height attributes on the SVG <br/> Can also be set using `height` and/or `width` attributes, which take precedence over `size` <br/> Supplied as "{Width} * {Height}" or "{Number}", so "30px*45px" becomes `width="30px"` and `height="45px"`, and "50%" becomes `width="50%"` and `height="50%"`
|`title` | add a \<title\> node inside the top level of the SVG document
|`desc`  | add a \<desc\> node inside the top level of the SVG document
|`nocomment` | remove comment tags (and other unsafe/unknown tags) from the svg 
|`data`   | all data attributes not prefixed with `remote-svg` will be copied to the SVG


An example of a placeholder element specifying some transformations follows:

```html
<div 
  id='my-svg' 
  data-remote-svg-uri='http://example.com/my-doc.svg'
  data-remote-svg-class='my-class'
  data-remote-svg-height='25%'
  data-remote-svg-width='50px'
  data-remote-svg-desc='some description'
  data-remote-svg-title='some title'
  data-remote-nocomment='true'
  data-some-other-attr='my-attr'>
</div>
```

The output of the above transformations:

```html
<svg id='my-svg' class='my-class' height='25%' width='50px' data-some-other-attr='my-attr'>
  <description>some description</description>
  <title>some title</title>
  <!-- svg data ... -->
</svg>
```


## Contributing

Please fork, branch, test & pull-request. Thank you.


### Local Development Setup

RemoteSvg is written in (mostly) [ES6 module](http://developer.telerik.com/featured/choose-es6-modules-today/) syntax. Its dependencies are managed, loaded and polyfilled with [jspm.io](http://jspm.io) and [SystemJS](https://github.com/systemjs/systemjs).

To get the tests running locally, do this:

1. Clone this repo.
1. Install [Node.js](https://nodejs.org).
1. Install [jspm](http://jspm.io): `npm install -g jspm/jspm-cli && npm install jspm --save-dev`
1. Install the dependencies locally (equivalent of bundle install in the Ruby world): `jspm install`
1. I recommend using a simple reloading server, like [live-server](https://www.npmjs.com/package/live-server): `npm install --global live-server`
    * Start live-server: `live-server`
    * Load the specs in your browser: [http://localhost:8080/spec/browser.html](http://localhost:8080/spec/browser.html)
    * Write tests, rinse, repeat.

### Testing

RemoteSvg is tested with [jstest](http://jstest.jcoglan.com). Those familiar with jstest will be aware of the framework's use of the `with(this)` pattern to minimize pollution of the global namespace. For example:

```javascript
JS.Test.describe('Some thing', function() { with(this) {
    describe('returning some value', function() { with(this) {
        it('does what we expect', function() { with(this) {
          assertEqual('some value', ourFunction());
        }});
      }});
  }});
```

Because RemoteSvg and its tests are loaded as ES6 modules, we are forced to run the tests in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode), which means we can't use the `with(this)` syntax, and our tests end up looking like this:

```javascript
JS.Test.describe('Some thing', function() {
    this.describe('returning some value', function() {
        this.it('does what we expect', function() {
          this.assertEqual('some value', ourFunction());
        });
      });
  });
```

You will notice that because we also use Promises, and jstest's [asynchronous tests](http://jstest.jcoglan.com/async.html), we also have to extract some of our assertions out into partially applied functions, in order to keep jstest's `this` and asnyc `resume` functions in scope:
```javascript
JS.Test.describe('Some promise-based thing', function() {
    this.describe('returning some value', function() {
        this.it('does what we expect, eventually', function(resume) {

          var assertion = (function(jstest, resume) {
              return function(actual) {
                  jstest.assertEqual("expected", actual);
                  return resume();
                }
            })(this, resume);

          ourPromiseFunction().then(assertion);
        });
      });
  });
```
