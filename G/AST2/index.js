// Constants
var VERSION = "0.9";
var SCREEN_TITLE = 0;
var SCREEN_SHOP = 1;
var SCREEN_GAME = 2;
var SCREEN_GAMEOVER = 3;

// Variables
var screen = SCREEN_TITLE;

var pointerOnNewGame = true;
var shopChoice = 1;
var asteroidSpeed = 3;
var asteroidSlowdownCost = 35;
var rainbowAsteroidsActive = false;
var lastShotFrame = 0;
var sessionAsteroidsHit = 0;
var accuracy = 0;
var money = 0;
var points = 0;

// Src
var img_bg, img_bg2, img_player, img_playernofire, img_pointer, img_grass, img_shield, img_goldplayer, img_shieldpreview, img_asteroid, img_goldasteroid, img_rocketspeed, img_laserspeed, img_cloud, img_cloud2, img_instructions, img_boost, img_slowdown, img_widerlaser, img_firerate, img_rainbowasteroids, img_silver, img_gold, img_redasteroid, img_orangeasteroid, img_yellowasteroid, img_greenasteroid, img_aquaasteroid, img_blueasteroid, img_purpleasteroid;
var aud_mainMusic, aud_gameoverMusic;
var font_LCD;

// Arrays
var lasers = [];
var asteroids = [];
var allColors = [];
var shopImages = [];
var shopPrices = [];

// Objects
function Player() {
  this.width = 75;
  this.height = 109;
  this.x = 474.5;
  this.y = 457;
  this.vx = 0;
  this.speed = 8;
  this.img = img_player;
  this.shotSpeed = 8;
  this.fireRate = 10;
  this.lasersShot = 0;
  this.gold = false;

  // Shield object
  this.shield = {
    x: this.x,
    y: this.y,
    img: img_shield,
    active: false
  };

  // Update
  this.update = function() {
    // Player physics
    if (screen == SCREEN_GAME) {
      this.x += this.vx;

      this.shield.x = this.x-5;
      this.shield.y = this.y-5;

      // Player-wall collision detection
      if (this.x < 0) {
        this.x = 0;
      }
      if (this.x > 1800) {
        this.x = 1800;
      }

      // Player-asteroid collision detections
      for (var i=0; i<asteroids.length; i++) {
        if (collides(this.x,this.y,75,109,asteroids[i].x,asteroids[i].y,asteroids[i].size,asteroids[i].size)) {

          if (this.shield.active) {
            asteroids[i].x = randomAsteroidPosition();
            asteroids[i].y = -2*asteroids[i].size;
            this.shield.active = false;
            points+=100;
            if (rainbowAsteroidsActive) {
              asteroids[i].img = randomAsteroidColor();
            }
          }
          else {
            screen = SCREEN_GAMEOVER;
          }
        }
      }
    }

    // Laser color
    (player.gold) ? fill(254,232,37) : fill(255,0,0);

    // Drawing lasers
    for (var i=0; i<lasers.length; i++) {
      rect(lasers[i].x,lasers[i].y,10,30);
    }

    // Drawing player
    image(this.img,this.x,this.y);

    // Drawing shield if active
    if (this.shield.active) {
      image(this.shield.img,this.shield.x,this.shield.y);
    }
  }
}

function Asteroid() {
  this.x = randomAsteroidPosition();
  this.y = random(-80,25);
  this.size = 80;
  this.img = img_asteroid;
  this.gold = false;
  this.randomSpeedFactor = 0;

  this.update = function() {
    if (screen == SCREEN_GAME) {
      this.y += asteroidSpeed+this.randomSpeedFactor;
    }
    image(this.img,this.x,this.y);
  }
}

var rocket = {
  y: 385,
  move: false
};

var clouds = [
  {
    x: 100,
    img: undefined
  },
  {
    x: 700,
    img: undefined
  }
];

