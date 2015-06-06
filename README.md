# Remote SVG

Embed and transform SVG documents from remote locations. 

Add CSS classes, remove comments, add description and title elements and specify height and width attributes.

## Install

TODO

## Use

Simply add a (ideally hidden) DOM element in your document, with an ID and (at least) the following data attribute:

```html
<h1>My Document</h1>

<div id='my-svg' data-remote-svg-uri='http://example.com/my-doc.svg'></div>


<script>
  remoteSvg.load(document.getElementById('my-svg'));
</script>
```

The SVG will be fetched from the remote location and embedded in place of your
div, like this:

```html
<h1>My Document</h1>

<svg id='my-svg'>
  <!-- svg data ... -->
</svg>
```

## Transformations

You can choose to apply transformations to the SVG by adding data attributes to the placeholder div. The following options are available:

|key      | description
|:------- | :---------- 
|`id`     | the ID of the placeholder element will be applied to the SVG
|`class`  | set a CSS class attribute on the SVG
|`size`   | set width and height attributes on the SVG <br/> Can also be set using `height` and/or `width` attributes, which take precedence over `size` <br/> Supplied as "{Width} * {Height}" or "{Number}", so "30px*45px" becomes `width="30px"` and `height="45px"`, and "50%" becomes `width="50%"` and `height="50%"`
|`title` | add a \<title\> node inside the top level of the SVG document
|`desc`  | add a \<desc\> node inside the top level of the SVG document
|`nocomment` | remove comment tags (and other unsafe/unknown tags) from the svg 
|`data`   | all data attributes not prefixed with `remote-svg` will be copied to the SVG


An example of a placeholder element specifying some transformations follows:

```html
<div 
  id='my-svg' 
  data-remote-svg-uri='http://example.com/my-doc.svg'
  data-remote-svg-class='my-class'
  data-remote-svg-height='25%'
  data-remote-svg-width='50px'
  data-remote-svg-desc='some description'
  data-remote-svg-title='some title'
  data-remote-nocomment='true'
  data-some-other-attr='my-attr'>
</div>
```

The output of the above transformations:

```html
<svg id='my-svg' class='my-class' height='25%' width='50px' data-some-other-attr='my-attr'>
  <description>some description</description>
  <title>some title</title>
  <!-- svg data ... -->
</svg>
```

