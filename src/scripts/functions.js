//  this is a test

var pageFunctions = {
    intialize: function () {
      // console.log('works');
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
       };
    },
    initializeSinglePage: function () {
        var self=this;
        var container = document.querySelector(".flip-card");
        container.addEventListener("click", self.detectClick, false);
    },
    initializeBlogPage: function () {
        var self=this;
        viewportSize = window.innerHeight;
        self.detectScrollBlog(viewportSize);
    },
    initializeSearchPage: function() {
      var self=this;
      self.doSearchToo();
    },
    intializeSearch: function () {
      var self=this;
      self.getJSON();
      self.intializeSearchField();
    },
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
      navWrapper.classList.toggle('main-nav-wrapper--static');
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
  var array;
  var array = self.searchArray;
  var searchTerm = new RegExp('\\b' + userInput + '\\b','gi');
  array.forEach(logArrayElements);
  function logArrayElements (element) {
    var toArrayHead = element.title.split(' ');
    var toArrayBody = element.post.split(' ');
    var entryTextTruncate = self.handleResultText(toArrayBody, userInput, searchTerm, element.post);
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
doSearchToo: function() {
  var self=this;
  var arr = self.searchArrayToo;

  var search = new RegExp('\\b' + 'the' + '\\b', 'gi');

  var match = arr.filter(function(element) {
    if (search.test(element.title) || search.test(element.post)) {
    return element;
    }
  });


  var bar = match.forEach(function(element, i) {
      var post = match[i].post.toLowerCase().split(' ');
      var index = getIndex(post);
      var foo = getIndexToo(match[i].post, search)
      var truncated = truncatePost(match[i].post, index);
      // var highlightedPost = highlight(truncated, 'the');
      // var highlightedHead = highlight(match[i].title, 'the');
      // self.buildSearchResultsToo(highlightedHead, highlightedPost, match[i].link);
    });

  function getIndex(post) {
    var search = 'the'.split(' ');
    var matches = []
    post.forEach(function (el, i) {
      if (el === search[0] || el === search[search.length - 1]) {
        matches.push(i);
      }
    });
    return matches;
  }

  function getIndexToo(post) {
    // var post = "this is the thing that they want the"
    var foo = post.search(/the/gi);
    console.log('-----');
    console.log('foo', foo);
    console.log(post);
    console.log('-----');
  }


  function truncatePost(post, loc) {
    var postArray = post.split(' ');
    var truncateBeg = loc[0] - 20;
    var truncateEnd = loc[loc.length - 1] + 20;

    if (postArray.length > truncateEnd) {
      var postArray = postArray.slice(0, truncateEnd);
      postArray.push('&#8230');
    }
    if (truncateBeg > 0) {
      var postArray = postArray.slice(truncateBeg, postArray.length);
      postArray.unshift('&#8230');
    }
    else if (loc.length === 0) {
        var postArray = postArray.slice(0, 41);
        postArray.push('&#8230');
    }
    return postArray.join(' ');
  }

  function highlight(el, term) {
  var search = new RegExp('\\b' + term + '\\b', 'gi');
  var text = el.match(search);
  var highlight = el.replace(search, '<strong>' + text + '</strong>')
      return highlight;
  }
},
buildSearchResultsToo: function (head, text, link) {
  var self=this;


  var resultsWrapper = document.getElementById('results-wrapper-too');

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

    if (match != undefined && match.length === 1) {
      return array.join(' ').replace(text, "<strong>" + match[0] + '</strong>');
    }
    else if (match != undefined && match.length > 1) {
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
  var searchField = document.getElementById('search-field');
  var display = document.getElementById('results-count');
  display.innerHTML = '';
  var resultsContainer = document.getElementById('results-wrapper');
  var searchResults = Array.prototype.slice.call(document.getElementsByClassName('element-link'));
  searchResults.forEach(function (item) {
    resultsContainer.removeChild(item);
  });
  searchField.focus();
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
detectScrollIndex: function (viewportSize) {
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
          self.handleNavAnimate(position, viewportSize);
    }
    return position;
 },
 detectScrollBlog: function (viewportSize) {
    var self=this,
        position;
     document.onscroll = function() {
       var position = window.scrollY,
           header = document.getElementById('siteheader'),
           headerPosition = self.getHeaderPosition();

           self.handleReefer(position, headerPosition);
     }
     return position;
  },
detectClick: function (event) {
    var self=pageFunctions;
    var element = event.target || event.srcElement;
    if (element.classList.contains("btn-small") ) {
        var embedCode = element.parentElement;
        self.handleCopy(element, embedCode);
    }
    if (element.classList.contains("embed-code") ) {
        self.handleFormAutoSelect(element);
    }
    if (element.classList.contains("btn-large")) {
      self.handleCardFlip()
    }
 },
 handleHeaderImage: function (position, headerHeight) {
    var self=this;
    var target = document.getElementById('header-image'),
        active = target.classList.contains('header-image--active'),
        targetHead = document.getElementById('main-head'),
        secondaryHead = document.getElementById('secondary-head'),
        bodyText = document.getElementById('entry-wrapper'),
        header = document.getElementById('siteheader');


      if (position >= headerHeight * .5 && !active) {
        target.classList.add('header-image--active');
        targetHead.classList.add('main-head--active');
        secondaryHead.classList.add('secondary-head--active');
        bodyText.classList.add('entry-wrapper--active');
        header.classList.add('header-after--active');
      }
      if (position <= headerHeight * .5 && active) {
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

   if (placeholderPosition <= headerPosition && !headerActive) {
     header.classList.add('siteheader--active');
     placeholder.classList.add('siteheader-placeholder--active');
   }
    if (placeholderPosition >= headerPosition && headerActive) {
      header.classList.remove('siteheader--active');
      placeholder.classList.remove('siteheader-placeholder--active');
    }
 },
 handleReefer: function(position, headerPosition) {
   var self=this;
   var reefers = document.getElementById('reefers'),
       activeState = reefers.classList.contains('reefers-wrapper--active');

    if (position >= headerPosition * .8 && !activeState) {
      reefers.classList.add('reefers-wrapper--active');
    }
    if (position <= headerPosition * .8 && activeState) {
      reefers.classList.remove('reefers-wrapper--active');
      }
 },
 handleNavAnimate: function (position, headerPosition) {
   var self=this;
       var links =
       document.getElementById('main-nav-wrapper');
       var linksTest = links.classList.contains('main-nav-wrapper--animatible');
      var linksActive = links.classList.contains('main-nav-wrapper--active');

    if (!linksActive && linksTest && position >= headerPosition * .8) {
      links.classList.add('main-nav-wrapper--active');
      links.classList.add('main-nav-wrapper--trans');
      setTimeout(function(){
        links.classList.remove('main-nav-wrapper--trans');
      }, 850);
    }
    if (linksActive && linksTest && position <= headerPosition * .5) {
      links.classList.remove('main-nav-wrapper--active');
    }
 },
 handleCardFlip: function () {
  var self=this;
  var card = document.getElementsByClassName('flip-card')[0];
  var active = card.classList.contains('flip-card--active');
    if (active == false) {
      self.testCopy();
      card.classList.add('flip-card--active', 'flip-card--trans');
    }
    if (active == true) {
      card.classList.remove('flip-card--active')
      card.classList.add('flip-card--activeToo');
        setTimeout(function(){
          card.classList.remove('flip-card--trans', 'flip-card--activeToo');
        }, 750);
    }
 },
 testCopy: function () {
   var copyTest = document.queryCommandSupported('copy');
   if (copyTest) {
     document.getElementById('url-copy-button').classList.remove('btn-hide');
     document.getElementById('copy-button').classList.remove('btn-hide');
   }
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
  if (headerHeight) {
   return viewportSize - (viewportSize * .05) - headerHeight;
 }
 else {
  return viewportSize * .50;
}
 },
  searchArray: {},
   getJSON: function() {
     var self=this;
     console.log('getJSON');
     var promise = new Promise(function(resolve, reject) {
     var request = new XMLHttpRequest();
     var url = '/site-feed.json';
     request.open('GET', url);
     request.send();
     request.onload = function() {
       if (request.status == 200) {
         resolve(request.response);
       } else {
         reject(Error(request.statusText));
       }
     };
   });
   promise.then(function(data) {
     self.searchArray = JSON.parse(data);
   }, function(error) {
     console.log(error.message);
   });
 },
searchArrayToo: [
      {
      "title": "Witness the power of this fully armed and operational singing Robot",
      "post": "one Robots’ newest creation is a miniature Death Star with Mickey ears – for kids. Adults find it “terrifying”, but children are inexorably drawn to its shiny, black, unknowable visage.  John Brownlee writing for fastcodesign     “What makes Mickeyphon so fun for kids is that it actually incorporates  sounds they make into its songs. When Mickeyphon picks up a noise around it—a cough, a giggle,  sound of someone talking—it automatically records it, then uses it to replace a sample in  song.”   Perhaps it’s best they learn at an early age that Robots are always listening.  ",
      "link": "/2016/01/robotic-mickey.html",
      "id": "witness-the-power-o-01-16-16"
    },
      {
      "title": "Witness power of this fully armed and operational singing Robot",
      "post": "two The Robots’ newest the creation is a miniature Death Star with Mickey Mouse ears – for kids. Adults find it “terrifying”, but children are inexorably drawn to its shiny, black, unknowable visage.  John Brownlee writing for fastcodesign  “What makes Mickeyphon so fun for kids is that it actually incorporates the sounds they make into its songs. When Mickeyphon picks up a noise around it—a cough, a giggle, the sound of someone talking—it automatically records it, then uses it to replace a sample in the song.”   Perhaps it’s best they learn at an early age that The Robots are always listening.  ",
      "link": "/2016/01/robotic-mickey.html",
      "id": "witness-the-power-o-01-16-16"
    },
    {
    "title": "Witness power of this fully armed and operational singing Robot",
    "post": "three Robots’ newest creation is a miniature Death Star with Mickey ears – for kids. Adults find it “terrifying”, but children are inexorably drawn to its shiny, black, unknowable visage.  John Brownlee writing for fastcodesign  “What makes Mickeyphon so fun for kids is that it Actually Incorporates sounds they make into its songs. When Mickeyphon picks up a noise around it—a cough, a giggle, sound of someone talking—it automatically records it, then uses it to replace a sample in song.”   Perhaps it’s best they learn at an early age that Robots are always listening. thre",
    "link": "/2016/01/robotic-mickey.html",
    "id": "witness--power-o-01-16-16"
  }
]
};
