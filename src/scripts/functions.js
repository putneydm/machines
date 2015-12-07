//  this is a test

var pageFunctions = {
    intialize: function () {
      console.log('works');
      var self=this;
      this.intializeWatchers(); //listens for clicks
    },
    intializeWatchers: function () {
      var self=this,
          viewportSize = window.innerHeight;
      self.detectScroll(viewportSize);
    },
    initializeIndex: function () {
        var self=this;
        console.log('index');
        self.detectScroll();
    },
     detectScroll: function (viewportSize) {
       var self=this,
           position;
        document.onscroll = function() {
          var position = window.scrollY;
          self.testHeaderImage(position, viewportSize);
          var header = document.getElementById('siteheader');
          var placeholder = document.getElementById('siteheader-placeholder');
          var headerPosition = self.getHeaderPosition();
          var placeholderPosition = placeholder.getBoundingClientRect().top;

          self.handleHeader(position, headerPosition, placeholderPosition)
          self.handleReefer(position, headerPosition);
        }
        return position;
     },
     testHeaderImage: function (position, headerHeight) {
        var self=this;
        var target = document.getElementById('header-image');
        var targetHead = document.getElementById('main-head');
        var activeTest = target.classList.contains('header-image--active');
        var secondaryHead = document.getElementById('secondary-head');

          if (position >= headerHeight * .6 && activeTest === false) {
            target.classList.add('header-image--active');
            targetHead.classList.add('main-head--active');
            secondaryHead.classList.add('secondary-head--active');
          }
          if (position <= headerHeight * .6 && activeTest) {
            target.classList.remove('header-image--active');
            targetHead.classList.remove('main-head--active');
            secondaryHead.classList.remove('secondary-head--active');
          }
     },
     handleHeader: function (position, headerPosition, placeholderPosition) {
        var self=this;
        var header = document.getElementById('siteheader');
        var placeholder = document.getElementById('siteheader-placeholder');
        var headerActive = header.classList.contains('siteheader--active');

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

       var reefers = document.getElementById('reefers');
       var activeState = reefers.classList.contains('reefers-wrapper--active');
        if (position >= headerPosition * .8 && activeState === false) {
          reefers.classList.add('reefers-wrapper--active')
        }
        if (position <= headerPosition * .8 && activeState === true) {
          reefers.classList.remove('reefers-wrapper--active')
        }
     },
     getHeaderPosition: function () {
       var self=this;
       var viewportSize = window.innerHeight;
       var headerHeight = document.getElementById('siteheader').offsetHeight;

       return headerPos = viewportSize - (viewportSize * .05) - headerHeight;

     }
  };