// For preloading images and audio
function preload() {
  // Images
  img_bg = loadImage("img/bg.png");
  img_bg2 = loadImage("img/space.png");
  img_player = loadImage("img/player.png");
  img_playernofire = loadImage("img/playernofire.png");
  img_pointer = loadImage("img/pointer.png");
  img_grass = loadImage("img/grass.png");
  img_shield = loadImage("img/shield.png");
  img_goldplayer = loadImage("img/playergold.png");
  img_asteroid = loadImage("img/asteroid.png");
  img_goldasteroid = loadImage("img/asteroidgold.png");
  img_laserspeed = loadImage("img/laserspeed.png");
  img_rocketspeed = loadImage("img/rocketspeed.png");
  img_firerate = loadImage("img/firerate.png");
  img_widerlaser = loadImage("img/widerlaser.png");
  img_shieldpreview = loadImage("img/shieldpreview.png");
  img_slowdown = loadImage("img/slowdown.png");
  img_boost = loadImage("img/boost.png");
  img_rainbowasteroids = loadImage("img/rainbowasteroids.png");
  img_silver = loadImage("img/silver.png");
  img_gold = loadImage("img/gold.png");
  img_cloud = loadImage("img/cloud.png");
  img_cloud2 = loadImage("img/cloud2.png");
  img_instructions = loadImage("img/instructions.png");
  img_redasteroid = loadImage("img/asteroidred.png");
  img_orangeasteroid = loadImage("img/asteroidorange.png");
  img_yellowasteroid = loadImage("img/asteroidyellow.png");
  img_greenasteroid = loadImage("img/asteroidgreen.png");
  img_aquaasteroid = loadImage("img/asteroidaqua.png");
  img_blueasteroid = loadImage("img/asteroidblue.png");
  img_purpleasteroid = loadImage("img/asteroidpurple.png");

  // Audio
  aud_mainMusic = loadSound("aud/main.mp3");
  aud_gameoverMusic = loadSound("aud/gameover.mp3");

  // Fonts
  font_LCD = loadFont("LCD_Solid.ttf");

  // Cookie data
  if (!(document.cookie.includes("totalEarnings="))) { document.cookie = "totalEarnings=0"; }
  if (!(document.cookie.includes("totalAsteroidsHit="))) { document.cookie = "totalAsteroidsHit=0"; }
  if (!(document.cookie.includes("totalLasersFired="))) { document.cookie = "totalLasersFired=0"; }
  if (!(document.cookie.includes("lifetimeAccuracy="))) { document.cookie = "lifetimeAccuracy=0"; }
}

// Setting up canvas size = loadImage("src/img/.png"); etc.
function setup() {
  createCanvas(1024,576);
  clouds[0].img = img_cloud;
  clouds[1].img = img_cloud2;
  player = new Player();
  allColors = [img_redasteroid, img_orangeasteroid, img_yellowasteroid, img_greenasteroid, img_aquaasteroid, img_blueasteroid, img_purpleasteroid];
  shopImages = [
    img_laserspeed,
    img_firerate,
    img_widerlaser,
    img_rocketspeed,
    img_boost,
    img_shieldpreview,
    img_slowdown,
    img_rainbowasteroids,
    img_silver,
    img_gold
  ];
  shopPrices = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10
  ];
  asteroids.push(new Asteroid());
  asteroids.push(new Asteroid());
}

