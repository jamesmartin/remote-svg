var RemoteSvg = function(selector) {
  var self = this;
  placeholder = document.getElementById(selector);
  if(placeholder === null) {
    return;
  }
  var request = new XMLHttpRequest();
  var remoteSvgUri = placeholder.getAttribute('data-remote-svg-uri');
  var svgClass = placeholder.getAttribute('data-remote-svg-class');
  var options = { id: placeholder.getAttribute('id'), class: svgClass }
  request.open('GET', remoteSvgUri, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var resp = request.responseText;
      var svg = self.createSvgFromResponse(resp, options);
      placeholder.outerHTML = svg.outerHTML;
    } else {
      placeholder.innerHTML = self.discreteComplaint(remoteSvgUri);
    }
  };

  request.onerror = function() {
    placeholder.innerHTML = self.discreteComplaint(remoteSvgUri);
  };

  request.send();
};

RemoteSvg.prototype.createSvgFromResponse = function(rawSvg, options) {
  var targetSvg = document.createElement('div');
  targetSvg.innerHTML = rawSvg;
  var svg = targetSvg.querySelector('svg')
  svg.setAttribute('id', options.id);

  if(options.hasOwnProperty('class') && options.class != null && options.class != undefined) {
    svg.setAttribute('class', options.class)
  }

  return svg;
};

RemoteSvg.prototype.discreteComplaint = function(remoteSvgUri) {
  return '<!-- SVG at "' + remoteSvgUri + '" could not be loaded -->';
};
