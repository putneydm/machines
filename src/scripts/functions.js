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
    intializeSearch: function () {
      var self=this;
      var array = 'fooBar';
      var siteContentPromise = self.getJSON('/site-feed.json');
      siteContentPromise.then(function(siteContent) {
       self.searchArray = siteContent;
     })
     .catch(function(error) {
       console.log(error);
     });
      var stopwordsPromise =
      self.getJSON('/scripts/stopwords.json');
      stopwordsPromise.then(function(stopwords) {
      // console.log(stopwords);
      self.stopwordsArray = stopwords;
     })
      self.intializeSearchField();
      self.intializeSearchButton();
      self.handleSearchFieldClear();
    },
    intializeSearchField: function () {
      var self=this;
      var searchField = document.getElementById('search-field');
      var searchButton = document.getElementById('search-button');
      searchField.onkeydown = function() {
          console.log('keypress');
          self.handleKeyDown(searchField);
        };
      searchField.onkeyup = function () {
          self.handleKeyUp(searchField);
      };
    },
  intializeSearchButton: function() {
    var self=this;
    var searchButton = document.getElementById('search-btn');
    var searchField = document.getElementById('search-field');
    searchButton.addEventListener('click', function() {
      var userInput = searchField.value;
      if (userInput.length > 0) {
        self.doSearchToo(userInput);
      }
      return false;
    });
  },
  handleSearchDisplay: function () {
    var self=this;
    var searchButton = document.getElementById('search-button');
    var searchWrapper = document.getElementById('search-wrapper');
    var navWrapper = document.getElementById('main-nav-wrapper');

    if (!self.searchArray) {
      self.intializeSearch();
    }
    searchButton.classList.toggle('main-nav--active');
    var body = document.getElementsByTagName('BODY');
    body[0].classList.toggle('no-scroll');
    searchWrapper.classList.toggle('search-wrapper--active');
    if (searchWrapper.classList.contains('search-wrapper--active')) {
      self.clearSearchResults();
      self.handleFailMessage(false);
    }
    navWrapper.classList.toggle('main-nav-wrapper--static');
  },
  handleSearchDisplayTransition: function(state) {
    var self=this;
    var resultsWrapper = document.getElementById('results-wrapper');
    state
    ? resultsWrapper.classList.add('results-wrapper--active')
    : resultsWrapper.classList.remove('results-wrapper--active');
  },
  handleKeyDown: function (searchField) {
    var self=this;
    var userInput = searchField.value;
    var keyPress=event.keyCode
    ? event.keyCode
    : event.charCode;
    if (keyPress === 27) {
      self.handleSearchDisplay();
    }
    if (keyPress === 13 && userInput.length > 0) {
      self.clearSearchResults();
      self.doSearchToo(userInput);
      self.testSearchInput(userInput);
    }

  },
  handleKeyUp: function(searchField, resultsContainer) {
    var self=this;
    var userInput = searchField.value;
    // var excludeWord = self.testSearchInput(userInput);
    if (userInput.length === 0 ){
      self.clearSearchResults();
      self.handleFailMessage(false);
    }
    self.handleSearchClearButton();
  },
  handleSearchFieldClear: function() {
    var self=this;
    var clear = document.getElementById('search-field-clear');
    clear.addEventListener('click', function () {
      var searchField = document.getElementById('search-field');
      self.clearSearchResults();
      self.handleFailMessage(false);
      searchField.value = '';
      searchField.focus();
    });
  },
  handleSearchClearButton: function () {
    var self=this;
    var searchField = document.getElementById('search-field');
    var userInput = searchField.value;
    var clear =  document.getElementById('search-field-clear');
    var active = clear.classList.contains('search-field-clear--active');
    if (userInput.length >1 && !active) {
        clear.classList.add('search-field-clear--active');
      }
    if (userInput.length <1 && active) {
      clear.classList.remove('search-field-clear--active');
    }
  },
