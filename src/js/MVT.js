// Entity object
function Player(xpos,ypos) {
	this.x = xpos;
	this.y = ypos;
	this.v = 0;
	this.vx = 0;
	this.vy = 0;
	this.a = 0;
	this.ax = 0;
	this.ay = 0;
	this.width = width/32;
	this.height = width/32;
	this.angle = 0;

	// Update player
	this.update = function() {
		// Turning with the left and right arrow keys
		if (keyIsDown(LEFT_ARROW)) {
			this.angle-=.05;
		}
		else if (keyIsDown(RIGHT_ARROW)) {
			this.angle+=.05;
		}

		// Acceleration movement
		if (keyIsDown(UP_ARROW)) {
			(this.v < 8) ? this.a = .05 : this.a = 0;
		}
		else if (Math.abs(this.v) > 0){
			this.a = 0;
			(this.v > 0) ? this.v -= .025 : this.v += .025;
		}

		// Accelerating velocity
		this.v += this.a;

		// Trigonometry to find vx, vy
		this.vx = this.v*Math.cos(this.angle);
		this.vy = this.v*Math.sin(this.angle);

		// Velocity
		this.x += this.vx;
		this.y += this.vy;

		// Rollover x
		if (this.x > width) {
			this.x = -this.width;
		}
		if (this.x < -this.width) {
			this.x = width;
		}

		// Rollover y
		if (this.y > height) {
			this.y = -this.height;
		}
		if (this.y < -this.height) {
			this.y = height;
		}

		// Draw player
		fill(255);
		stroke(255,0,0);
		translate(this.x,this.y);
		rotate(this.angle);
		rect(-this.width/2,-this.height/2,this.width,this.height);
	}

	// Shoot a bullet
	this.shoot = function() {
		bullets.push(new Bullet(this.angle));
	}
}

// Bullet object
function Bullet(angle) {
	this.width = width/64+16;
	this.height = width/64;
	this.x = 2*this.width;
	this.y = -this.height/2;
	this.vx = 3;
	this.angle = angle;

	// Update bullet
	this.update = function() {
		// Velocity
		this.x += this.vx;

		// Draw bullet
		rotate(this.angle-player.angle);
		fill(255,0,0);
		stroke(0,0,0);
		rect(this.x,this.y,this.width,this.height);
		rotate(player.angle-this.angle);
	}
}

// Variables
var player;
var bullets = [];

function setup() {
	createCanvas(1024,576);
	player = new Player(300,300);
}

function draw() {
	background(255);
	player.update();
	for (var i=0; i<bullets.length; i++) {
		bullets[i].update();
	}
}

function keyPressed() {
	// Fullscreen toggle
	if (key == 'F') { fullscreen(!fullscreen()); }
	if (key == ' ') { player.shoot(); }
}