function draw(){
  background(0);

  if (screen == SCREEN_TITLE) {
    image(img_bg,0,0,1024,576);
    image(img_instructions,256,448);

    // Change rocket animation on rocket.move
    (rocket.move) ? image(img_player,10,rocket.y) : image(img_playernofire,10,rocket.y);

    // Draw clouds
    image(clouds[0].img, clouds[0].x, 50);
    image(clouds[1].img, clouds[1].x, 50);

    // Cloud(s) rollover
    if (clouds[0].x >= width) {
      clouds[0].x = -140;
    }
    if (clouds[1].x >= width) {
      clouds[1].x = -140;
    }

    // Move clouds
    clouds[0].x+=.25;
    clouds[1].x+=.25;

    // Font settings
    fill(0);
    textFont(font_LCD);
    textSize(42);
    textAlign(CENTER,CENTER);

    // Pointer
    var pointerY = (pointerOnNewGame) ? 243 : 303;
    image(img_pointer,275,pointerY);

    // New game option
    text("New game",512,258);

    // New game option
    text("Shop",512,318);

    // Version
    textAlign(RIGHT,TOP);
    fill(255);
    textSize(32);
    text("v."+VERSION,1014,10);

    // If rocket is moving
    if (rocket.move) {
      if (rocket.y > -109) {
        rocket.y -= 8;
      }
      else {
        rocket.move = false;
        screen = SCREEN_GAME;
      }
    }
  }
  else if (screen == SCREEN_GAME) {
    image(img_bg2,0,0);

    // Updating asteroids
    for (var i=0; i<asteroids.length; i++) {
      asteroids[i].update();
    }

    // Other asteroids updates
    for(var i=0; i<lasers.length; i++){
      if(lasers[i].y > -60){
        lasers[i].y -= player.shotSpeed;

        // Laser-asteroid collision detection
        for (var j=0; j<asteroids.length; j++) {
          if (collides(lasers[i].x,lasers[i].y,10,30, asteroids[j].x,asteroids[j].y,asteroids[j].size,asteroids[j].size)) {
            asteroids[j].x = randomAsteroidPosition();
            asteroids[j].y = -2*asteroids[j].size;
            asteroids[j].randomSpeedFactor = random(-1,1);
            asteroidSpeed+=.1;
            sessionAsteroidsHit++;

            // Check for golden asteroid
            if (asteroids[j].gold) {
              if (asteroids[j].y > 200) {
                money+=4;
              }
              else {
                money+=8;
              }
              asteroids[j].gold = false;
              asteroids[j].img = img_asteroid;
            }
            else {
              if (asteroids[j].y > 200) {
                money+=2;
              }
              else {
                money+=4;
              }
            }
            if (rainbowAsteroidsActive) {
              asteroids[j].img = randomAsteroidColor();
            }
            if (Math.random()<=.03) {
              asteroids[j].gold = true;
              asteroids[j].img = img_goldasteroid;
            }

            // Set points
            setPoints();

            // Remove the laser
            lasers.splice(i,1);
            break;
          }
        }
      }
      else if (lasers[i].y <= -60) {
        lasers.splice(i,1);
      }
    }

    //Asteroids go off screen
    for (var i=0; i<asteroids.length; i++) {
      if (asteroids[i].y > 576) {
        asteroids[i].y = -2*asteroids[i].size;
        asteroids[i].x = randomAsteroidPosition();
        asteroids[i].randomSpeedFactor = random(-1,1);
        asteroidSpeed+=.2;
        money++;
        if (rainbowAsteroidsActive) {
          asteroids[i].img = randomAsteroidColor();
        }
        if (asteroids[i].gold) {
          asteroids[i].gold = false;
          asteroids[i].img = img_asteroid;
        }

        // Set points
        setPoints();
      }
    }

    // Updating player
    player.update();

    // $ and point counters
    textSize(40);
    textAlign(RIGHT,TOP);
    fill(0,185,0);
    text('$'+money,width-10,10);
    textAlign(LEFT,TOP);
    fill(255);
    text(points,10,10);

    // Shop
    //   // Shop images
    //   image(img_laserspeedpreview,501,280);
    //   image(img_rocketspeedpreview,860,280);
    //   image(img_shieldpreview,1335,280);
    //   image(img_asteroidslowdownpreview,445,620);
    //   image(img_greenasteroid,885,620);
    //   image(img_goldplayer,1340,620);
    //
    //   // Shop labels
    //   textSize(32);
    //   fill(255);
    //   text("Laser speed +",520,250);
    //   text("Ship speed +",960,250);
    //   text("Shield",1400,250);
    //   text("Slow 'em down",520,590);
    //   text("Rainbow asteroids",960,590);
    //   text("???",1400,590);
    //
    //   // Shop prices
    //   textSize(45);
    //   fill(10,152,17);
    //   text("$5",520,490);
    //   text("$10",960,490);
    //   text("$20",1400,490);
    //   text('$'+asteroidSlowdownCost.toString(),520,830);
    //   text("$250",960,830);
    //   text("$1000",1400,830);
    // }
  }
  else if (screen == SCREEN_GAMEOVER) {
    textSize(80);
    textAlign(CENTER,CENTER);
    fill(187,0,0);
    text("GAME OVER!",512,100);
    textSize(30);
    fill(255);
    text("[Press Enter to restart]",512,170);
    text("Lasers fired: "+player.lasersShot,512,250);
    text("Asteroids hit: "+sessionAsteroidsHit,512,300);
    text("Accuracy: "+Math.round(accuracy*100)+"%",512,350);
    text("Money earned: $"+money,512,400);
    textSize(80);
    text(points+" points",width/2,500);
  }
  else if (screen == SCREEN_SHOP) {
    background(53,158,81);
    textAlign(CENTER,CENTER);

    // Back button
    textSize(20);
    fill(255);
    text("[Press ESCAPE to return to main menu]",512,283);

    // Drawing shop boxes and Buy buttons
    textSize(30);
    for (var i=0; i<2; i++) {
      for (var j=0; j<5; j++) {
        // Outer boxes
        fill(29,135,57);
        rect(14+(202*j),14+(298*i),188,188);

        // Price boxes
        (mouseX > 14+(202*j) && mouseX < 202+(202*j) && mouseY > 217+(298*i) && mouseY < 264+(298*i)) ? fill(0,75,0) : fill(9,107,35);
        rect(14+(202*j),217+(298*i),188,47);

        // Price text
        fill(255);
        text("$"+shopPrices[j+(i*5)],108+(202*j),240.5+(298*i));

        // Images
        image(shopImages[j+(i*5)],18.5+(202*j),78+(298*i));
      }
    }
  }
}

