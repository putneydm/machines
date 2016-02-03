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

      if (!self.searchArray) {
        self.intializeSearch();
      }
      searchButton.classList.toggle('main-nav--active');
      var body = document.getElementsByTagName('BODY');
      body[0].classList.toggle('no-scroll');
      searchWrapper.classList.toggle('search-wrapper--active');
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
    var excludeWord = self.testSearchInput(userInput);
    if (!excludeWord && userInput && userInput.length >2 ){
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
testSearchInput: function (userInput) {
  var self=this;
  var searchClean= userInput.replace(/[\'.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s+$/g,"");

  var searchTerm = new RegExp('\\b' + searchClean + '\\b','gi');
  var exclude = self.stopwordsArray;
  var test = exclude.some(function(el) {
    if (el.match(searchTerm)) {
      return true;
    };
  });
  return test;
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
  }
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
    var matchTerm = array.join(' ').match(text);
    if (matchTerm && matchTerm.length === 1) {
      return array.join(' ').replace(text, "<strong>" + matchTerm[0] + '</strong>');
    }
    else if (matchTerm && matchTerm.length > 1) {
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
    // searchArray: {},
    // stopwords: ["a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"],
  //    getJSON: function (url, arrayFoo) {
  //      var self=this;
  //      var promise = new Promise(function(resolve, reject) {
  //      var request = new XMLHttpRequest();
  //     //  var url = '/site-feed.json';
  //      request.open('GET', url);
  //      request.send();
  //      request.onload = function() {
  //        if (request.status == 200) {
  //          resolve(request.response);
  //        } else {
  //          reject(Error(request.statusText));
  //        }
  //      };
  //    });
  //    promise.then(function(data) {
  //      self.searchArray = JSON.parse(data);
  //    }, function(error) {
  //      console.log(error.message);
  //    });
  //  },
 getJSON: function (url) {
   var p = new Promise(function(resolve, reject) {
   var xmlhttp = new XMLHttpRequest();
  //  var url = '/site-feed.json';
   var fail = true;

   xmlhttp.open("GET", url);
   xmlhttp.send();

   xmlhttp.onload = function() {
       if (xmlhttp.readyState == 4 && xmlhttp.status == 200 && fail) {
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
