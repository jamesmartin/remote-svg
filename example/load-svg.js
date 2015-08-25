import {RemoteSvg} from 'lib/index'

new RemoteSvg(document.getElementById('my-svg'))
.then(function() { return console.log('SVG Loaded!'); })
.catch(function(err) { return console.log("Uh, oh: " + err.stack + " " + err.message); });
