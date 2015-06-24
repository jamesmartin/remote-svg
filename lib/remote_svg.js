import _ from 'underscore';
import Promise from 'lie';
import {existy, truthy} from './foundations';

export var RemoteSvg = function(placeholder) {
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
};

RemoteSvg.prototype.createSvgFromResponse = function(rawSvg, options) {
  var svg = this.svgElementFrom(rawSvg);

  return this.applyTransformations(svg, options);
};

RemoteSvg.prototype.svgElementFrom = function(rawSvg) {
  var targetSvg = document.createElement('div');
  targetSvg.innerHTML = rawSvg;
  return targetSvg.querySelector('svg');
};

RemoteSvg.prototype.applyTransformations = function(svg, options) {
  var self = this;

  var transformedDoc = _.reduce(self.presentOptions(options), function(svg, value, key) {
    var transform = self.lookupTransformation(key);
    var newSvg = transform(value, self.svgElementFrom(svg.outerHTML));
    return newSvg;
  }, self.svgElementFrom(svg.outerHTML));

  return transformedDoc;
};

RemoteSvg.prototype.presentOptions = function(options) {
  return _.omit(options, function(value, key, object) {
    return !truthy(value);
  });
};

RemoteSvg.prototype.lookupTransformation = function(key) {
  var noTransformation = function(value, svg) { return svg }

  return this.transformations()[key] || noTransformation;
};

RemoteSvg.prototype.transformations = function() {
  var self = this;

  return {
    'id': function(value, svg) {
          var doc = self.svgElementFrom(svg.outerHTML);
          doc.setAttribute('id', value);
          return doc;
    },
    'class': function(value, svg) {
      var doc = self.svgElementFrom(svg.outerHTML);
      doc.setAttribute('class', value);
      return doc;
    }
  }
};

RemoteSvg.prototype.discreteComplaint = function(remoteSvgUri) {
  return '<!-- SVG at "' + remoteSvgUri + '" could not be loaded -->';
};
