function Player() {
  this.x = 224;
  this.y = 224;
  this.width = 64;
  this.height = 64;
  this.speed = 5;
  this.acceleration = 0.5;
  this.vx = 0;
  this.vy = 0;
  this.ax = 0;
  this.ay = 0;
  this.slowDownX = false;
  this.slowDownY = false;
  this.lastDir = 0;
  this.color = color(0,100,255);

  this.update = function() {
    // Check for vx when slowDown is active
    if (this.slowDownX && Math.abs(this.vx) > .1) {
      if (this.vx > 0) {
        this.ax = -this.acceleration;
      }
      else {
        this.ax = this.acceleration;
      }
    }
    else {
      this.slowDownX = false;
      this.ax = 0;
    }

    // Check for vy when slowDown is active
    if (this.slowDownY && Math.abs(this.vy) > .1) {
      if (this.vy > 0) {
        this.ay = -this.acceleration;
      }
      else {
        this.ay = this.acceleration;
      }
    }
    else {
      this.slowDownY = false;
      this.ay = 0;
    }

    // Check for collision
    if (this.vx <= 0 && this.x <= 0) {
      this.vx = 0;
      this.x = 0;
    }
    else if (this.vx >= 0 && this.x+this.width >= width) {
      this.vx = 0;
      this.x = width-this.width;
    }
    if (this.vy <= 0 && this.y <= 0) {
      this.vy = 0;
      this.y = 0;
    }
    else if (this.vy >= 0 && this.y+this.height >= height) {
      this.vy = 0;
      this.y = height-this.height;
    }

    // Physics!
    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;

    // Draw Player
    fill(this.color);
    rect(this.x,this.y,this.width,this.height,5);
  }

  this.shoot = function() {
    var newLaser;
    if (this.lastDir == 0) { newLaser = new Laser(this.x+(this.width/2)-(LASERWIDTH/2),this.y-LASERHEIGHT,this.lastDir); }
    else if (this.lastDir == 1) { newLaser = new Laser(this.x+this.width,this.y+(this.height/2)-(LASERHEIGHT/2),this.lastDir); }
    else if (this.lastDir == 2) { newLaser = new Laser(this.x+(this.width/2)-LASERWIDTH/2,this.y+this.height,this.lastDir); }
    else if (this.lastDir == 3) { newLaser = new Laser(this.x-LASERHEIGHT,this.y+(this.height/2)-(LASERHEIGHT/2),this.lastDir); }

    lasers.push(newLaser);
  }
}

function Laser(x,y,dir) {
  this.x = x;
  this.y = y;
  this.width = 16;
  this.height = 32;
  this.dir = dir;
  this.speed = 10;
  this.vx = (dir%2 == 1) ? ((dir == 1) ? this.speed : -this.speed) : 0;
  this.vy = (dir%2 == 0) ? ((dir == 2) ? this.speed : -this.speed) : 0;

  this.update = function() {
    if (this.dir%2 == 1) {
      if (this.x < -LASERWIDTH) {
        this.x = width;
      }
      else if (this.x > width) {
        this.x = -LASERWIDTH;
      }
    }
    else {
      if (this.y < -LASERHEIGHT) {
        this.y = height;
      }
      else if (this.y > height) {
        this.y = -LASERHEIGHT;
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    fill(255,0,0);
    (this.dir%2 == 0) ? rect(this.x,this.y,LASERWIDTH,LASERHEIGHT) : rect(this.x,this.y,LASERHEIGHT,LASERWIDTH);

    if (isColliding(this,player)) {
      lasers = [];
    }
  }
}

// Constants-- just for reference
var D_UP = 0;
var D_RIGHT = 1;
var D_DOWN = 2;
var D_LEFT = 3;

var LASERWIDTH = 16;
var LASERHEIGHT = 32;

// Variables
var player;
var lasers;
var highScore = 0;
var percentFilled = 0;
var randomR = randomInt(0,255);
var randomRInc = true;
var randomG = randomInt(0,255);
var randomGInc = true;
var randomB = randomInt(0,255);
var randomBInc = true;

function setup() {
  createCanvas(512,512);
  player = new Player();
  lasers = [];
}

function draw() {
  background(255);
  player.update();
  for (var i=0; i<lasers.length; i++) {
    lasers[i].update();
  }
  updateNumLasers();

  if (randomR >= 255) { randomRInc = false; }
  if (randomG >= 255) { randomGInc = false; }
  if (randomB >= 255) { randomBInc = false; }

  if (randomR <= 0) { randomRInc = true; }
  if (randomG <= 0) { randomGInc = true; }
  if (randomB <= 0) { randomBInc = true; }

  if (randomRInc && randomR < 255) { randomR++; }
  else if (!randomRInc && randomR > 0) { randomR--; }

  if (randomGInc && randomG < 255) { randomG++; }
  else if (!randomGInc && randomG > 0) { randomG--; }

  if (randomBInc && randomB < 255) { randomB++; }
  else if (!randomBInc && randomB > 0) { randomB--; }
}

function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    player.vx = -player.speed;
    player.slowDownX = 0;
    player.ax = 0;
    player.lastDir = 3;
  }
  else if (keyCode == RIGHT_ARROW) {
    player.vx = player.speed;
    player.slowDownX = 0;
    player.ax = 0;
    player.lastDir = 1;
  }
  else if (keyCode == UP_ARROW) {
    player.vy = -player.speed;
    player.slowDownY = 0;
    player.ay = 0;
    player.lastDir = 0;
  }
  else if (keyCode == DOWN_ARROW) {
    player.vy = player.speed;
    player.slowDownY = 0;
    player.ay = 0;
    player.lastDir = 2;
  }
  else if (key == ' ') {
    player.shoot();
  }
}

