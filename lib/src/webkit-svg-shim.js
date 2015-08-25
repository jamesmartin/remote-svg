// Webkit doesn't yet (2015) implement the innerHTML and outerHTML properties
// of SVGElement objects, per the DOM Parsing spec:
// https://w3c.github.io/DOM-Parsing/#dom-element-innerhtml
//
// Thanks to sbrown345 for the defineProperty code:
// https://gist.github.com/jarek-foksa/2648095#gistcomment-778710

export var webkitSvgShim = function() {
  try {
    SVGElement.prototype.outerHTML;

    Object.defineProperty(SVGElement.prototype, 'outerHTML', {
        get: function () {
            var $node, $temp;
            $temp = document.createElement('div');
            $node = this.cloneNode(true);
            $temp.appendChild($node);
            return $temp.innerHTML;
        },
        enumerable: false,
        configurable: true
    });
  } catch(e) {
    // SVGElement.prototype.outerHTML is already defined
  };
};
