var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function (name, fn) {
  this.addEventListener(name, fn);
};

NodeList.prototype.__proto__ = Array.prototype; // eslint-disable-line

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
  this.forEach((elem) => {
    elem.on(name, fn);
  });
};


function gameSlider(wrapper) {
  var self = this;
  var gameMargin = 23.5;
  var resizeTimer;

  this.updateWidth = function() {
      return $("body").getBoundingClientRect().width;
  }

  this.getGameAmount = function() {
    var gameAmount; 
    if(self.windowWidth <= 830 ) {
      self.gameAmount = 4;
    } else {
      self.gameAmount = 6;
    }

    return gameAmount;
  }

  this.wrapper = wrapper;
  this.backButton = this.wrapper.querySelector('.game__move--left');
  this.forwardButton = this.wrapper.querySelector('.game__move--right');
  this.gameContainer = this.wrapper.querySelector('.game-container');
  this.games = Array.prototype.slice.call(this.wrapper.querySelectorAll(".game"));
  this.gameAmount = self.getGameAmount();
  
  this.updateGameLength = function() {
      return self.games[0].getBoundingClientRect().width + gameMargin;
  }
  
  this.getGameLength = function() {
      return self.gameLength * (self.gameAmount + 2);
  }

  this.getGutterMove = function(windowWidth, gamesLength) {
    return (windowWidth - gamesLength) / 2;
  }

  this.active = false;
  this.windowWidth = self.updateWidth();
  
  this.gameWidth = this.games[0].getBoundingClientRect().width;
  this.widthSpace =  this.windowWidth - (this.gameWidth*this.gameAmount);
  this.gutter = this.widthSpace - (this.widthSpace / 2);
  this.displayedGameWidth = this.gameWidth*this.gameAmount;
  this.containerDistance = this.displayedGameWidth - this.gutter;
  this.active = false;
  this.hoverTimer;
  this.nonHoverGames = [];
  this.gameSize = (100/self.gameAmount);
  this.gameLength = self.updateGameLength();
  this.gamesLength = self.getGameLength();
  this.gutterMove = self.getGutterMove(self.windowWidth, self.gamesLength);
  //self.gameContainer.style.transition= "all .25s ease";

  window.addEventListener('resize', function(e) {
    clearInterval(resizeTimer);
    resizeTimer = window.setTimeout(changeGameAmount, 250);
  });
  
  function changeGameAmount() {    
    self.gameAmount = self.getGameAmount();
    self.windowWidth = self.updateWidth();
    self.gameLength = self.updateGameLength();
    self.gamesLength = self.getGameLength();
    self.gutterMove = self.getGutterMove(self.windowWidth, self.gamesLength);
    console.log(`self.gutterMove: ${self.gutterMove}`)

    if(self.active) {
        self.gameContainer.style.transform= "translateX(" + self.gutterMove + "px)";
    }
  }

  this.addStopHover = function(ele) {
    if(ele.length) {
      ele.map((m) => m.classList.add('game__stopHover'))
    } else {
      ele.classList.add('game__stopHover')
    }
  }
  
  this.removeStopHover = function(ele) {
    if(ele.length) {
      ele.map((m) => {
        m.classList.remove('game__stopHover')
       });
    } else {
      ele.classList.remove('game__stopHover')
    }
  }
  
  
  this.expandGame = function(ele) {
    ele.target.classList.add('game__active');
  }
  
  this.contractGame = function(ele) {
    ele.target.classList.remove('game__active');
  }
    
  this.noneHoverElement = function() {
    if(!self.active) {
      return self.games[self.gameAmount];
    } else {
      return [self.games[0], self.games[self.gameAmount+1]];
    }
  }

  self.addStopHover(self.noneHoverElement());
    
  this.moveGameContainer = function(direction, e) {
    self.wrapper = e.target.offsetParent;
    self.gameContainer = self.wrapper.lastElementChild;
    self.gameContainer.style.transition= "all .5s ease";
   
    if(direction == 'moveRight') {
       if(!self.active) {
         e.target.previousElementSibling.style.display = "inline-block";
         self.active = !self.active;
         self.addGamesToBack(1);
         self.gameContainer.style.transform= "translateX(-"+ ((self.gameLength*(self.gameAmount-1)) - self.gutterMove) +"px)";
       } else {
          self.addGamesToBack(0);
          self.gameContainer.style.transform= "translateX(-" + ((self.gameLength*self.gameAmount) - self.gutterMove) + "px)";
       }      
    }
    
    if(direction == 'moveLeft') {
      self.addGamesToStart(0);
    }
    
    if(!self.active) {
      self.gutter = (self.windowWidth - self.gameWidth);
    } else {
      self.gutter = (self.windowWidth - self.gameWidth) / 2;
    }
  }
  
  self.wrapper.querySelectorAll(".game").addEventListener('mouseover', function(e) {
    hoverTimer = setTimeout(function() {
      self.expandGame(e);
    },250);
  });
  
  self.wrapper.querySelectorAll(".game").addEventListener('mouseleave', function(e) {
    clearTimeout(hoverTimer);
    if(e.target.classList.contains('game__active')) {
      self.contractGame(e);
    }
  });
    
  self.forwardButton.addEventListener('click', function(e) {
    self.removeStopHover(self.noneHoverElement());
    self.moveGameContainer('moveRight', e);
  });
  
  self.backButton.addEventListener('click', function(e) {
    self.removeStopHover(self.noneHoverElement());
    self.moveGameContainer('moveLeft', e);
  });

  this.addGamesToStart = function(number) {  
    for(var i = 0; i < (self.gameAmount); i++) {
      self.games.unshift(self.games[self.games.length-1]);
      self.games.pop();
    }

    self.addStopHover(self.noneHoverElement());
    
    for(i = self.gameAmount+number; i >= 0;  i--) {
      self.gameContainer.insertBefore(self.games[i], self.gameContainer.firstElementChild);
    }
    
    self.gameContainer.style.transition= "none";
    self.gameContainer.style.transform= "translateX(-" + ((self.gameLength*self.gameAmount) - self.gutterMove) + "px)";
    
    window.setTimeout(function() {
        console.log(`self.gutterMove: ${self.gutterMove}`)
      self.gameContainer.style.transition= "all .5s ease";
      self.gameContainer.style.transform= "translateX(" + (self.gutterMove) + "px)";
    },0); 
  }
  
  this.addGamesToBack = function(number) {
    window.setTimeout(function() {
      self.gameContainer.style.transition= "none";
      self.gameContainer.style.transform= "translateX("+ self.gutterMove +"px)";
      
      for(var i = 0; i < (self.gameAmount-number); i++) {
        self.games.push(self.games[0]);
        self.games.shift();
      }
      self.addStopHover(self.noneHoverElement());

      for(i = self.games.length - self.gameAmount-number; i < self.games.length;  i++) {
        self.gameContainer.appendChild(self.games[i])
      }
    },500);
  }
}

for(var i = 0; i < $$('.wrapper').length; i++) {
  var variableName = 'gameSlider'+i;
  variableName = new gameSlider($$('.wrapper')[i]);
}