// Constants
var ALPHABET = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var DIFFICULTY_SKRUB = 0;
var DIFFICULTY_NORMIE = 1;
var DIFFICULTY_BASED = 2;
var DIFFICULTY_SWAG = 3;
var DIFFICULTY_NANSASSIN = 4;
var SCREEN_TITLE = 0;
var SCREEN_GAME = 1;

// Variables
var screen;
var currentLetter;
var difficulty;
var round;

// Images
var img_title;

// Objects

// Nan object
var Nan = function(health, power) {
	this.health = health;
	this.power = power;
}

// Falling letter object
var Letter = function() {
	this.value = newLetter();
	this.height = 128;
	this.width = 128;
	this.x = Math.random()*(width-this.width);
	this.y = -this.height;
	this.vy = 1;
}

Letter.prototype.update = function() {
	this.y+=this.vy;

	/*Letter box*/
	stroke(0,0,0);
	fill(0,150,0);
	rect(this.x, this.y, this.width, this.height, this.width/2);

	/* Letter styling */
	fill(255,255,255);
	textFont("Arial");
	textSize(48);
	textAlign(CENTER, CENTER);
	text(this.value, this.x+this.width/2,this.y+this.height/2);
}

function preload() {
	img_title = loadImage("src/img/title.png");
}

function setup() {
	createCanvas(1024,576);
	screen = SCREEN_TITLE;
}

function draw() {
	background(255);
	if (screen == SCREEN_TITLE) {
		noStroke();
		// Background img.
		background(175,220,175);

		// Title img.
		image(img_title, 100, 100);

		fill(100,100,150,100);
		rect(0,0,width/4,height);
	}
	else if (screen == SCREEN_GAME) {
		currentLetter.update();
	}
}

function keyPressed() {
	// Fullscreen toggle
	if (key == 'F') {fullscreen(!fullscreen());}

	if (screen == SCREEN_TITLE) {

	}
	else if (screen == SCREEN_GAME) {
		// New letter
		if (key == currentLetter.value.charAt(0).toUpperCase()) {
			currentLetter.value = newLetter();
			currentLetter.y = -currentLetter.height;
			currentLetter.x = Math.random()*(width-currentLetter.width);
			currentLetter.vy*=1.1;
		}
	}
}

function keyReleased() {

}

/* Returns a new letter from the ALPHABET array */
function newLetter() {
	return ALPHABET[Math.round(Math.random()*(ALPHABET.length-1))];
}
