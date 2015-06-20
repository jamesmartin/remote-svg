export default function(JS) {
  JS.Test.Unit.TestCase.extend({
    // Create HTML fixtures without jQuery. Based on example code here:
    // http://jstest.jcoglan.com/browser.html
    fixture: function(html) {
      this.before(function() {
        var holder = document.getElementById('fixture');
        if (holder === null) {
          holder = document.createElement('div');
          holder.setAttribute('id', 'fixture');
          document.querySelector('body').appendChild(holder);
        }
        holder.innerHTML = html;
      });

      this.after(function() {
        document.getElementById('fixture').innerHTML = '';
      });
     }
  });
}