testSearchInput: function (userInput) {
  var self=this;
  var searchClean= userInput.replace(/[\'.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s+$/g,"");

  var spaces = function foo(userInput) {
    if (userInput.match(!/\w+/) || userInput.match(/[[:punct:]]/gi)) {
      return true;
    };
  }
  if (userInput.length === 0 || spaces(userInput)) {
    var test = true;
  } else {
  var test = self.stopwordsArray.some(function(el) {
    if (el.match('\\b' + searchClean + '\\b','gi')) {
      return true;
    };
  });
}
return test;
},
doSearchToo: function(userInput) {
  var self=this;
  var arr = self.searchArray;

  var searchInValid = self.testSearchInput(userInput);

  console.log('search value', searchInValid);

  if (searchInValid) {
    console.log('please narrow your search');
    self.handleFailMessage(true);
  } else {

// begin else
  var searchClean = userInput.replace(/\s{2,}/,' ').replace(/\s{1,}$/,'');
  var searchTerm = new RegExp('\\b' + searchClean + '\\b','gi');

  var matches = []

  var matchedEntries = arr.filter(function(el) {
    if (searchTerm.test(el.post) || searchTerm.test(el.title)) {
      return true;
    } else {
      return false;
    }
  });

  console.log('matchedEntries', matchedEntries);

  // find out how each item that matches ranks and rank them by how many matches they have
  if (matchedEntries.length > 0) { // begin inside if
  matchedEntries.forEach(function (el, i) {
      var bar = el.post.match(searchTerm);
      var foo = el.title.match(searchTerm);

      var resultsArr = new Object();
        resultsArr.index = i;

      if (!bar && foo) {
          resultsArr.count = foo.length;
      } else if (bar && !foo) {
          resultsArr.count = bar.length;
      } else if (bar && foo) {
          resultsArr.count = foo.concat(bar).length;
      }
      matches.push(resultsArr);
    });

    var matchesSort = matches.sort(function(a, b){
      return b.count-a.count
    })

    // resort each subsection of the rank so that they are in proper index order

    // set start
    var counter = 0;
    var begin = matchesSort[0].count;
    var sortedEntries = [];

    while (begin > 0) {
      // give me an array of everything with a count that matches the current count.
      var indexSort = matchesSort.filter(function(el) {
        if (el.count === begin) {
          return true;
        }
      })
      // sorts subset by index -- chained to preceding function
      .sort(function(a, b){
        return a.index-b.index;
      })
      //  push to sortedEntries array
      var sortedEntries = sortedEntries.length ?  sortedEntries.concat(indexSort) : indexSort;

      // deincrement counter
      begin --;
      };
    } // end inside if
    else {
      console.log('no result');
      self.handleFailMessage(true, 'notFound')
    }

      //
      self.buildSearchResultsToo(matchedEntries, sortedEntries);
      self.quantifyResultsToo(matchedEntries.length, userInput);

    } // end else
},
// doSearch: function (userInput){
//   var self=this;
//   var array;
//   var array = self.searchArray;
//   var searchTerm = new RegExp('\\b' + userInput + '\\b','gi');
//   array.forEach(logArrayElements);
//   function logArrayElements (element) {
//     var toArrayHead = element.title.split(' ');
//     var toArrayBody = element.post.split(' ');
//     var entryTextTruncate = self.handleResultText(toArrayBody, userInput, searchTerm, element.post);
//     if (element.post.match(searchTerm) && element.title.match(searchTerm) ) {
//       var entryHead = self.highlightSearchKeyword(toArrayHead, userInput);
//       var entryText = self.highlightSearchKeyword(entryTextTruncate, userInput);
//     }
//     else if (element.title.match(searchTerm) && !element.post.match(searchTerm)) {
//       var entryHead = self.highlightSearchKeyword(toArrayHead, userInput);
//       var entryText = entryTextTruncate.join(' ');
//     }
//     else if (element.post.match(searchTerm) && !element.title.match(searchTerm) ) {
//       var entryText = self.highlightSearchKeyword(entryTextTruncate, userInput);
//       var entryHead = element.title;
//     }
//     if (entryHead) {
//       self.buildSearchResults(entryHead, entryText, element.link);
//     }
//   }
// },
// findLocationOfMatch: function (rx, array) {
//   var self=this;
//   for (var i in array) {
//     if (array[i].toString().match(rx)) {
//       return i;
//     }
//   }
//   return -1;
// },
// handleResultText: function (toArray, raw, text, element) {
//   var self=this;
//   var space = raw.match(/\s/g);
//   // find the locatuon of search item
//   if (space) {
//     var multiWord = raw.split(' ');
//     var multiWordFirstWord = new RegExp(multiWord[0],'gi');
//     var matchLocation = (self.findLocationOfMatch(multiWordFirstWord, toArray)) * 1;
//   }
//   if (!space) {
//     var matchLocation = (self.findLocationOfMatch(text,toArray)) * 1;
//   }
//   if (matchLocation > 13) {
//     arrayTrim = matchLocation - 13;
//     var toArray = toArray.slice(arrayTrim, toArray.length);
//   }
//   var multiMatch = (element.match(text));
//   if (!multiMatch || multiMatch.length === 1) {
//       var toArray = toArray.slice(0, 25);
//   }
//   return toArray;
// },
// highlightSearchKeyword:  function (array, term) {
//   var self=this;
//     var text = new RegExp('\\b' + term + '\\b','gi');
//     var matchTerm = array.join(' ').match(text);
//     if (matchTerm && matchTerm.length === 1) {
//       return array.join(' ').replace(text, "<strong>" + matchTerm[0] + '</strong>');
//     }
//     else if (matchTerm && matchTerm.length > 1) {
//       return array.join(' ').replace(text, "<strong>" + term + '</strong>');
//     }
// },
handleFailMessage: function(activeState, type) {
  var self=this;
  var failDisplay = document.getElementById('search-fail');
  activeState
  ? failDisplay.classList.add('search-fail--active')
  : failDisplay.classList.remove('search-fail--active');

  var failMessage = (type === 'notFound')
  ? 'Didn\'t find anything!'
  : 'Try narrowing your search';

  var failMesageDisplay = document.getElementById('search-message');
  failMesageDisplay.innerHTML = failMessage;
},
buildSearchResultsToo: function(matchedEntries, sortedEntries, resultsWrapper) {
  var self=this;

  var resultsWrapper = document.getElementById('results-wrapper')
  sortedEntries.forEach(function (el, i) {
    var entryNumber = sortedEntries[i].index;
    var entryHead = matchedEntries[entryNumber].title;
    var entryLink = matchedEntries[entryNumber].link;
    var entryRank = sortedEntries[i].count;

    var post = matchedEntries[entryNumber].post;

    var entryBody = post.length >= 50
    ? self.truncateText(post, 25)
    : false

    entryMarkup (entryHead, entryLink, entryRank, entryBody);
  });

  function entryMarkup (entryHead, entryLink, entryRank, entryBody) {

    var arrow = "<svg class=\"inline-icn\"><use xmlns:xlink=\"http:\/\/www.w3.org/1999/xlink\" xlink:href=\"#arrow\"></use></svg>"


    var singleResultWrapper = document.createElement("DIV");
    singleResultWrapper.classList.add('search-result');

    var singleResultLink = document.createElement('A');
    singleResultLink.setAttribute('HREF', entryLink);
    singleResultLink.classList.add("element-link");

    var singleResultHed = document.createElement('H2');
    singleResultHed.classList.add("basic-header", 'basic-header-large');
    singleResultHed.innerHTML = entryHead;

    if (entryBody) {
      var singleResultBody = document.createElement('P');
      singleResultBody.innerHTML = entryBody + arrow;
    }

    var singleResultCounter = document.createElement('P');
    singleResultCounter.classList.add("overline");
    singleResultCounter.innerHTML = entryRank > 1
    ? '<em>' + entryRank + ' matches in entry </em>'
    : '<em>' + entryRank + ' match in entry </em>'

    singleResultWrapper.appendChild(singleResultCounter);
    singleResultWrapper.appendChild(singleResultHed);
    if (entryBody) {
      singleResultWrapper.appendChild(singleResultBody)
    }
    singleResultLink.appendChild(singleResultWrapper);
    resultsWrapper.appendChild(singleResultLink);

    resultsWrapper.appendChild(singleResultLink);

  };
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
  // resultsWrapper.appendChild(singleResultLink);
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
quantifyResultsToo: function (length, userInput) {
  var self=this;
  var countContainer =  document.getElementById('results-count');

  countContainer.innerHTML = length !== 1
  ? "We found " + length + " entries with  \"" + userInput + "\""
  : "We found " + length + " entry with \"" + userInput + "\"";

},
truncateText: function(text, length) {
  var self=this;
  var textTruncate = text.split(' ').splice(0, length).join(' ') + ' &#8230;';

  return textTruncate;
},
// quantifyResults: function () {
//   var self=this;
//   var display = document.getElementById('results-count');
//   var resultCount = document.getElementsByClassName('search-result').length;
//   if (resultCount === 1) {
//     display.innerHTML = "We found " + resultCount + "  entry";
//   }
//   else {
//     display.innerHTML = "We found " + resultCount + " entries";
//   }
// },
detectScrollIndex: function (viewportSize) {
   var self=this,
       position;
    document.onscroll = function() {
      var position = window.scrollY,
          header = document.getElementById('siteheader'),
          placeholder = document.getElementById('siteheader-placeholder'),
          headerPosition = self.getHeaderPosition(),
          placeholderPosition = placeholder.getBoundingClientRect().top;

          self.handleHeaderPinning(position, headerPosition, placeholderPosition);
          self.handleReefer(position, headerPosition);
          self.handleHeaderImage(position, viewportSize);
          self.handleNavAnimate(position, viewportSize);
    };
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
     };
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
              self.handleCardFlip();
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


          if (position >= headerHeight * 0.5 && !active) {
            target.classList.add('header-image--active');
            targetHead.classList.add('main-head--active');
            secondaryHead.classList.add('secondary-head--active');
            bodyText.classList.add('entry-wrapper--active');
            header.classList.add('header-after--active');
          }
          if (position <= headerHeight * 0.5 && active) {
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

        if (position >= headerPosition * 0.8 && !activeState) {
          reefers.classList.add('reefers-wrapper--active');
        }
        if (position <= headerPosition * 0.8 && activeState) {
          reefers.classList.remove('reefers-wrapper--active');
          }
     },
     handleNavAnimate: function (position, headerPosition) {
       var self=this;
           var links =
           document.getElementById('main-nav-wrapper');
           var linksTest = links.classList.contains('main-nav-wrapper--animatible');
          var linksActive = links.classList.contains('main-nav-wrapper--active');

        if (!linksActive && linksTest && position >= headerPosition * 0.8) {
          links.classList.add('main-nav-wrapper--active');
          links.classList.add('main-nav-wrapper--trans');
          setTimeout(function(){
            links.classList.remove('main-nav-wrapper--trans');
          }, 850);
        }
        if (linksActive && linksTest && position <= headerPosition * 0.5) {
          links.classList.remove('main-nav-wrapper--active');
        }
     },
     handleCardFlip: function () {
      var self=this;
      var card = document.getElementsByClassName('flip-card')[0];
      var active = card.classList.contains('flip-card--active');
        if (!active) {
          self.testCopy();
          card.classList.add('flip-card--active', 'flip-card--trans');
        }
        if (active) {
          card.classList.remove('flip-card--active');
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
       return viewportSize - (viewportSize * 0.05) - headerHeight;
     }
     else {
      return viewportSize * 0.50;
    }
 },
 getJSON: function (url) {
   var p = new Promise(function(resolve, reject) {
   var xmlhttp = new XMLHttpRequest();
   xmlhttp.open("GET", url);
   xmlhttp.send();
   xmlhttp.onload = function() {
       if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         var myArr = JSON.parse(xmlhttp.responseText);
         resolve(myArr);
       } else {
         reject('fail');
       }
     };
     })
    return p;
 }
};
