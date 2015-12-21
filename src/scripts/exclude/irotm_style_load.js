//  this is a test

var remoteLoader = {
    intialize: function () {
      console.log('remote foo');
      var self=this;
      this.intializeWatchers(); //listens for clicks
      this.addStyleToHead();
      this.findEntry ();
    },
    intializeWatchers: function () {
    },
    findEntry: function () {


      var entries = Array.prototype.slice.call(document.getElementsByClassName('machines-embed'));


      console.log('foo', entries);

      entries.forEach (function (entries) {
        console.log(entries.innerHTML);
        var container = document.createElement('div');
          container.setAttribute('class', 'machines-wrapper');
          container.innerHTML = entries.innerHTML;

          var parent = entries.parentNode;

          var foo = entries.childNode;

          console.log(foo);

          parent.insertBefore(container, entries);
          entries.remove();
      });

    },
    addStyleToHead: function () {
      var style = document.createElement('link');
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("type", "text/css")
        style.setAttribute("href", '/embed-css/irotm_embed_styles.css')
        document.head.appendChild(style);
    }
  };

  (function() {
      "use strict";
      remoteLoader.intialize();
    })();
