import {RemoteSvg} from 'lib/remote_svg'

new RemoteSvg(document.getElementById('my-svg'))
.then(function() { return console.log('SVG Loaded!'); })
.catch(function(err) { return console.log(err); });
