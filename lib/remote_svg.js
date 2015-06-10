var RemoteSvg = function(selector) {
  var self = this;
  placeholder = document.getElementById(selector);
  var request = new XMLHttpRequest();
  var remoteSvgUri = placeholder.getAttribute('data-remote-svg-uri');
  request.open('GET', remoteSvgUri, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var resp = request.responseText;
      var svg = self.createSvgFromResponse(resp, selector);
      placeholder.outerHTML = svg.outerHTML;
    } else {
      console.log('Non "OK"');
      placeholder.innerHTML = self.discreteComplaint(remoteSvgUri);
    }
  };

  request.onerror = function() {
    console.log('Error');
    placeholder.innerHTML = self.discreteComplaint(remoteSvgUri);
  };

  request.send();
};

RemoteSvg.prototype.createSvgFromResponse = function(rawSvg, id) {
  var targetSvg = document.createElement('div');
  targetSvg.innerHTML = rawSvg;
  var svg = targetSvg.querySelector('svg')
  svg.setAttribute('id', id);
  return svg;
};

RemoteSvg.prototype.discreteComplaint = function(remoteSvgUri) {
  return '<!-- SVG at "' + remoteSvgUri + '" could not be loaded -->';
};
