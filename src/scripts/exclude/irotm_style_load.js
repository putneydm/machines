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
      entries.forEach (function (entries) {
        console.log(entries.innerHTML);
        var container = document.createElement('article');
          container.setAttribute('class', 'machines-wrapper');
          container.innerHTML = entries.innerHTML;

          var parent = entries.parentNode;
          var foo = entries.firstChild;

          // removes headline and replaces with h3
          var headline = document.createElement('h3');
          headline.setAttribute('class', 'machines-embed-headline');
          headline.innerText = foo.innerText;

          container.firstChild.remove()
          container.insertBefore(headline, container.firstChild);

          var branding = document.createElement('figure');
          branding.setAttribute('class', 'machines-embed-branding');

          var brandingImage = document.createElement('IMG');
          brandingImage.setAttribute('src', '/siteart/embed-branding.svg');
          brandingImage.setAttribute('src', 'https://machines.firebaseapp.com/siteart/embed-branding.svg');
          brandingImage.setAttribute('ALT', 'Inevitableriseofthemachines.com logo');
          brandingImage.setAttribute('CLASS', 'machines-embed-image');

          var brandingLink = document.createElement('A');
          brandingLink.setAttribute('HREF', 'https://www.inevtiableriseofthemachines.com');
          brandingLink.setAttribute('CLASS', 'machines-embed-branding-link');

          brandingLink.appendChild(brandingImage);
          branding.appendChild(brandingLink);

          container.insertBefore(branding, headline);

          var blockquote = Array.prototype.slice.call(container.getElementsByTagName('BLOCKQUOTE'));
          blockquote.forEach(function (blockquote) {
            var styleBlockquote = document.createElement('blockquote');
            styleBlockquote.setAttribute('class', 'machines-embed-blockquote');
            styleBlockquote.innerText = blockquote.innerText;
            container.insertBefore(styleBlockquote, blockquote);
            blockquote.remove();
          });

          var paragraphs = Array.prototype.slice.call(container.getElementsByTagName('P'));
          paragraphs.forEach(function (paragraphs) {
            paragraphs.setAttribute('class', 'machines-embed-text');
          });

          var link = Array.prototype.slice.call(container.getElementsByTagName('A'));
          link.forEach(function (link) {
            if(!link.classList.contains('machines-embed-branding-link'))  {
              link.setAttribute('class', 'machines-embed-link');
            }
          });

          parent.insertBefore(container, entries);
          entries.remove();
      });
    },
    addStyleToHead: function () {
      var style = document.createElement('link');
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("type", "text/css");
        style.setAttribute("href", '/embed-css/irotm_embed_styles.css');
        // style.setAttribute("href", 'https://machines.firebaseapp.com/embed-css/irotm_embed_styles.css');
        document.head.appendChild(style);
    }
  };

  (function() {
      "use strict";
      remoteLoader.intialize();
    })();