function shoot(){
  lasers.push({
    x: player.x+32.5,
    y: player.y-40
  });

  player.lasersShot++;
}

// Returns a random X-position for an asteroid
function randomAsteroidPosition(){
  return random(0,944);
}

// Returns a random color for the rainbow asteroid shoption
function randomAsteroidColor(){
  return random(allColors);
}

function keyPressed(){
  if (key == 'F') {
    fullscreen(!fullscreen());
  }
  if (screen == SCREEN_TITLE) {
    switch (keyCode) {
      case ENTER:
        (pointerOnNewGame) ? rocket.move = true : screen = SCREEN_SHOP;
        break;
      case DOWN_ARROW:
      case UP_ARROW:
        pointerOnNewGame = !pointerOnNewGame;
        break;
      default:
        //
    }
  }
  else if (screen == SCREEN_GAME) {
    // Move right
    if (keyCode == RIGHT_ARROW) {
      player.vx = player.speed;
    }

    // Move left
    if (keyCode == LEFT_ARROW) {
      player.vx = -player.speed;
    }

    // Shoot
    if (key == ' ' && frameCount - lastShotFrame > player.fireRate) {
      shoot();
      lastShotFrame = frameCount;
    }

    // Shop
    // if (shopOpen) {
    //   // Moving
    //   if ((keyCode == RIGHT_ARROW) && shopChoice != 3 && shopChoice != 6) {
    //     shopChoice++;
    //   }
    //   if ((keyCode == LEFT_ARROW) && shopChoice != 1 && shopChoice != 4) {
    //     shopChoice--;
    //   }
    //   if ((keyCode == DOWN_ARROW) && shopChoice < 4) {
    //     shopChoice+=3;
    //   }
    //   if ((keyCode == UP_ARROW) && shopChoice > 3) {
    //     shopChoice-=3;
    //   }
    //
    //   //Buying
    //   if (keyCode == ENTER) {
    //     if (shopChoice == 1 && money >= 5) {
    //       player.shotSpeed+=2.5;
    //       money-=5;
    //     }
    //     if (shopChoice == 2 && money >= 10){
    //       player.speed+=2.5;
    //       money-=10;
    //     }
    //     if (shopChoice == 3 && money >= 20 && !player.shield.active){
    //       player.shield.active = true;
    //       money-=20;
    //     }
    //     if (shopChoice == 4 && money >= asteroidSlowdownCost && asteroidSpeed >= 10){
    //       asteroidSpeed/=2;
    //       money-=asteroidSlowdownCost;
    //       asteroidSlowdownCost+=5;
    //     }
    //     if (shopChoice == 5 && money >= 250 && !rainbowAsteroidsActive){
    //       for (var i=0; i<asteroids.length; i++) {
    //         asteroids[i].img = randomAsteroidColor();
    //       }
    //       rainbowAsteroidsActive = true;
    //       money-=250;
    //     }
    //     if (shopChoice == 6 && money >= 1000 && !player.gold){
    //       player.gold = true;
    //       player.img = img_goldplayer;
    //       money-=1000;
    //     }
    //   }
    // }
  }
  else if (screen == SCREEN_GAMEOVER) {
    if (keyCode == ENTER) {
      player = new Player();
      asteroids = [new Asteroid(), new Asteroid()];
      lasers = [];
      resetGameplayVariables();
      screen = SCREEN_GAME;
    }
  }
  else if (screen == SCREEN_SHOP) {
    if (keyCode == ESCAPE) {
      screen = SCREEN_TITLE;
    }
  }
}

