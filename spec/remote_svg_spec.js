export default function(sinon, RemoteSvg) {
  JS.Test.describe('RemoteSvg', function() {
    this.fixture("<div id='my-svg' data-remote-svg-uri='http://example.com/my-doc.svg'></div>");

    this.before(function() {
      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;
      this.server.respondWith("GET", "http://example.com/my-doc.svg",
        [200, { "Content-Type": "application/svg" }, '<svg>some document</svg>']);
    });

    this.after(function() {
      this.server.restore();
    });

    this.describe('loading from a remote URI', function() {
      this.it('embeds the SVG into the placeholder of the document', function(resume) {
        var promise = new RemoteSvg(document.getElementById('my-svg'));

        var check = (function(jstest, resume) {
          return function() {
            jstest.assertEqual('<svg id="my-svg">some document</svg>', document.getElementById('fixture').innerHTML);
            resume();
          }
        })(this, resume);

        promise.then(check);
      });
    });

    this.describe('when the placeholder does not exist', function() {
      this.it('does nothing', function(resume) {
        var promise = new RemoteSvg(document.getElementById('nonexistent'));

        var check = (function(jstest, resume) {
          return function() {
            jstest.assertEqual('', document.getElementById('my-svg').innerHTML);
            return resume();
          }
        })(this, resume);

        promise.then(check);
      });
    });

    this.describe('when not given an element placeholder', function() {
      this.it('does nothing', function(resume) {
        var promise = new RemoteSvg('not an element');

        var check = (function(jstest, resume) {
          return function() {
            jstest.assertEqual('', document.getElementById('my-svg').innerHTML);
            return resume();
          }
        })(this, resume);

        promise.then(check);
      });
    });

    this.describe('when the remote URI cannot be fetched', function() {
      this.it('complains, discretely', function(resume) {
        this.server.respondWith("GET", "http://example.com/my-doc.svg",
          [500, { "Content-Type": "text/html" }, 'Error!']);

        var promise = new RemoteSvg(document.getElementById('my-svg'));

        var check = (function(jstest, resume) {
          return function() {
            jstest.assertEqual('<!-- SVG at "http://example.com/my-doc.svg" could not be loaded -->', document.getElementById('my-svg').innerHTML);
            return resume();
          }
        })(this, resume);

        promise.then(check);
      });
    });

    this.describe('transformations', function() {
      this.it('adds a class to the document', function(resume) {
        var placeholder = document.getElementById('my-svg')
        placeholder.setAttribute('data-remote-svg-class', 'some-class');

        var promise = new RemoteSvg(document.getElementById('my-svg'));

        var check = (function(jstest, resume) {
          return function() {
            jstest.assertEqual('<svg id="my-svg" class="some-class">some document</svg>', document.getElementById('fixture').innerHTML);
            return resume();
          }
        })(this, resume);

        promise.then(check);
      });
    });
  });
}