function keyReleased() {
  if ((keyCode == LEFT_ARROW && !keyIsDown(RIGHT_ARROW)) || (keyCode == RIGHT_ARROW && !keyIsDown(LEFT_ARROW))) {
    player.slowDownX = true;
  }
  else if ((keyCode == UP_ARROW && !keyIsDown(DOWN_ARROW)) || (keyCode == DOWN_ARROW && !keyIsDown(UP_ARROW))) {
    player.slowDownY = true;
  }

  if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW || keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
    if (keyIsDown(LEFT_ARROW)) { player.lastDir = 3; }
    if (keyIsDown(RIGHT_ARROW)) { player.lastDir = 1; }
    if (keyIsDown(UP_ARROW)) { player.lastDir = 0; }
    if (keyIsDown(DOWN_ARROW)) { player.lastDir = 2; }
  }
}

function randomInt(l,h) {
  return Math.round(Math.random()*(h-l))+l
}

function updateNumLasers() {
  if (lasers.length > highScore) {
    highScore = lasers.length;
    percentFilled = Math.floor((100*lasers.length*LASERWIDTH*LASERHEIGHT)/((512*512)-(64*64)));

    if (highScore == 5) {
      player.color = color(0,0,255);
    }
    else if (highScore == 10) {
      player.color = color(0,50,255);
    }
    else if (highScore == 15) {
      player.color = color(0,100,255);
    }
    else if (highScore == 20) {
      player.color = color(0,150,255);
    }
    else if (highScore == 25) {
      player.color = color(0,200,255);
    }
    else if (highScore == 30) {
      player.color = color(0,255,255);
    }
    else if (highScore == 35) {
      player.color = color(50,255,200);
    }
    else if (highScore == 40) {
      player.color = color(100,255,150);
    }
    else if (highScore == 45) {
      player.color = color(150,255,100);
    }
    else if (highScore == 50) {
      player.color = color(200,255,50);
    }
    else if (highScore == 55) {
      player.color = color(255,255,0);
    }
    else if (highScore == 60) {
      player.color = color(255,200,0);
    }
    else if (highScore == 65) {
      player.color = color(255,150,0);
    }
    else if (highScore == 70) {
      player.color = color(255,100,0);
    }
    else if (highScore == 75) {
      player.color = color(255,50,0);
    }
    else if (highScore == 80) {
      player.color = color(255,0,0);
    }
    else if (highScore == 85) {
      player.color = color(200,0,0);
    }
    else if (highScore == 90) {
      player.color = color(150,0,0);
    }
    else if (highScore == 95) {
      player.color = color(75,0,0);
    }
    else if (highScore == 100) {
      player.color = color(0,0,0);
    }
  }

  if (highScore > 100) {
    player.color = randomColor();
  }

  fill(100);
  rect(5,5,50,50,5);
  rect(422,5,75,50,5);
  textFont("Courier New",32);
  textAlign(CENTER,CENTER);
  fill(255);
  text(highScore,30,30);
  text(percentFilled+"%",457,30);
}

function randomColor() {
  return color(randomR,randomG,randomB);
}

function isColliding(a,b) {
  return (a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height);
}