function keyReleased() {
  if (screen == SCREEN_GAME){
    if ((keyCode == LEFT_ARROW && !keyIsDown(RIGHT_ARROW)) ^ (keyCode == RIGHT_ARROW && !keyIsDown(LEFT_ARROW))) {
      player.vx = 0;
    }
  }
}

function mouseMoved() {
  if (screen == SCREEN_TITLE && !rocket.move) {
    if (mouseX > 382 && mouseX < 632) {
      if (mouseY > 218 && mouseY < 278) {
        pointerOnNewGame = true;
      }
      else if (mouseY > 278 && mouseY < 348) {
        pointerOnNewGame = false;
      }
    }
  }
}

function mousePressed() {
  if (screen == SCREEN_TITLE && !rocket.move) {
    if (mouseX > 382 && mouseX < 632) {
      if (mouseY > 218 && mouseY < 278) {
        pointerOnNewGame = true;
        rocket.move = true;
      }
      else if (mouseY > 278 && mouseY < 348) {
        pointerOnNewGame = false;
        screen = SCREEN_SHOP;
      }
    }
  }
  else if (screen == SCREEN_SHOP) {
    var x = (width-100-(5*300))/4;
    var y = (height-100-(3*300))/2;

    var cookies = document.cookie.split(";");
    var earnings;

    for (var i=0; i<cookies.length; i++) {
      if (cookies[i].includes("totalEarnings=")) {

        earnings = parseInt(cookies[i].trim().slice(14));
        console.log(cookies[i]);
      }
    }

    for (var i=0; i<3; i++) {
      for (var j=0; j<5; j++) {
        if (mouseX > 125+(300+x)*j && mouseX < 275+(300+x)*j && mouseY > 275+(300+y)*i && mouseY < 325+(300+y)*i && earnings > shopPrices[j+(i*5)]) {
          earnings -= shopPrices[j+(i*5)];
          document.cookie = "totalEarnings="+earnings;
          console.log(document.cookie);
        }
      }
    }
  }
}

// Make a container div
function fixCanvasSize() {
  document.getElementById("gameContainer").append(document.getElementById("defaultCanvas0"));
}

// Reset gameplay variables
function resetGameplayVariables() {

  var cookies = document.cookie.split(";");

  // Update totalAsteroidsHit in Cookies
  for (var i=0; i<cookies.length; i++) {
    if (cookies[i].includes("totalAsteroidsHit=")) {
      var totalAsteroidsHit = parseInt(cookies[i].slice(19))+sessionAsteroidsHit;
      document.cookie = "totalAsteroidsHit="+totalAsteroidsHit;
      break;
    }
  }
  // Update totalEarnings in Cookies
  for (var i=0; i<cookies.length; i++) {
    if (cookies[i].includes("totalEarnings=")) {
      var totalEarnings = parseInt(cookies[i].slice(14))+money;
      document.cookie = "totalEarnings="+totalEarnings;
      break;
    }
  }

  money = 0;
  points = 0;
  accuracy = 0;
  sessionAsteroidsHit = 0;
  rainbowAsteroidsActive = false;
  asteroidSlowdownCost = 35;
  asteroidSpeed = 3;

}

// Check for collision detection
function collides(x1,y1,w1,h1,x2,y2,w2,h2) {
  return (x1+w1 > x2 && x1 < x2+w2 && y1+h1 > y2 && y1 < y2+h2) ? true : false;
}

// Set the points value
function setPoints() {
  accuracy = sessionAsteroidsHit/player.lasersShot;
  points = Math.round(100*accuracy*money);
}
