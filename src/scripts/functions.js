//  this is a test

var pageFunctions = {
    intialize: function () {
      console.log('works');
      var self=this;
      this.intializeWatchers(); //listens for clicks
    },
    intializeWatchers: function () {
      var self=this;
      var searchButton = document.getElementById('search-button');
      searchButton.addEventListener('click', function (e) {
        e.preventDefault();
        self.handleSearchDisplay();
      });
    },
    initializeIndex: function () {
        var self=this;
        console.log('index');
        viewportSize = window.innerHeight;
        self.detectScrollIndex(viewportSize);
        self.setBackground();
    },
    setBackground: function () {
      var self=this;
      viewportSize = window.innerWidth;
      var header = document.getElementById('header-image');
      if (viewportSize && viewportSize > 800) {
        imageURL = '/siteart/robotsone.jpg';
      }
      else {
        imageURL = '/siteart/sm_robotsone.jpg';
      }
       var img = new Image();
       img.src = imageURL;
       img.onload = function(){
       header.style.backgroundImage = 'url('+imageURL+')';
       console.log('loaded');
       };
    },
    initializeSinglePage: function () {
        var self=this;
        var container = document.querySelector(".flip-card");

        container.addEventListener("click", self.detectClick, false);
    },
    initializeBlogPage: function () {
        var self=this;
        console.log('blog');
        viewportSize = window.innerHeight;
        self.detectScrollBlog(viewportSize);
    },
    intializeSearch: function () {
      var self=this;
      console.log('search');

      self.getJSON();

    intializeSearchField: function () {
      var self=this;
      var searchField = document.getElementById('search-field');
      var resultsContainer = document.getElementById('results-wrapper');
      self.handleSearchFieldClear();

      searchField.onkeydown = function() {
          self.handleKeyDown();
        };
      searchField.onkeyup = function () {
          self.handleKeyUp(searchField, resultsContainer);
      };
    },
    handleSearchDisplay: function () {
      var self=this;
      var searchButton = document.getElementById('search-button');
      var searchWrapper = document.getElementById('search-wrapper');
      var navWrapper = document.getElementById('main-nav-wrapper');

      if (!self.searchArray.length) {
        self.intializeSearch();
      }
      searchButton.classList.toggle('main-nav--active');
      var body = document.getElementsByTagName('BODY');
      body[0].classList.toggle('no-scroll');
      searchWrapper.classList.toggle('search-wrapper--active')
      if (searchWrapper.classList.contains('search-wrapper--active')) {
        self.clearSearchResults();
      }
      if (navWrapper.classList.contains('main-nav-wrapper--animatible')) {
        navWrapper.classList.toggle('main-nav-wrapper--static');
      }
    },
  handleKeyDown: function () {
    var self=this;
    var keyPress=event.keyCode? event.keyCode : event.charCode;
    if (keyPress === 27) {
      self.handleSearchDisplay();
    }
    self.clearSearchResults();
  },
  handleKeyUp: function(searchField, resultsContainer) {
    var self=this;
    console.log('keyup');
    var userInput = searchField.value;
    if (userInput && userInput.length >2 ){
      self.doSearch(userInput);
      self.quantifyResults();
      }
    self.handleSearchClearButton(userInput);
  },
  handleSearchFieldClear: function() {
    var self=this;
    var clear = document.getElementById('search-field-clear');
    clear.addEventListener('click', function () {
      var searchField = document.getElementById('search-field');
      self.clearSearchResults();
      searchField.value = '';
      searchField.focus();
    });
  },
  handleSearchClearButton: function (userInput) {
    var self=this;
    var clear =  document.getElementById('search-field-clear');
    var active = clear.classList.contains('search-field-clear--active');
    if (userInput.length >1 && !active) {
        clear.classList.add('search-field-clear--active');
      }
    if (userInput.length <1 && active) {
      clear.classList.remove('search-field-clear--active');
    }
  },
doSearch: function (userInput){
  var self=this;
  var array = self.searchArray;
  var searchTerm = new RegExp('\\b' + userInput + '\\b','gi');

  array.forEach(logArrayElements);

  function logArrayElements (element, index, array) {

    var toArrayHead = element.title.split(' ');
    var toArrayBody = element.post.split(' ');
    var entryTextTruncate = self.handleResultText(toArrayBody, userInput, searchTerm, element.post);

    // console.log(element.title);

    if (element.post.match(searchTerm) && element.title.match(searchTerm) ) {
      var entryHead = self.highlightSearchKeyword(toArrayHead, userInput);
      var entryText = self.highlightSearchKeyword(entryTextTruncate, userInput);
    }
    else if (element.title.match(searchTerm) && !element.post.match(searchTerm)) {
      var entryHead = self.highlightSearchKeyword(toArrayHead, userInput);
      var entryText = entryTextTruncate.join(' ');
    }
    else if (element.post.match(searchTerm) && !element.title.match(searchTerm) ) {
      var entryText = self.highlightSearchKeyword(entryTextTruncate, userInput);
      var entryHead = element.title;
    }
    if (entryHead) {
      self.buildSearchResults(entryHead, entryText, element.link);
    }
  };
},
findLocationOfMatch: function (rx, array) {
  var self=this;
  for (var i in array) {
    if (array[i].toString().match(rx)) {
      return i;
    }
  }
  return -1;
},
handleResultText: function (toArray, raw, text, element) {
  var self=this;
  var space = raw.match(/\s/g);
  // find the locatuon of search item
  if (space) {
    var multiWord = raw.split(' ');
    var multiWordFirstWord = new RegExp(multiWord[0],'gi');
    var matchLocation = (self.findLocationOfMatch(multiWordFirstWord, toArray)) * 1;
  }
  if (!space) {
    var matchLocation = (self.findLocationOfMatch(text,toArray)) * 1;
  }
  if (matchLocation > 13) {
    arrayTrim = matchLocation - 13;
    var toArray = toArray.slice(arrayTrim, toArray.length);
  }
  var multiMatch = (element.match(text));
  if (!multiMatch || multiMatch.length === 1) {
      var toArray = toArray.slice(0, 25);
  }
  return toArray;
},
highlightSearchKeyword:  function (array, term) {
  var self=this;
    var text = new RegExp('\\b' + term + '\\b','gi');
    var match = array.join(' ').match(text);

    if (match && match.length === 1) {
    return array.join(' ').replace(text, "<strong>" + match[0] + '</strong>');
    }
    else if (match && match.length > 1) {

      // array.forEach (function (el) {
      //   // var fooBar = array.indexOf(term);
      //   // console.log('location', fooBar, el);
      //   console.log(el);
      // });

      return array.join(' ').replace(text, "<strong>" + term + '</strong>');
    }
},
buildSearchResults: function (head, text, link) {
  var self=this;

  var resultsWrapper = document.getElementById('results-wrapper');

  var singleResultWrapper = document.createElement("DIV");
  singleResultWrapper.classList.add('search-result');

  var singleResultHed = document.createElement('H2');
  singleResultHed.classList.add("basic-header");
  singleResultHed.classList.add('basic-header-large');
  singleResultHed.innerHTML = head;

  var singleResultText = document.createElement('P');
  singleResultText.innerHTML = text;

  var singleResultLink = document.createElement('A');
  singleResultLink.setAttribute('HREF', link);
  singleResultLink.setAttribute('CLASS', 'element-link');

  singleResultWrapper.appendChild(singleResultHed);
  singleResultWrapper.appendChild(singleResultText);
  singleResultLink.appendChild(singleResultWrapper);
  resultsWrapper.appendChild(singleResultLink);

},
clearSearchResults: function () {
  var self=this;
  var display = document.getElementById('results-count');
  display.innerHTML = '';
  var resultsContainer = document.getElementById('results-wrapper');
  var searchResults = Array.prototype.slice.call(document.getElementsByClassName('element-link'));
  searchResults.forEach(function (item) {
    resultsContainer.removeChild(item);
  });
},
quantifyResults: function () {
  var self=this;
  var display = document.getElementById('results-count');
  var resultCount = document.getElementsByClassName('search-result').length;
  if (resultCount === 1) {
    display.innerHTML = "We found " + resultCount + "  entry";
  }
  else {
    display.innerHTML = "We found " + resultCount + " entries";
  }
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
           activeState = reefers.classList.contains('reefers-wrapper--active'),
           links = document.getElementById('main-nav-wrapper');

        if (position >= headerPosition * .8 && activeState === false) {
          reefers.classList.add('reefers-wrapper--active');
          links.classList.add('main-nav-wrapper--active');
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
     },
     searchArray: {},
     matchArray: [ ],
     getJSON: function () {
       var self=this;

       var xmlhttp = new XMLHttpRequest();
       var url = "/site-feed.json";

       xmlhttp.onreadystatechange = function() {
           if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
               var myArr = JSON.parse(xmlhttp.responseText);
              myFunc (myArr);
           }
       };
       xmlhttp.open("GET", url, true);
       xmlhttp.send();

       function myFunc(arr) {
         self.searchArray = arr;
       }
     }
  };
