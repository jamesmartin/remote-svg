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

  describe('loading a SVG from a remote URI', function() { with(this) {
    it('gets the document specified in the data attribute', function() { with(this) {
      var remoteSvg = new RemoteSvg('my-svg');
      this.requests[0].respond(200, { "Content-Type": "application/svg" },
        '<svg>some document</svg>');

      assertEqual(1, this.requests.length);
      assertEqual('<svg>some document</svg>', document.getElementById('my-svg').innerHTML);
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
}});
