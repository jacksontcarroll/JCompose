// 'Entity' super
class Entity {
  constructor(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }
}

// Platform
class Platform extends Entity {
  constructor(x,y,w,h) {
    super(x,y,w,h);
  }
}

// Lava
class Lava extends Entity {
  constructor(x,y,w,h) {
    super(x,y,w,h);
  }
}

// Key
class Key extends Entity {
  constructor(x,y,w,h) {
    super(x,y,w,h);
  }
}

// Door
class Door extends Entity {
  constructor(x,y,w,h) {
    super(x,y,w,h);
  }
}

// Player
class Player extends Entity {
  constructor(x,y) {
    super(x,y,100,118);

    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.colliding = false;
    this.jumpLength = 0;
    this.key = false;
    this.img = img_pman;
  }

  update() {
    // Quickly slide to a stop
    if (!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) && Math.abs(this.vx) > 0) {
      this.ax = (this.vx > 0) ? -FRICTION : FRICTION;
    }
    else {
      this.ax = 0;
    }

    // Left wall collision
    if (this.x < 0) {
      this.x = 0;
    }

    // Right wall collision
    if (this.x+this.width > 1400) {
      this.x = 1400-this.width;
    }

    // Floor collision
    if (this.y+this.height > 900) {
      this.colliding = true;
      this.vy = 0;
      this.y = 900-this.height;
    }

    // Basic controls:
    // Platform collision testing
    var platformCollisionCount = 0;
    for (var i=0; i<entities.length; i++) {
      if (collides(this,entities[i])) {
        // Colliding with a platform
        if (entities[i] instanceof Platform) {
          // Touching the left wall (less than 10 pixels from left wall, in order for right wall collision to work)
          if (this.x+this.width > entities[i].x && this.x+this.width < entities[i].x+10) {
            this.x = entities[i].x-this.width;
          }
          // Touching the right wall (less than 10 pixels from right wall, in order for left wall collision to work)
          else if (this.x < entities[i].x+entities[i].width && this.x > entities[i].x+entities[i].width-10) {
            this.x = entities[i].x+entities[i].width;
          }
          // Touching the ceiling of the platform
          else if (this.y < entities[i].y+entities[i].height && this.y > entities[i].y+entities[i].height-20) {
            this.y = entities[i].y+entities[i].height;
            this.vy = -1;
          }
          // Touching the floor of the platform
          else if (!this.colliding && (this.x+this.width > entities[i].x+10) && (this.x < entities[i].x+entities[i].width-10) && (this.y+this.height > entities[i].y) && (this.y+this.height < entities[i].y+20)) {
            this.y = entities[i].y-this.height;
            this.vy = 0;
            this.colliding = true;
          }

          platformCollisionCount++;
        }
        else if (entities[i] instanceof Lava) {
          setLevel();
        }
        else if (entities[i] instanceof Key && !this.key) {
          this.key = true;
          entities.splice(i,1);
        }
        else if (entities[i] instanceof Door && this.key) {
          level++;
          setLevel();
        }
      }
    }

    // Falling off of a platform
    if (platformCollisionCount == 0 && this.y < 900-this.height && this.colliding) {
      this.colliding = false;
      this.vy = GRAVITY/2;
    }

    // Elongated jump (holding down 'space' for longer = a higher jump)
    if (keyIsDown(32) && frameCount-this.jumpLength < TOTAL_JUMP_FRAMES) {
      this.ay = 0;
    }
    else {
      // Don't let gravity pass TERMINAL_VELOCITY; acceleration = 0 if colliding
      this.ay = (!this.colliding && this.vy < TERMINAL_VELOCITY) ? GRAVITY : 0;
    }

    // Acceleration
    this.vx += this.ax;
    this.vy += this.ay;

    // Velocity
    this.x += this.vx;
    this.y += this.vy;

    image(this.img,this.x,this.y,this.width,this.height);
  }

  jump() {
    this.colliding = false;
    this.vy = -TERMINAL_VELOCITY;
    this.jumpLength = frameCount;
  }
}

// Objects
var player;
var entities = [];

// Constants
var TERMINAL_VELOCITY = 15;
var GRAVITY = 1;
var FRICTION = 0.75;
var TOTAL_JUMP_FRAMES = 20;
var KEY_WIDTH = 50;
var KEY_HEIGHT = 75;
var DOOR_WIDTH = 100;
var DOOR_HEIGHT = 130;
var SCREEN_TITLE = 0;
var SCREEN_LEVELSELECT = 1;
var SCREEN_GAME = 2;
var LEVELSCOMPLETED = 3;

// Variables
var screen = SCREEN_TITLE;
var level = 1;
var rdir = gdir = bdir = 1;
var r = Math.round(Math.random()*255);
var g = Math.round(Math.random()*255);
var b = Math.round(Math.random()*255);
var debug = true;

// Assets
var img_pman;

// Load assets
function preload() {
  img_pman = loadImage("img/Stand-in.png");
}

function setup() {
  //createCanvas(1024,576);
  createCanvas(1400,900);
}

