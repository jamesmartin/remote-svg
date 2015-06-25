// These deceptively simple, but utterly indespensable functions come
// *directly* from the excellent book *Functional Javascript*, by Michael Fogus.

export var existy = function(x) { return x != null };

export var truthy = function(x) { return (x !== false) && existy(x) };
