//  this is a test

var pageFunctions = {
    intialize: function () {
      console.log('works');
      var self=this;
      this.intializeWatchers(); //listens for clicks
    },
    intializeWatchers: function () {
      var self=this;
      console.log('watchers');


    },
    initializeIndex: function () {
        var self=this;
        viewportSize = window.innerHeight;
        self.detectScroll(viewportSize);
    },
    initializeSinglePage: function () {
        var self=this;
        // document.getElementById('share-button').addEventListener("click", function(){
        //     self.handleCardFlip();
        //     self.testCopy();
        // });
        // document.getElementById('cancel-button').addEventListener("click", function(){
        //     self.handleCardFlip()
        // });
        // var copyButton = document.getElementById('copy-button');
        // copyButton.addEventListener("click", function(){
        //   var embedCode = document.getElementById('embed-code');
        //   self.handleCopy(copyButton, embedCode);
        // });
        // var URLcopyButton = document.getElementById('url-copy-button');
        // URLcopyButton.addEventListener("click", function(){
        //   var URLembedCode = document.getElementById('url-embed-code');
        //   self.handleCopy(URLcopyButton, URLembedCode);
        // });
        // document.getElementById('url-embed-code').addEventListener('click', function (e) {
        //
        //     console.log('click');
        //     e = e;
        //
        //     e.target.select();
        //
        //     var foo = e.target;
        //
        //     console.log('foo', foo);
        //
        //
        // });


        var container = document.querySelector(".flip-card");

        container.addEventListener("click", self.detectClick, false);


    },
     detectScroll: function (viewportSize) {
       var self=this,
           position;
        document.onscroll = function() {
          var position = window.scrollY,
              header = document.getElementById('siteheader'),
              placeholder = document.getElementById('siteheader-placeholder'),
              headerPosition = self.getHeaderPosition(),
              placeholderPosition = placeholder.getBoundingClientRect().top;

          self.handleHeaderPinning(position, headerPosition, placeholderPosition)
          self.handleReefer(position, headerPosition);
          self.handleHeaderImage(position, viewportSize);
        }
        return position;
     },
     detectClick: function (event) {
            var self=pageFunctions;
            var element = event.target || event.srcElement;
            if (element.classList.contains("btn-small") ) {
                console.log(element.classList.contains("fake-btn"));
                var embedCode = element.parentElement;
                self.handleCopy(element, embedCode);
            }
            if (element.classList.contains("embed-code") ) {
              console.log(element);
                self.handleFormAutoSelect(element);
                // return true;
            }
            if (element.classList.contains("btn-large")) {
              console.log('show entry');
              self.handleCardFlip()
            }
     },
     handleHeaderImage: function (position, headerHeight) {
        var self=this;
        var target = document.getElementById('header-image'),
            activeTest = target.classList.contains('header-image--active'),
            targetHead = document.getElementById('main-head'),
            secondaryHead = document.getElementById('secondary-head'),
            bodyText = document.getElementById('entry-wrapper'),
            header = document.getElementById('siteheader');


          if (position >= headerHeight * .5 && activeTest === false) {
            target.classList.add('header-image--active');
            targetHead.classList.add('main-head--active');
            secondaryHead.classList.add('secondary-head--active');
            bodyText.classList.add('entry-wrapper--active');
            header.classList.add('header-after--active');
          }
          if (position <= headerHeight * .5 && activeTest) {
            target.classList.remove('header-image--active');
            targetHead.classList.remove('main-head--active');
            secondaryHead.classList.remove('secondary-head--active');
            bodyText.classList.remove('entry-wrapper--active');
            header.classList.remove('header-after--active');
          }
     },
     handleHeaderPinning: function (position, headerPosition, placeholderPosition) {
        var self=this;
        var header = document.getElementById('siteheader'),
            placeholder = document.getElementById('siteheader-placeholder'),
            headerActive = header.classList.contains('siteheader--active');

       if (placeholderPosition <= headerPosition && headerActive === false) {
         header.classList.add('siteheader--active');
         placeholder.classList.add('siteheader-placeholder--active');
       }
        if (placeholderPosition >= headerPosition && headerActive === true) {
          header.classList.remove('siteheader--active');
          placeholder.classList.remove('siteheader-placeholder--active');
        }
     },
     handleReefer: function(position, headerPosition) {
       var self=this;
       var reefers = document.getElementById('reefers'),
           activeState = reefers.classList.contains('reefers-wrapper--active');

        if (position >= headerPosition * .8 && activeState === false) {
          reefers.classList.add('reefers-wrapper--active')
        }
        if (position <= headerPosition * .8 && activeState === true) {
          reefers.classList.remove('reefers-wrapper--active')
        }
     },
     handleCardFlip: function () {
      var self=this;
      var card = document.getElementsByClassName('flip-card')[0];
      var active = card.classList.contains('flip-card--active');

        if (active == false) {
          self.testCopy();
          card.classList.add('flip-card--active', 'flip-card--trans');
          // card.classList.add('flip-card--trans');
        }
        if (active == true) {
          card.classList.remove('flip-card--active')
          card.classList.add('flip-card--activeToo');
            setTimeout(function(){
              card.classList.remove('flip-card--trans', 'flip-card--activeToo');
              // card.classList.remove('flip-card--activeToo');
            }, 700);
        }
     },
     testCopy: function () {
       document.getElementById('embed-code').select();
       if (!document.execCommand('copy') ) {
         document.getElementById('url-copy-button').classList.add('btn-hidden');
         document.getElementById('copy-button').classList.add('btn-hidden');
       }
       document.getElementById('embed-code').blur();
     },
     handleCopy: function(button, embedContainer) {
      var embedCode = embedContainer.querySelectorAll(".embed-code")[0];
      var inputActive = function(style) {
        embedContainer.classList.add('form-container--active', style);
         embedCode.blur();
         setTimeout(function(){
           embedContainer.classList.remove('form-container--active', style);
         }, 2100);
       };
       try {
         embedCode.select();
          var successful = document.execCommand('copy');
          successful ? inputActive('form-container--success') :inputActive('form-container--fail');
        } catch (err) {
            inputActive('form-container--fail');
        }
     },
     handleFormAutoSelect: function (el) {
       var self=pageFunctions;
       el.select();
     },
     getHeaderPosition: function () {
       var self=this;
       var viewportSize = window.innerHeight,
           headerHeight = document.getElementById('siteheader').offsetHeight;
       return headerPos = viewportSize - (viewportSize * .05) - headerHeight;
     }

  };