function draw() {
  if (screen == SCREEN_TITLE) {
    background(0);

    if (r >= 240 && rdir == 1) { rdir = 0; }
    if (g >= 240 && gdir == 1) { gdir = 0; }
    if (b >= 240 && bdir == 1) { bdir = 0; }

    if (r <= 0 && rdir == 0) { rdir = 1; }
    if (g <= 0 && gdir == 0) { gdir = 1; }
    if (b <= 0 && bdir == 0) { bdir = 1; }

    r = (rdir == 1) ? r+1 : r-1;
    g = (gdir == 1) ? g+1 : g-1;
    b = (bdir == 1) ? b+1 : b-1;

    fill(r,g,b);
    noStroke();
    textFont("Arial",128);
    text("Potatoman",405,200);

    stroke(r-20,g-20,b-20);
    fill(r,g,b,(mouseX > 525 && mouseX < 875 && mouseY > 400 && mouseY < 550) ? 100 : 150);
    rect(525,400,350,150);
    fill(r,g,b,(mouseX > 525 && mouseX < 875 && mouseY > 600 && mouseY < 750) ? 100 : 150);
    rect(525,600,350,150);

    textFont("Arial",48);
    fill(255);
    noStroke();
    text("Play",655,490);
    text("Level select",580,690);
  }
  else if (screen == SCREEN_LEVELSELECT) {
    // Use levelsCompleted;
    background(100);
  }
  else if (screen == SCREEN_GAME) {
    background(255);
    player.update();

    // Draw entities
    stroke(0,0,0);
    for (var i=0; i<entities.length; i++) {
      if (entities[i] instanceof Platform) { noFill(); }
      else if (entities[i] instanceof Lava) { fill(255,0,0,100); }
      else if (entities[i] instanceof Key) { fill(255,255,0,100); }
      else if (entities[i] instanceof Door) { fill(0,0,0,100); }

      rect(entities[i].x,entities[i].y,entities[i].width,entities[i].height,2);
    }

    // Show level
    textFont("Arial",48);
    fill(0,0,0,100);
    noStroke();
    text("Level "+level,10,45);

    if (debug) {
      textFont("Arial",48);
      fill(0,0,0,150);
      text("x: "+player.x,10,110);
      text("y: "+player.y,10,155);
      text("vx: "+player.vx,10,200);
      text("vy: "+player.vy,10,245);
      text("ax: "+player.ax,10,290);
      text("ay: "+player.ay,10,335);
      text("colliding: "+player.colliding,10,380);
    }
  }
}

// Key pressed
function keyPressed() {
  // Fullscreen
  if (key == 'F') {
    fullscreen(!fullscreen());
  }

  if (screen == SCREEN_GAME) {
    if (key == ' ' && player.colliding) {
      player.jump();
    }
    if (keyCode == RIGHT_ARROW) {
      player.vx = 6;
    }
    if (keyCode == LEFT_ARROW) {
      player.vx = -6;
    }
    if (keyCode == CONTROL) {
      debug = !debug;
    }
  }
}

// Key released
function keyReleased() {
  if (screen == SCREEN_GAME) {
    // Release left arrow
    if ((keyCode == LEFT_ARROW && !keyIsDown(RIGHT_ARROW))) {
      player.ax = FRICTION;
    }

    // Release right arrow
    if ((keyCode == RIGHT_ARROW && !keyIsDown(LEFT_ARROW))) {
      player.ax = -FRICTION;
    }

    // Release jump, reset frameCount
    if (key == ' ' && frameCount-player.jumpLength < TOTAL_JUMP_FRAMES*1.5) {
      player.jumpLength = 0;
      player.ay = GRAVITY;
      player.vy = 0;
    }
  }
}

// Mouse pressed
function mousePressed() {
  if (screen == SCREEN_TITLE) {
    if (mouseX > 525 && mouseX < 875) {
      if (mouseY > 400 && mouseY < 550) {
        screen = SCREEN_GAME;
        setLevel();
      }
      else if (mouseY > 600 && mouseY < 750) {
        screen = SCREEN_LEVELSELECT;
      }
    }
  }
}

// Create level maps
function setLevel() {
  switch (level) {
    case 1:
      player = new Player(30,782);
      entities = [
        new Platform(300,800,150,100),
        new Platform(450,700,150,300),
        new Platform(600,600,150,500),
        new Platform(1200,600,200,500),
        new Lava(750,800,450,100),
        new Key(500,625,KEY_WIDTH,KEY_HEIGHT),
        new Door(1270,470,DOOR_WIDTH,DOOR_HEIGHT)
      ];
      break;

    case 2:
      player = new Player(30,782);
      entities = [
        new Platform(250,700,100,200),
        new Platform(650,450,749,75),
        new Platform(500,775,100,50),
        new Platform(850,775,100,50),
        new Platform(1200,775,100,50),
        new Lava(350,825,1049,75),
        new Lava(1000,250,50,200),
        new Key(1225,450-KEY_HEIGHT,KEY_WIDTH,KEY_HEIGHT),
        new Door(1200,645,DOOR_WIDTH,DOOR_HEIGHT)
      ];
      break;

    case 3:
      player = new Player(10,700);
      entities = [
        new Platform(1,825,DOOR_WIDTH,75),
        new Platform(700,825,50,75),
        new Platform(1225,650,50,75),
        new Platform(1275,390,50,25),
        new Platform(700,250,50,75),
        new Platform(1,250,125,75),
        new Lava(1+DOOR_WIDTH,850,599,50),
        new Lava(750,850,649,50),
        new Lava(1275,415,50,310),
        new Lava(126,275,574,50),
        new Key(37,250-KEY_HEIGHT,KEY_WIDTH,KEY_HEIGHT),
        new Door(1,695,DOOR_WIDTH,DOOR_HEIGHT)
      ];
      break;

    case 4:
      player = new Player(10,800);
      entities = [];
      break;

    default:
      player = new Player(10,800);
      entities = [];
  }
}

// Check collision detection
function collides(e1,e2) {
  return (e1.x <= e2.x+e2.width && e1.x+e1.width >= e2.x && e1.y <= e2.y+e2.height && e1.y+e1.height >= e2.y) ? true : false;
}
