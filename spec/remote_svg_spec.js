var sinon = require('sinon');
JS.Test.describe('RemoteSvg', function() { with(this) {
  fixture("<div id='my-svg' data-remote-svg-uri='http://example.com/my-doc.svg'></div>");

  before(function() { with(this) {
    this.server = sinon.fakeServer.create();
    this.server.autoRespond = true;
    this.server.respondWith("GET", "http://example.com/my-doc.svg",
      [200, { "Content-Type": "application/svg" }, '<svg>some document</svg>']);
  }});

  after(function() { with(this) {
    this.server.restore();
  }});

  describe('loading from a remote URI', function() { with(this) {
    it('embeds the SVG into the placeholder of the document', function(resume) { with(this) {
      var promise = new RemoteSvg(document.getElementById('my-svg'));

      promise.then(function() {
        assertEqual('<svg id="my-svg">some document</svg>', document.getElementById('fixture').innerHTML);
        resume();
      });
    }});
  }});

  describe('when the placeholder does not exist', function() { with(this) {
    it('does nothing', function(resume) { with(this) {
      var promise = new RemoteSvg(document.getElementById('nonexistent'));

      promise.then(function() {
        assertEqual('', document.getElementById('my-svg').innerHTML);
        return resume();
      });
    }});
  }});

  describe('when not given an element placeholder', function() { with(this) {
    it('does nothing', function(resume) { with(this) {
      var promise = new RemoteSvg('not an element');

      promise.then(function() {
        assertEqual('', document.getElementById('my-svg').innerHTML);
        return resume();
      });
    }});
  }});

  describe('when the remote URI cannot be fetched', function() { with(this) {
    it('complains, discretely', function(resume) { with(this) {
      this.server.respondWith("GET", "http://example.com/my-doc.svg",
        [500, { "Content-Type": "text/html" }, 'Error!']);

      var promise = new RemoteSvg(document.getElementById('my-svg'));

      promise.then(function() {
        assertEqual('<!-- SVG at "http://example.com/my-doc.svg" could not be loaded -->', document.getElementById('my-svg').innerHTML);
        resume();
      });
    }});
  }});

  describe('transformations', function() { with(this) {
    it('adds a class to the document', function(resume) { with(this) {
      var placeholder = document.getElementById('my-svg')
      placeholder.setAttribute('data-remote-svg-class', 'some-class');

      var promise = new RemoteSvg(document.getElementById('my-svg'));

      promise.then(function() {
        assertEqual('<svg id="my-svg" class="some-class">some document</svg>', document.getElementById('fixture').innerHTML);
        resume();
      });
    }});
  }});
}});
