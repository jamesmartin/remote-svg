var RemoteSvg = function(placeholder) {
  var self = this;
  if(placeholder === null || !(placeholder instanceof Element)) {
    return Promise.resolve();
  }

  var remoteSvgUri = placeholder.getAttribute('data-remote-svg-uri');
  var svgClass = placeholder.getAttribute('data-remote-svg-class');
  var options = { id: placeholder.getAttribute('id'), class: svgClass }

  return self.svgFromRemote(remoteSvgUri)
  .then(self.updatePlaceholder(placeholder, options))
  .catch(function(err) {
    return placeholder.innerHTML = self.discreteComplaint(remoteSvgUri);
  });
};

RemoteSvg.prototype.svgFromRemote = function(uri) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.onload = function() {
      if(request.status >= 200 && request.status < 400) {
        return resolve(request.responseText);
      } else {
        return reject();
      }
    };
    request.onerror = function() {
      return reject();
    };
    request.open('GET', uri, true);
    request.send();
  });
};

RemoteSvg.prototype.updatePlaceholder = function(target, options) {
  var self = this;

  return function(rawSvg) {
    var svg = self.createSvgFromResponse(rawSvg, options);
    target.outerHTML = svg.outerHTML;
  }
}

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
