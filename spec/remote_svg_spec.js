JS.Test.describe('RemoteSvg', function() { with(this) {
  fixture("<div id='my-svg' data-remote-svg-uri='http://example.com/my-doc.svg'></div>");

  before(function() { with(this) {
    this.xhr = sinon.useFakeXMLHttpRequest();
    var requests = this.requests = [];

    this.xhr.onCreate = function(xhr) {
      requests.push(xhr);
    };
  }});

  after(function() { with(this) {
    this.xhr.restore();
  }});

  describe('loading from a remote URI', function() { with(this) {
    it('embeds the SVG into the placeholder of the document', function() { with(this) {
      var remoteSvg = new RemoteSvg('my-svg');
      this.requests[0].respond(200, { "Content-Type": "application/svg" },
        '<svg>some document</svg>');

      assertEqual(1, this.requests.length);
      assertEqual('<svg id="my-svg">some document</svg>', document.getElementById('fixture').innerHTML);
    }});
  }});

  describe('when the placeholder does not exist', function() { with(this) {
    it('does nothing', function() { with(this) {
      var remoteSvg = new RemoteSvg('nonexistent');

      assertEqual('', document.getElementById('my-svg').innerHTML);
    }});
  }});

  describe('when the remote URI cannot be fetched', function() { with(this) {
    it('complains, discretely', function() { with(this) {
      var remoteSvg = new RemoteSvg('my-svg');

      this.requests[0].respond(500, { "Content-Type": "application/svg" },
        'Error!');

      assertEqual('<!-- SVG at "http://example.com/my-doc.svg" could not be loaded -->', document.getElementById('my-svg').innerHTML);
    }});
  }});

  describe('transformations', function() { with(this) {
    it('adds a class to the document', function() { with(this) {
      var placeholder = document.getElementById('my-svg')
      placeholder.setAttribute('data-remote-svg-class', 'some-class');

      var remoteSvg = new RemoteSvg('my-svg');

      this.requests[0].respond(200, { "Content-Type": "application/svg" },
        '<svg>some document</svg>');

      assertEqual('<svg id="my-svg" class="some-class">some document</svg>', document.getElementById('fixture').innerHTML);
    }});
  }});
}});
