/*
	TODO:
	- Update moves that hurt both the opponent and player
	- Add moves skipped for being too complex [thrash, wrap, transform, substitute, etc]
	- Flinching
	- EXP gain
	- Accuracy in status moves
	- Clean up hacky / unorganized code
*/

/* Constants */
// Basic
const WIDTH = 1000;
const HEIGHT = 1000;

// Types
const TYPE_BUG = 0;
const TYPE_DRAGON = 1;
const TYPE_ELECTRIC = 2;
const TYPE_FIGHT = 3;
const TYPE_FIRE = 4;
const TYPE_FLYING = 5;
const TYPE_GHOST = 6;
const TYPE_GRASS = 7;
const TYPE_GROUND = 8;
const TYPE_ICE = 9;
const TYPE_NORMAL = 10;
const TYPE_POISON = 11;
const TYPE_PSYCHIC = 12;
const TYPE_ROCK = 13;
const TYPE_WATER = 14;

// Sexes
const SEX_MALE = 0;
const SEX_FEMALE = 1;

// Category of attack (physical, special, status)
const CATEGORY_PHYSICAL = 0;
const CATEGORY_SPECIAL = 1;
const CATEGORY_STATUS = 2;

// How many times the attack can hit (1 or 2-5 times)
const NUMHITS_ONE = 0;
const NUMHITS_MULTIPLE = 1;

// Stats (for stat-raising moves)
const STAT_HP = 0;
const STAT_ATK = 1;
const STAT_DEF = 2;
const STAT_SPATK = 3;
const STAT_SPDEF = 4;
const STAT_SPEED = 5;
const STAT_ACC = 6;
const STAT_CRIT = 7;
const STAT_BURN = 8;
const STAT_PARALYSIS = 9;
const STAT_FREEZE = 10;
const STAT_ASLEEP = 11;
const STAT_CONFUSED = 12;
const STAT_POISONED = 13;

// Non-standard stat-raising amounts
const NSA_MAXHP = 1;

// Experience per level
const MAXEXPERIENCE = [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150];

// Natures
const NATURE_ADAMANT = 0;
const NATURE_BASHFUL = 1;
const NATURE_BOLD = 2;
const NATURE_BRAVE = 3;
const NATURE_CALM = 4;
const NATURE_CAREFUL = 5;
const NATURE_DOCILE = 6;
const NATURE_GENTLE = 7;
const NATURE_HARDY = 8;
const NATURE_HASTY = 9;
const NATURE_IMPISH = 10;
const NATURE_JOLLY = 11;
const NATURE_LAX = 12;
const NATURE_LONELY = 13;
const NATURE_MILD = 14;
const NATURE_MODEST = 15;
const NATURE_NAIVE = 16;
const NATURE_NAUGHTY = 17;
const NATURE_QUIET = 18;
const NATURE_QUIRKY = 19;
const NATURE_RASH = 20;
const NATURE_RELAXED = 21;
const NATURE_SASSY = 22;
const NATURE_SERIOUS = 23;
const NATURE_TIMID = 24;

// Menu screens
const MENU_MAIN = 0;
const MENU_FIGHT = 1;
const MENU_BAG = 2;
const MENU_POKEMON = 3;
const MENU_RUN = 4;

// Global arrays- individual Pokemon, Natures, and Move instances are initialized in preload()
var MOVE_BUG;
var MOVE_DRAGON;
var MOVE_ELECTRIC;
var MOVE_FIGHT;
var MOVE_FIRE;
var MOVE_FLYING;
var MOVE_GHOST;
var MOVE_GRASS;
var MOVE_GROUND;
var MOVE_ICE;
var MOVE_NORMAL;
var MOVE_POISON;
var MOVE_PSYCHIC;
var MOVE_ROCK;
var MOVE_WATER;

// Superarrays!
var MOVES;
var SEXES;
var NATURES;
var POKEMON;

/* Variables */
// Images
var img_ui_background;

// Object instances
var player;
var opponent;

// Basic
var isPlayersTurn = true;
var menuScreen = MENU_MAIN;
var selectedMove;
var healthDecreaseQueue;
var textScreenFreezeActive = false;
var textScreenMessage = "";

// Move function for attacks
function Move(name, type, category, pp, power, accuracy, numHits) {
	this.name = name;
	this.type = type;
	this.category = category;
	this.pp = pp;
	this.maxpp = pp;
	this.power = power;
	this.accuracy = accuracy;
	this.numHits = numHits;
}

// Overloaded Move function for stat-affecting moves
function StatMove(name, type, pp, amount, stat, applyToSelf) {
	this.name = name;
	this.type = type;
	this.pp = pp;
	this.maxpp = pp;
	this.amount = amount;
	this.stat = stat;
	this.applyToSelf = applyToSelf;
}

// Pokemon object
function Pokemon(name, index, type) {
	this.name = name;
	this.index = index;
	this.type = type;
	this.moveset = null;
	this.nature = randomFrom(NATURES);
	this.level = randomInt(5,100);
	this.exp = 0;
	this.sex = randomFrom(SEXES);
	this.health = randomInt(15,20)+randomInt(3,4)*(this.level-5);
	this.maxHealth = this.health;
	this.atk = randomInt(5,10)+this.level;
	this.def = randomInt(5,10)+this.level;
	this.spatk = randomInt(5,10)+this.level;
	this.spdef = randomInt(5,10)+this.level;
	this.critluck = 0.05;
	this.isBurned = false;
	this.isParalyzed = false;
	this.isFrozen = false;
	this.isAsleep = false;
	this.isConfused = false;
	this.isPoisoned = false;
	this.numTurnsParalyzed = 0;
	this.numTurnsFrozen = 0;
	this.numTurnsAsleep = 0;
	this.numTurnsConfused = 0;
	this.img = loadImage("pokemon/"+index+".png");
	this.backImg = loadImage("pokemon/back/"+index+".png");

	this.setup = function() {
		switch (this.nature) {
			case NATURE_LONELY:
				this.atk += 5;
				this.def -= 5;
				break;
			case NATURE_BRAVE:
				this.atk += 5;
				this.speed -= 5;
				break;
			case NATURE_ADAMANT:
				this.atk += 5;
				this.spatk -= 5;
				break;
			case NATURE_NAUGHTY:
				this.atk += 5;
				this.spdef -= 5;
				break;
			case NATURE_BOLD:
				this.def += 5;
				this.atk -= 5;
				break;
			case NATURE_RELAXED:
				this.def += 5;
				this.speed -= 5;
				break;
			case NATURE_IMPISH:
				this.def += 5;
				this.spatk -= 5;
				break;
			case NATURE_LAX:
				this.def += 5;
				this.spdef -= 5;
				break;
			case NATURE_TIMID:
				this.speed += 5;
				this.atk -=5;
				break;
			case NATURE_HASTY:
				this.speed += 5;
				this.def -= 5;
				break;
			case NATURE_JOLLY:
				this.speed += 5;
				this.spatk -= 5;
				break;
			case NATURE_NAIVE:
				this.speed += 5;
				this.spdef -= 5;
				break;
			case NATURE_MODEST:
				this.spatk += 5;
				this.atk -= 5;
				break;
			case NATURE_MILD:
				this.spatk += 5;
				this.def -= 5;
				break;
			case NATURE_QUIET:
				this.spatk += 5;
				this.speed -=5;
				break;
			case NATURE_RASH:
				this.spatk += 5;
				this.spdef -= 5;
				break;
			case NATURE_CALM:
				this.spdef += 5;
				this.atk -= 5;
				break;
			case NATURE_GENTLE:
				this.spdef += 5;
				this.def -= 5;
				break;
			case NATURE_SASSY:
				this.spdef += 5;
				this.speed -= 5;
			case NATURE_CAREFUL:
				this.spdef += 5;
				this.spatk -= 5;
				break;
			case NATURE_HARDY:
			case NATURE_DOCILE:
			case NATURE_SERIOUS:
			case NATURE_BASHFUL:
			case NATURE_QUIRKY:
				break;
			default:
				console.error("NATURE NOT FOUND");
		}
	}
}

// Player object
function Player() {
	this.team = [
		randomFrom(POKEMON),
		randomFrom(POKEMON),
		randomFrom(POKEMON),
		randomFrom(POKEMON),
		randomFrom(POKEMON),
		randomFrom(POKEMON)
	];

	for (var i=0; i<this.team.length; i++) {
		this.team[i].moveset = randomMoveset(this.team[i].type);
	}

	this.currentPokemon = this.team[0];

	this.lastSelectedMove = this.currentPokemon.moveset[0];

	this.update = function() {
		if (this.currentPokemon.health <= 0) {
			this.team.splice(0,1);
			this.currentPokemon = this.team[1];
		}
		// Draw image before checking for healthDecreaseQueue because otherwise Pokemon sprite won't be drawn
		image(this.currentPokemon.backImg,125,575,150,150);

		if (isPlayersTurn) {
			if (healthDecreaseQueue > 0) {
				this.currentPokemon.health--;
				healthDecreaseQueue--;
				return;
			}
		}
	}
}

// Opponent object
function Opponent() {
	this.team = [
		randomFrom(POKEMON),
		randomFrom(POKEMON),
		randomFrom(POKEMON),
		randomFrom(POKEMON),
		randomFrom(POKEMON),
		randomFrom(POKEMON)
	];

	for (var i=0; i<this.team.length; i++) {
		this.team[i].moveset = randomMoveset(this.team[i].type);
	}

	this.currentPokemon = this.team[0];

	this.update = function() {
		if (this.currentPokemon.health <= 0) {
			this.team.splice(0,1);
			this.currentPokemon = this.team[0];
			isPlayersTurn = (this.currentPokemon.speed < player.currentPokemon.speed);
		}

		image(this.currentPokemon.img,WIDTH-275,200,150,150);

		if (!isPlayersTurn) {
			if (healthDecreaseQueue > 0) {
				this.currentPokemon.health--;
				healthDecreaseQueue--;
				return;
			}

			if (!textScreenFreezeActive) {
				selectedMove = this.currentPokemon.moveset[randomInt(0,3)];
				textScreenMessage = this.currentPokemon.name+" used "+selectedMove.name;
				textScreenFreezeActive = true;
				menuScreen = MENU_MAIN;
			}
		}
	}
}

// Adds moves that are not the same type as the Pokemon, but that make sense
function addSecondaryMoves(type) {
	var returnArray = [];

	if (type instanceof Array) {
		if (type[0] != TYPE_NORMAL && type[0] != TYPE_GHOST && type[1] != TYPE_NORMAL && type[1] != TYPE_GHOST) { returnArray = returnArray.concat(MOVES[TYPE_NORMAL]); }
	}
	else {
		if (type != TYPE_NORMAL && type != TYPE_GHOST) { returnArray = returnArray.concat(MOVES[TYPE_NORMAL]); }
	}

	return returnArray;
}

// Returns a random array of moves
function randomMoveset(type) {
	var possibleMoves = [];
	var returnArray = [];

	possibleMoves = (type instanceof Array) ? possibleMoves.concat(MOVES[type[0]]).concat(MOVES[type[1]]).concat(addSecondaryMoves(type)) : possibleMoves.concat(MOVES[type]).concat(addSecondaryMoves(type));

	// Pick 4 distinct moves randomly from the array
	for (var j=0; j<4; j++) {
		var index = randomInt(0,possibleMoves.length-1);
		returnArray.push(possibleMoves[index]);
		possibleMoves.splice(index,1);
	}

	return returnArray;
}

// Redeclaration of p5.js's random() function-- doesn't load before I need to use it [see Pokemon() function]
function randomInt(l,h) {
	return Math.round(Math.random()*(h-l))+l;
}

// Returns a random item from an array passed as an argument; works for POKEMON[] and NATURES[]
function randomFrom(arr) {
	return arr[randomInt(0,arr.length-1)];
}

// The Pokemon performs a stat move
function performStatMove() {
	// isPlayersTurn && applyToSelf => player;
	// isPlayersTurn && !applyToSelf => opponent;
	// !isPlayersTurn && applyToSelf => opponent;
	// !isPlayersTurn && !applyToSelf => player;

	var playerAffected = (isPlayersTurn ^ selectedMove.applyToSelf) ? opponent : player;

	switch(selectedMove.stat) {
		case STAT_HP:
			if (selectedMove.amount == NSA_MAXHP) {
				selectedMove.amount = playerAffected.currentPokemon.maxHealth;
			}
			playerAffected.currentPokemon.hp += selectedMove.amount;
			break;
		case STAT_ATK:
			playerAffected.currentPokemon.atk += selectedMove.amount;
			break;
		case STAT_DEF:
			playerAffected.currentPokemon.def += selectedMove.amount;
			break;
		case STAT_SPATK:
			playerAffected.currentPokemon.spatk += selectedMove.amount;
			break;
		case STAT_SPDEF:
			playerAffected.currentPokemon.spdef += selectedMove.amount;
			break;
		case STAT_SPEED:
			playerAffected.currentPokemon.speed += selectedMove.amount;
			break;
		case STAT_ACC:
			playerAffected.currentPokemon.accuracy += selectedMove.amount;
			break;
		case STAT_CRIT:
			playerAffected.currentPokemon.critluck += selectedMove.critluck;
			break;
		case STAT_BURN:
			playerAffected.currentPokemon.isBurned = true;
			break;
		case STAT_PARALYSIS:
			playerAffected.currentPokemon.isParalyzed = true;
			break;
		case STAT_FREEZE:
			playerAffected.currentPokemon.isFrozen = true;
			break;
		case STAT_ASLEEP:
			playerAffected.currentPokemon.isAsleep = true;
			break;
		case STAT_CONFUSED:
			playerAffected.currentPokemon.isConfused = true;
			break;
		case STAT_POISONED:
			playerAffected.currentPokemon.isPoisoned = true;
			break;
		default:
			console.error("Error: STAT_xxx NOT FOUND");
	}

	if (!isPlayersTurn) {
		textScreenMessage = "What will "+player.currentPokemon.name+" do?";
	}

	isPlayersTurn = !isPlayersTurn;

}

// The Pokemon performs a move-- checks isPlayersTurn to see who the move is performed on
function attack() {
	/*	THINGS TO KEEP IN MIND:
		DONE 1. Type difference
		DONE 2. Native Pokemon type
		DONE 3. ATK, SPATK, DEF, and SPDEF stats
		DONE 4. Move power
		DONE 5. Move accuracy
		DONE 6. Criical hits
	*/
	console.log(selectedMove);

	if (selectedMove instanceof StatMove) {
		performStatMove();
		return;
	}

	// Modifications to the damage algorithm
	var playerPerforming = (isPlayersTurn) ? player : opponent;
	var playerDefending = (isPlayersTurn) ? opponent : player;
	var mod_moveTypeDmgModifierArray;
	var mod_moveTypeDmgModifier;
	var mod_relevantAtkModifier;
	var mod_relevantDefModifier;
	var mod_critModifier;
	var mod_numHits;
	var mod_pokeIsNativeMoveType = (playerPerforming.currentPokemon.type instanceof Array) ? (selectedMove.type == playerPerforming.currentPokemon.type[0] || selectedMove.type == playerPerforming.currentPokemon.type[1]) : (selectedMove.type == playerPerforming.currentPokemon.type);
	var mod_performerFrozen = playerPerforming.currentPokemon.isFrozen;
	var mod_performerConfused = playerPerforming.currentPokemon.isConfused;
	var finalDmg;

	// If frozen, check for freeze!
	// if (mod_performerFrozen) {
	// 	if (playerPerforming.numTurns < )
	// }

	// These arrays represent the damage modifiers for each type-- the values in the arrays are mapped to the types.
	switch (selectedMove.type) {
		case TYPE_BUG:
			mod_moveTypeDmgModifierArray = [1,1,1,0.5,0.5,0.5,0.5,2,1,1,1,0.5,2,1,0.5,1];
			break;
		case TYPE_DRAGON:
			mod_moveTypeDmgModifierArray = [1,2,1,1,1,1,1,1,1,1,1,1,1,1,0.5,1];
			break;
		case TYPE_ELECTRIC:
			mod_moveTypeDmgModifierArray = [1,0.5,0.5,1,1,2,1,0.5,0,1,1,1,1,1,1,2];
			break;
		case TYPE_FIGHT:
			mod_moveTypeDmgModifierArray = [0.5,1,1,1,1,0.5,0,1,1,2,2,0.5,0.5,2,2,1];
			break;
		case TYPE_FIRE:
			mod_moveTypeDmgModifierArray = [2,0.5,1,1,0.5,1,1,2,1,2,1,1,1,0.5,2,0.5];
			break;
		case TYPE_FLYING:
			mod_moveTypeDmgModifierArray = [2,1,0.5,2,1,1,1,2,1,1,1,1,1,0.5,0.5,1];
			break;
		case TYPE_GHOST:
			mod_moveTypeDmgModifierArray = [1,1,1,1,1,1,2,1,1,1,0,1,2,1,1,1];
			break;
		case TYPE_GRASS:
			mod_moveTypeDmgModifierArray = [0.5,0.5,1,1,0.5,0.5,1,0.5,2,1,1,0.5,1,2,0.5,2];
			break;
		case TYPE_GROUND:
			mod_moveTypeDmgModifierArray = [0.5,1,2,1,2,0,1,0.5,1,1,1,2,1,2,2,1];
		break;
		case TYPE_ICE:
			mod_moveTypeDmgModifierArray = [1,2,1,1,0.5,2,1,2,2,0.5,1,1,1,1,0.5,0.5];
			break;
		case TYPE_NORMAL:
			mod_moveTypeDmgModifierArray = [1,1,1,1,1,1,0,1,1,1,1,1,1,0.5,0.5,1];
			break;
		case TYPE_POISON:
			mod_moveTypeDmgModifierArray = [1,1,1,1,1,1,0.5,2,0.5,1,1,0.5,1,0.5,0,1];
			break;
		case TYPE_PSYCHIC:
			mod_moveTypeDmgModifierArray = [1,1,1,2,1,1,1,1,1,1,1,2,0.5,1,0.5,1];
			break;
		case TYPE_ROCK:
			mod_moveTypeDmgModifierArray = [2,1,1,0.5,2,2,1,1,0.5,2,1,1,1,1,0.5,1];
			break;
		case TYPE_WATER:
			mod_moveTypeDmgModifierArray = [1,1,0.5,1,0.5,1,1,1,1,2,1,1,1,2,0.5,0.5];
			break;
		default:
			mod_moveTypeDmgModifierArray = [1,0.5,1,1,2,1,1,0.5,2,1,1,1,1,2,1,0.5];
			break;
	}

	if (isPlayersTurn) {
		if (opponent.currentPokemon.type instanceof Array) {
			mod_moveTypeDmgModifier = (mod_moveTypeDmgModifierArray[opponent.currentPokemon.type[0]] + mod_moveTypeDmgModifierArray[opponent.currentPokemon.type[0]])/2;
		}
		else {
			mod_moveTypeDmgModifier = (mod_moveTypeDmgModifierArray[opponent.currentPokemon.type]);
		}
	}
	else {
		if (player.currentPokemon.type instanceof Array) {
			mod_moveTypeDmgModifier = (mod_moveTypeDmgModifierArray[player.currentPokemon.type[0]] + mod_moveTypeDmgModifierArray[player.currentPokemon.type[0]])/2;
		}
		else {
			mod_moveTypeDmgModifier = (mod_moveTypeDmgModifierArray[player.currentPokemon.type]);
		}
	}

	// Decide whether to use SPATK or ATK
	mod_relevantAtkModifier = (selectedMove.category == CATEGORY_PHYSICAL) ? playerPerforming.currentPokemon.atk : playerPerforming.currentPokemon.spatk;
	mod_relevantDefModifier = (selectedMove.category == CATEGORY_PHYSICAL) ? playerDefending.currentPokemon.atk : playerDefending.currentPokemon.spatk;
	mod_critModifier = (Math.random() > 1-playerPerforming.critluck) ? 2 : 1;

	// Decide number of hits based on numHits attribute
	mod_numHits = (selectedMove.numHits == NUMHITS_ONE) ? 1 : randomInt(2,5);

	// First, check for accuracy
	if (Math.random() < selectedMove.accuracy) {
		if (selectedMove.amount == NSA_MAXHP/2) {
			finalDmg = Math.round(playerDefending.maxHealth/2);
		}
		else {
			finalDmg = Math.round(((selectedMove.power)*(mod_moveTypeDmgModifier)*(mod_critModifier)*(mod_relevantAtkModifier)*(mod_numHits))/(mod_relevantDefModifier));
		}
	}
	else {
		finalDmg = 0;
	}

	// Finally, check if finalDmg is greater than the opponent's health
	if (finalDmg > playerDefending.currentPokemon.health) {
		finalDmg = playerDefending.currentPokemon.health;
	}

	// console.log("Final: "+finalDmg+"\nPower: "+selectedMove.power+"\nDmgModifier: "+mod_moveTypeDmgModifier+"\nCritModifier: "+mod_critModifier+"\nAtkModifier: "+mod_relevantAtkModifier+"\nDefModifier: "+mod_relevantDefModifier);

	healthDecreaseQueue = finalDmg;
	selectedMove.pp--;

	// Reset message
	if (!isPlayersTurn) {
		textScreenMessage = "What will "+player.currentPokemon.name+" do?";
	}

	isPlayersTurn = !isPlayersTurn;
}

// drawUI() first draws static UI elements, then calls boolean-specific UI elements
function drawUI() {
	/* Background [layer 0] */
	// Background image
	image(img_ui_background,0,0);

	/* Static UI elements [layer 1] */
	// Empty text description box
	stroke(0);
	fill(175);
	rect(25,HEIGHT-175,WIDTH-50,150,5);

	// Pokemon ellipse platforms
	fill(0,50,0);
	ellipse(WIDTH-200,300,200,125);
	ellipse(200,700,200,125);

	// Stat boxes
	fill(75);
	rect(WIDTH-400,HEIGHT-300,375,100,5);
	rect(25,25,375,100,5);

	/* empty EXP / Health bars [layer 2] */
	// Health bars
	noFill();
	rect(WIDTH-275,HEIGHT-250,240,20,3);
	rect(150,75,240,20,3);

	// EXP bar
	rect(WIDTH-360,HEIGHT-215,325,5);

	// "HP text" backdrop
	noStroke();
	fill('rgba(200,0,25,0.75)');
	rect(WIDTH-300,HEIGHT-250,20,20,5);
	rect(125,75,20,20,5);

	// "HP" text next to health bar
	textFont("Arial",10);
	textAlign(CENTER,CENTER);
	fill(255);
	text("HP",WIDTH-290,HEIGHT-240);
	text("HP",135,85);

	/* Non-static UI elements */
	// Background colors for menu options -- only active on main menu
	if (menuScreen == MENU_MAIN) {

		// Bottom option bar
		stroke(0);
		fill(75);
		rect(25+(WIDTH-50)/2,HEIGHT-175,(WIDTH-50)/2,150,0,5,5,0);

		// Fight
		(mouseX > 25+(WIDTH-50)/2 && mouseX < 25+(WIDTH-50)/2 + (WIDTH-50)/4 && mouseY > HEIGHT-175 && mouseY < HEIGHT-100) ? fill(150,0,0) : fill(200,0,50);
		rect(25+(WIDTH-50)/2,HEIGHT-175,(WIDTH-50)/4,75);
		// Pokemon
		(mouseX > 25+(WIDTH-50)/2 && mouseX < 25+(WIDTH-50)/2 + (WIDTH-50)/4 && mouseY > HEIGHT-100 && mouseY < HEIGHT-25) ? fill(0,100,0) : fill(25,150,50);
		rect(25+(WIDTH-50)/2,HEIGHT-100,(WIDTH-50)/4,75);
		// Bag
		(mouseX > (3*WIDTH-50)/4 && mouseX < (3*WIDTH-50)/4 + (WIDTH-50)/4 && mouseY > HEIGHT-175 && mouseY < HEIGHT-100) ? fill(175,100,0) : fill(225,125,0);
		rect((3*WIDTH-50)/4,HEIGHT-175,(WIDTH-50)/4,75,0,5,0,0);
		// Run
		(mouseX > (3*WIDTH-50)/4 && mouseX < (3*WIDTH-50)/4 + (WIDTH-50)/4 && mouseY > HEIGHT-100 && mouseY < HEIGHT-25) ? fill(0,50,200) : fill(0,100,255);
		rect((3*WIDTH-50)/4,HEIGHT-100,(WIDTH-50)/4,75,0,0,5,0);

		// Text box
		textFont("Courier New",20);
		textAlign(CENTER,CENTER);
		fill(0);
		text(textScreenMessage,25+(WIDTH-50)/4,HEIGHT-100);
	}
	else if (menuScreen == MENU_FIGHT) {
		// 4 Moves:

		// TL
		(mouseX > 25 && mouseX < 25+(WIDTH-50)/4 && mouseY > HEIGHT-175 && mouseY < HEIGHT-100) ? fill('rgba(150,0,0,0.3)') : fill('rgba(150,0,0,0.1)');
		rect(25,HEIGHT-175,(WIDTH-50)/4,75,5,0,0,0);
		// BL
		(mouseX > 25 && mouseX < 25+(WIDTH-50)/4 && mouseY > HEIGHT-100 && mouseY < HEIGHT-25) ? fill('rgba(150,0,0,0.3)') : fill('rgba(150,0,0,0.1)');
		rect(25,HEIGHT-100,(WIDTH-50)/4,75,0,0,0,5);
		// TR
		(mouseX > 25+(WIDTH-50)/4 && mouseX < 25+(WIDTH-50)/2 && mouseY > HEIGHT-175 && mouseY < HEIGHT-100) ? fill('rgba(150,0,0,0.3)') : fill('rgba(150,0,0,0.1)');
		rect(25+(WIDTH-50)/4,HEIGHT-175,(WIDTH-50)/4,75);
		// BR
		(mouseX > 25+(WIDTH-50)/4 && mouseX < 25+(WIDTH-50)/2 && mouseY > HEIGHT-100 && mouseY < HEIGHT-25) ? fill('rgba(150,0,0,0.3)') : fill('rgba(150,0,0,0.1)');
		rect(25+(WIDTH-50)/4,HEIGHT-100,(WIDTH-50)/4,75);

		/* Right-side information panel / FIGHT and BACK buttons */

		// Determine type name
		var typeLiteral;
		switch (selectedMove.type) {
			case TYPE_BUG:
				typeLiteral = "Bug";
				break;
			case TYPE_DRAGON:
				typeLiteral = "Dragon";
				break;
			case TYPE_ELECTRIC:
				typeLiteral = "Electric";
				break;
			case TYPE_FIGHT:
				typeLiteral = "Fighting";
				break;
			case TYPE_FIRE:
				typeLiteral = "Fire";
				break;
			case TYPE_FLYING:
				typeLiteral = "Flying";
				break;
			case TYPE_GHOST:
				typeLiteral = "Ghost";
				break;
			case TYPE_GRASS:
				typeLiteral = "Grass";
				break;
			case TYPE_GROUND:
				typeLiteral = "Ground";
				break;
			case TYPE_ICE:
				typeLiteral = "Ice";
				break;
			case TYPE_NORMAL:
				typeLiteral = "Normal";
				break;
			case TYPE_POISON:
				typeLiteral = "Poison";
				break;
			case TYPE_PSYCHIC:
				typeLiteral = "Psychic";
				break;
			case TYPE_ROCK:
				typeLiteral = "Rock";
				break;
			case TYPE_WATER:
				typeLiteral = "Water";
				break;
			default:
				typeLiteral = "???";
				break;
		}

		// Name
		textFont("Courier New",32);
		fill(0);
		text(selectedMove.name,25+3*(WIDTH-50)/4,HEIGHT-(275/2));
		textFont("Courier New",16);
		text(typeLiteral,25+3*(WIDTH-50)/4,HEIGHT-(275/2)+25);

		// PP
		textFont("Courier New",16);
		textAlign(RIGHT,TOP);
		text(selectedMove.pp+"/"+selectedMove.maxpp+" PP",(3*WIDTH-50)/4+(WIDTH-50)/4-5,HEIGHT-170);

		// Back button
		textAlign(RIGHT,BOTTOM);
		(mouseX > (3*WIDTH-50)/4+(WIDTH-50)/4-75 && mouseX < (3*WIDTH-50)/4+(WIDTH-50)/4-5 && mouseY > HEIGHT-45 && mouseY < HEIGHT-25) ? fill(255,0,0) : fill(0);
		text("\u27F5 Back",(3*WIDTH-50)/4+(WIDTH-50)/4-5,HEIGHT-25);

		// Power
		textAlign(LEFT,TOP);
		fill(0);
		if (selectedMove instanceof Move) {
			text(selectedMove.power+" Power",30+(WIDTH-50)/2,HEIGHT-170);
		}

		// GO! button
		textAlign(CENTER,CENTER);
		textFont("Courier New",20);
		stroke(0);
		(selectedMove.pp > 0) ? ((mouseX > 3*(WIDTH-50)/4-50 && mouseX < 3*(WIDTH-50)/4+100 && mouseY > HEIGHT-75 && mouseY < HEIGHT-35) ? fill(10,200,30) : fill(20,255,50)) : fill(150,20,0);
		rect(3*(WIDTH-50)/4-50,HEIGHT-75,150,40);
		fill(0);
		text("GO!",25+3*(WIDTH-50)/4,HEIGHT-55);
	}

	// Names
	textFont("Courier New",45);
	textAlign(CENTER,CENTER);
	stroke(0);
	fill(200);
	text(player.currentPokemon.name.toUpperCase(),WIDTH-212.5,HEIGHT-275);
	text(opponent.currentPokemon.name.toUpperCase(),212.5,50);

	// Numerical health status
	textFont("Arial",20);
	text(player.currentPokemon.health+"/"+player.currentPokemon.maxHealth,WIDTH-350,HEIGHT-240);
	text(opponent.currentPokemon.health+"/"+opponent.currentPokemon.maxHealth,75,85);

	// Health bar colors
	var colorPlayerHealth = (player.currentPokemon.health > 0.5*player.currentPokemon.maxHealth) ? color(0,255,0) : ((player.currentPokemon.health > 0.25*player.currentPokemon.maxHealth) ? color(255,255,0) : color(255,0,0));
	fill(colorPlayerHealth);
	rect(WIDTH-275,HEIGHT-250,240*(player.currentPokemon.health/player.currentPokemon.maxHealth),20,3);

	var colorOpponentHealth = (opponent.currentPokemon.health > 0.5*opponent.currentPokemon.maxHealth) ? color(0,255,0) : ((opponent.currentPokemon.health > 0.25*opponent.currentPokemon.maxHealth) ? color(255,255,0) : color(255,0,0));
	fill(colorOpponentHealth);
	rect(150,75,240*(opponent.currentPokemon.health/opponent.currentPokemon.maxHealth),20,3);

	// Level display
	textFont("Arial",15);
	fill(200);
	text("lv. "+player.currentPokemon.level,WIDTH-380,HEIGHT-212.5);
	text("lv. "+opponent.currentPokemon.level,45,112.5);

	// EXP filler
	fill(20,125,255);
	rect(WIDTH-360,HEIGHT-215,325*(player.currentPokemon.exp/MAXEXPERIENCE[player.currentPokemon.level-1]),5);

	// Menu options for main menu
	var menuOptions = new Array();
	var xFactor = 0;
	var fillColor = 200;

	switch(menuScreen) {
		case MENU_MAIN:
			menuOptions = ["FIGHT","BAG","POKEMON","RUN"];
			textFont("Courier New",50);
			break;
		case MENU_FIGHT:
			for (var i=0; i<4; i++) {
				menuOptions.push(player.currentPokemon.moveset[i].name);
			}
			xFactor = (WIDTH-50)/2;
			textFont("Courier New",20);
			fillColor = 0;
			break;
		default:
			console.error("error!");
			break;
	}

	// ...Then write the options to the screen
	textAlign(CENTER,CENTER);
	fill(fillColor);

	for (var i=0; i<4; i++) {
		text(menuOptions[i],(5/8)*(WIDTH-10)+((WIDTH-50)/4)*(i%2)-xFactor,HEIGHT-(275/2)+75*(Math.floor(i/2)));
	}
}

// Preload images, initialize arrays
function preload() {
	img_ui_background = loadImage("img/ui_background.png");

	/* Sexes */
	SEXES = [SEX_MALE, SEX_FEMALE];

	/* Natures */
	NATURES = [NATURE_ADAMANT, NATURE_BASHFUL, NATURE_BOLD, NATURE_BRAVE, NATURE_CALM, NATURE_CAREFUL, NATURE_DOCILE, NATURE_GENTLE, NATURE_HARDY, NATURE_HASTY, NATURE_IMPISH, NATURE_JOLLY, NATURE_LAX, NATURE_LONELY, NATURE_MILD, NATURE_MODEST, NATURE_NAIVE, NATURE_NAUGHTY, NATURE_QUIET, NATURE_QUIRKY, NATURE_RASH, NATURE_RELAXED, NATURE_SASSY, NATURE_SERIOUS, NATURE_TIMID];

	/* Moves */
	MOVE_BUG = [
		new StatMove("Leech Life",TYPE_BUG,10,20,STAT_HP,true),
		new Move("Pin Missile",TYPE_BUG,CATEGORY_PHYSICAL,20,25,0.95,NUMHITS_MULTIPLE),
		new Move("Twineedle",TYPE_BUG,CATEGORY_PHYSICAL,20,25,1,NUMHITS_ONE),
		new StatMove("String Shot",TYPE_BUG,40,-20,STAT_SPEED,false)
	];

	MOVE_DRAGON = [
		new Move("Dragon Rage",TYPE_DRAGON,CATEGORY_SPECIAL,10,40,1,NUMHITS_ONE)
	];

	MOVE_ELECTRIC = [
		new Move("Thunder Punch",TYPE_ELECTRIC,CATEGORY_PHYSICAL,15,75,1,NUMHITS_ONE),
		new Move("Thunder",TYPE_ELECTRIC,CATEGORY_SPECIAL,10,110,0.7,NUMHITS_ONE),
		new Move("Thunder Shock",TYPE_ELECTRIC,CATEGORY_SPECIAL,30,40,1,NUMHITS_ONE),
		new Move("Thunderbolt",TYPE_ELECTRIC,CATEGORY_SPECIAL,15,90,1,NUMHITS_ONE),
		new StatMove("Thunder Wave",TYPE_ELECTRIC,20,1,STAT_PARALYSIS,false)
	];

	MOVE_FIGHT = [
		new Move("Counter",TYPE_FIGHT,CATEGORY_PHYSICAL,20,100,1,NUMHITS_ONE),
		new Move("Double Kick",TYPE_FIGHT,CATEGORY_PHYSICAL,30,60,1,NUMHITS_ONE),
		new Move("High Jump Kick",TYPE_FIGHT,CATEGORY_PHYSICAL,10,130,0.9,NUMHITS_ONE),
		new Move("Jump Kick",TYPE_FIGHT,CATEGORY_PHYSICAL,10,100,0.95,NUMHITS_ONE),
		new Move("Karate Chop",TYPE_FIGHT,CATEGORY_PHYSICAL,25,50,1,NUMHITS_ONE),
		new Move("Low Kick",TYPE_FIGHT,CATEGORY_PHYSICAL,20,90,1,NUMHITS_ONE),
		new Move("Rolling Kick",TYPE_FIGHT,CATEGORY_PHYSICAL,15,60,0.85,NUMHITS_ONE),
		new Move("Seismic Toss",TYPE_FIGHT,CATEGORY_PHYSICAL,20,100,NUMHITS_ONE),
		new Move("Submission",TYPE_FIGHT,CATEGORY_PHYSICAL,20,80,0.8,NUMHITS_ONE)
	];

	MOVE_FIRE = [
		new Move("Fire Punch",TYPE_FIRE,CATEGORY_PHYSICAL,15,75,1,NUMHITS_ONE),
		new Move("Ember",TYPE_FIRE,CATEGORY_SPECIAL,25,40,1,NUMHITS_ONE),
		new Move("Fire Blast",TYPE_FIRE,CATEGORY_SPECIAL,5,110,0.85,NUMHITS_ONE),
		new Move("Fire Spin",TYPE_FIRE,CATEGORY_SPECIAL,15,35,0.85,NUMHITS_ONE),
		new Move("Flamethrower",TYPE_FIRE,CATEGORY_SPECIAL,15,90,1,NUMHITS_ONE)
	];

	MOVE_FLYING = [
		new Move("Drill Peck",TYPE_FLYING,CATEGORY_PHYSICAL,20,80,1,NUMHITS_ONE),
		new Move("Fly",TYPE_FLYING,CATEGORY_PHYSICAL,15,90,0.95,NUMHITS_ONE),
		new Move("Peck",TYPE_FLYING,CATEGORY_PHYSICAL,35,35,100,NUMHITS_ONE),
		new Move("Sky Attack",TYPE_FLYING,CATEGORY_PHYSICAL,5,140,0.9,NUMHITS_ONE),
		new Move("Wing Attack",TYPE_FLYING,CATEGORY_PHYSICAL,35,60,1,NUMHITS_ONE),
		new Move("Gust",TYPE_FLYING,CATEGORY_SPECIAL,35,40,1,NUMHITS_ONE)
	];

	MOVE_GHOST = [
		new StatMove("Confuse Ray",TYPE_GHOST,10,1,STAT_CONFUSED,false),
		new Move("Lick",TYPE_GHOST,CATEGORY_PHYSICAL,30,30,1,NUMHITS_ONE),
		new Move("Night Shade",TYPE_GHOST,CATEGORY_SPECIAL,15,15,1,NUMHITS_ONE)
	];

	MOVE_GRASS = [
		new Move("Razor Leaf",TYPE_GRASS,CATEGORY_PHYSICAL,25,55,0.95,NUMHITS_ONE),
		new Move("Vine Whip",TYPE_GRASS,CATEGORY_PHYSICAL,25,45,1,NUMHITS_ONE),
		new Move("Absorb",TYPE_GRASS,CATEGORY_SPECIAL,25,20,1,NUMHITS_ONE),
		new Move("Mega Drain",TYPE_GRASS,CATEGORY_SPECIAL,15,40,1,NUMHITS_ONE),
		new Move("Petal Dance",TYPE_GRASS,CATEGORY_SPECIAL,10,120,1,NUMHITS_ONE),
		new Move("Solar Beam",TYPE_GRASS,CATEGORY_SPECIAL,10,120,1,NUMHITS_ONE),
		new StatMove("Sleep Powder",TYPE_GRASS,15,1,STAT_ASLEEP,false),
		new StatMove("Spore",TYPE_GRASS,15,1,STAT_ASLEEP,false),
		new Move("Stun Spore",TYPE_GRASS,30,1,STAT_PARALYSIS,false)
	];

	MOVE_GROUND = [
		new Move("Bone Club",TYPE_GROUND,CATEGORY_PHYSICAL,20,65,0.85,NUMHITS_ONE),
		new Move("Bonemerang",TYPE_GROUND,CATEGORY_PHYSICAL,10,50,0.9,NUMHITS_ONE),
		new Move("Dig",TYPE_GROUND,CATEGORY_PHYSICAL,10,80,1,NUMHITS_ONE),
		new Move("Earthquake",TYPE_GROUND,CATEGORY_PHYSICAL,10,100,1,NUMHITS_ONE),
		new Move("Fissure",TYPE_GROUND,CATEGORY_PHYSICAL,5,1000,0.3,NUMHITS_ONE),
		new StatMove("Sand Attack",TYPE_GROUND,15,-10,STAT_ACC,false)
	];

	MOVE_ICE = [
		new Move("Ice Punch",TYPE_ICE,CATEGORY_PHYSICAL,15,75,1,NUMHITS_ONE),
		new Move("Aurora Beam",TYPE_ICE,CATEGORY_SPECIAL,20,65,1,NUMHITS_ONE),
		new Move("Blizzard",TYPE_ICE,CATEGORY_SPECIAL,5,110,0.7,NUMHITS_ONE),
		new Move("Ice Beam",TYPE_ICE,CATEGORY_SPECIAL,10,90,1,NUMHITS_ONE)
	];

	MOVE_NORMAL = [
		new Move("Barrage",TYPE_NORMAL,CATEGORY_PHYSICAL,20,15,0.85,NUMHITS_MULTIPLE),
		new Move("Body Slam",TYPE_NORMAL,CATEGORY_PHYSICAL,15,85,1,NUMHITS_ONE),
		new Move("Comet Punch",TYPE_NORMAL,CATEGORY_PHYSICAL,15,18,0.85,NUMHITS_MULTIPLE),
		new Move("Constrict",TYPE_NORMAL,CATEGORY_PHYSICAL,35,10,1,NUMHITS_ONE),
		new Move("Cut",TYPE_NORMAL,CATEGORY_PHYSICAL,30,50,0.95,NUMHITS_ONE),
		new StatMove("Defense Curl",TYPE_NORMAL,40,10,STAT_DEF,true),
		new Move("Dizzy Punch",TYPE_NORMAL,CATEGORY_PHYSICAL,10,70,1,NUMHITS_ONE),
		new Move("Double Slap",TYPE_NORMAL,CATEGORY_PHYSICAL,10,15,0.85,NUMHITS_MULTIPLE),
		new StatMove("Double Team",TYPE_NORMAL,15,-10,STAT_ACC,NUMHITS_ONE,false),
		new Move("Double-Edge",TYPE_NORMAL,CATEGORY_PHYSICAL,15,120,1,NUMHITS_ONE),
		new Move("Egg Bomb",TYPE_NORMAL,CATEGORY_PHYSICAL,10,100,0.75,NUMHITS_ONE),
		new StatMove("Flash",TYPE_NORMAL,20,-10,STAT_ACC,false),
		new StatMove("Focus Energy",TYPE_NORMAL,30,0.1,STAT_CRIT,true),
		new Move("Fury Attack",TYPE_NORMAL,CATEGORY_PHYSICAL,20,15,0.85,NUMHITS_MULTIPLE),
		new Move("Fury Swipes",TYPE_NORMAL,CATEGORY_PHYSICAL,15,18,0.8,NUMHITS_MULTIPLE),
		new StatMove("Glare",TYPE_NORMAL,30,1,STAT_PARALYSIS,false),
		new StatMove("Growl",TYPE_NORMAL,40,-10,STAT_ATK,false),
		new StatMove("Growth",TYPE_NORMAL,20,10,[STAT_ATK,STAT_SPATK],false),
		new Move("Guillotine",TYPE_NORMAL,CATEGORY_PHYSICAL,5,1000,0.3,NUMHITS_ONE),
		new StatMove("Harden",TYPE_NORMAL,30,10,STAT_DEF,true),
		new Move("Headbutt",TYPE_NORMAL,CATEGORY_PHYSICAL,15,70,1,NUMHITS_ONE),
		new Move("Horn Attack",TYPE_NORMAL,CATEGORY_PHYSICAL,25,65,1,NUMHITS_ONE),
		new Move("Horn Drill",TYPE_NORMAL,CATEGORY_PHYSICAL,5,1000,0.3,NUMHITS_ONE),
		new Move("Hyper Beam",TYPE_NORMAL,CATEGORY_SPECIAL,5,150,0.9,NUMHITS_ONE),
		new Move("Hyper Fang",TYPE_NORMAL,CATEGORY_PHYSICAL,15,80,0.9,NUMHITS_ONE),
		new StatMove("Leer",TYPE_NORMAL,30,-10,STAT_DEF,false),
		new StatMove("Lovely Kiss",TYPE_NORMAL,10,1,STAT_ASLEEP,false),
		new Move("Mega Kick",TYPE_NORMAL,CATEGORY_PHYSICAL,5,120,0.75,NUMHITS_ONE),
		new Move("Mega Punch",TYPE_NORMAL,CATEGORY_PHYSICAL,20,80,0.85,NUMHITS_ONE),
		new StatMove("Minimize",TYPE_NORMAL,10,-10,STAT_ACC,false),
		new Move("Pay Day",TYPE_NORMAL,CATEGORY_PHYSICAL,20,40,1,NUMHITS_ONE),
		new Move("Pound",TYPE_NORMAL,CATEGORY_PHYSICAL,35,40,1,NUMHITS_ONE),
		new Move("Quick Attack",TYPE_NORMAL,CATEGORY_PHYSICAL,30,40,1,NUMHITS_ONE),
		new Move("Rage",TYPE_NORMAL,CATEGORY_PHYSICAL,20,20,1,NUMHITS_ONE),
		new Move("Razor Wind",TYPE_NORMAL,CATEGORY_SPECIAL,10,80,1,NUMHITS_ONE),
		new StatMove("Recover",TYPE_NORMAL,10,NSA_MAXHP,STAT_HP,true),
		new Move("Scratch",TYPE_NORMAL,CATEGORY_PHYSICAL,35,40,1,NUMHITS_ONE),
		new StatMove("Screech",TYPE_NORMAL,40,-10,STAT_DEF,false),
		new Move("Self-Destruct",TYPE_NORMAL,CATEGORY_PHYSICAL,5,200,1,NUMHITS_ONE),
		new StatMove("Sharpen",TYPE_NORMAL,30,10,STAT_ATK,true),
		new StatMove("Sing",TYPE_NORMAL,15,1,STAT_ASLEEP,false),
		new Move("Slam",TYPE_NORMAL,CATEGORY_PHYSICAL,20,80,0.75,NUMHITS_ONE),
		new Move("Slash",TYPE_NORMAL,CATEGORY_PHYSICAL,20,70,1,NUMHITS_ONE),
		new StatMove("Smokescreen",TYPE_NORMAL,20,-10,STAT_ACC,false),
		new StatMove("Soft-Boiled",TYPE_NORMAL,10,NSA_MAXHP/2,STAT_HP,true),
		new Move("Sonic Boom",TYPE_NORMAL,CATEGORY_SPECIAL,20,20,10,NUMHITS_ONE),
		new Move("Spike Cannon",TYPE_NORMAL,CATEGORY_PHYSICAL,15,20,1,NUMHITS_MULTIPLE),
		new StatMove("Splash",TYPE_NORMAL,40,0,STAT_ATK,false),
		new Move("Stomp",TYPE_NORMAL,CATEGORY_PHYSICAL,20,65,1,NUMHITS_ONE),
		new Move("Strength",TYPE_NORMAL,CATEGORY_PHYSICAL,15,80,1,NUMHITS_ONE),
		new Move("Super Fang",TYPE_NORMAL,CATEGORY_PHYSICAL,10,NSA_MAXHP/2,0.9,NUMHITS_ONE), // FIXME: cut HP in half?
		new StatMove("Supersonic",TYPE_NORMAL,20,1,STAT_CONFUSED,false),
		new Move("Swift",TYPE_NORMAL,CATEGORY_SPECIAL,20,60,10,NUMHITS_ONE),
		new StatMove("Swords Dance",TYPE_NORMAL,20,20,STAT_ATK,true),
		new Move("Tackle",TYPE_NORMAL,CATEGORY_PHYSICAL,35,40,1,NUMHITS_ONE),
		new StatMove("Tail Whip",TYPE_NORMAL,30,-10,STAT_DEF,false),
		new Move("Take Down",TYPE_NORMAL,CATEGORY_PHYSICAL,20,90,0.85,NUMHITS_ONE),
		new Move("Tri Attack",TYPE_NORMAL,CATEGORY_SPECIAL,10,80,1,NUMHITS_ONE), // FIXME: May freeze, burn or paralyze
		new Move("Vice Grip",TYPE_NORMAL,CATEGORY_PHYSICAL,30,55,1,NUMHITS_ONE)
	];

	MOVE_POISON = [
		new Move("Poison Sting",TYPE_POISON,CATEGORY_PHYSICAL,35,15,1,NUMHITS_ONE),
		new Move("Acid",TYPE_POISON,CATEGORY_SPECIAL,30,40,1,NUMHITS_ONE),
		new Move("Sludge",TYPE_POISON,CATEGORY_SPECIAL,20,65,1,NUMHITS_ONE),
		new Move("Smog",TYPE_POISON,CATEGORY_SPECIAL,20,30,0.7,NUMHITS_ONE),
		new StatMove("Acid Armor",TYPE_POISON,20,20,STAT_DEF,true),
		new StatMove("Poison Gas",TYPE_POISON,40,1,STAT_POISONED,false),
		new StatMove("Poison Powder",TYPE_POISON,35,1,STAT_POISONED,false),
		new StatMove("Toxic",TYPE_POISON,10,1,STAT_POISONED,false)
	];

	MOVE_PSYCHIC = [
		new Move("Confusion",TYPE_PSYCHIC,CATEGORY_SPECIAL,25,50,1,NUMHITS_ONE),
		new Move("Psybeam",TYPE_PSYCHIC,CATEGORY_SPECIAL,20,65,1,NUMHITS_ONE),
		new Move("Psychic",TYPE_PSYCHIC,CATEGORY_SPECIAL,10,90,1,NUMHITS_ONE),
		new Move("Psywave",TYPE_PSYCHIC,CATEGORY_SPECIAL,15,randomInt(10,120),1,NUMHITS_ONE),
		new Move("Dream Eater",TYPE_PSYCHIC,15,NSA_MAXHP/4,STAT_HP,NUMHITS_ONE),
		new StatMove("Agility",TYPE_PSYCHIC,30,20,STAT_SPEED,true),
		new StatMove("Amnesia",TYPE_PSYCHIC,20,20,STAT_SPDEF,true),
		new StatMove("Barrier",TYPE_PSYCHIC,20,20,STAT_DEF,true),
		new StatMove("Hypnosis",TYPE_PSYCHIC,20,1,STAT_ASLEEP,false),
		new StatMove("Kineses",TYPE_PSYCHIC,15,10,STAT_ACC,false),
		new StatMove("Light Screen",TYPE_PSYCHIC,30,10,STAT_SPDEF,true),
		new StatMove("Meditate",TYPE_PSYCHIC,40,10,STAT_ATK,true),
		new StatMove("Reflect",TYPE_PSYCHIC,20,10,STAT_DEF,true)
	];


	MOVE_ROCK = [
		new Move("Rock Slide",TYPE_ROCK,CATEGORY_PHYSICAL,10,75,0.9,NUMHITS_ONE),
		new Move("Rock Throw",TYPE_ROCK,CATEGORY_PHYSICAL,15,50,0.9,NUMHITS_ONE)
	];

	MOVE_WATER = [
		new Move("Clamp",TYPE_WATER,CATEGORY_PHYSICAL,15,35,0.85,NUMHITS_MULTIPLE),
		new Move("Crabhammer",TYPE_WATER,CATEGORY_PHYSICAL,10,100,0.9,NUMHITS_ONE),
		new Move("Waterfall",TYPE_WATER,CATEGORY_PHYSICAL,15,80,1,NUMHITS_ONE),
		new Move("Bubble",TYPE_WATER,CATEGORY_SPECIAL,30,40,1,NUMHITS_ONE),
		new Move("Bubble Beam",TYPE_WATER,CATEGORY_SPECIAL,20,65,1,NUMHITS_ONE),
		new Move("Hydro Pump",TYPE_WATER,CATEGORY_SPECIAL,5,110,0.8,NUMHITS_ONE),
		new Move("Surf",TYPE_WATER,CATEGORY_SPECIAL,15,90,1,NUMHITS_ONE),
		new Move("Water Gun",TYPE_WATER,CATEGORY_SPECIAL,25,40,1,NUMHITS_ONE),
		new StatMove("Withdraw",TYPE_WATER,40,10,STAT_DEF,true)
	];

	// All moves
	MOVES = [MOVE_BUG, MOVE_DRAGON, MOVE_ELECTRIC, MOVE_FIGHT, MOVE_FIRE, MOVE_FLYING, MOVE_GHOST, MOVE_GRASS, MOVE_GROUND, MOVE_ICE, MOVE_NORMAL, MOVE_POISON, MOVE_PSYCHIC, MOVE_ROCK, MOVE_WATER];

	// Initialize the Pokemon objects in an array -- localized to implement the loadImage() function from p5.js
	POKEMON = [
		new Pokemon("bulbasaur",1,[TYPE_GRASS,TYPE_POISON]),
		new Pokemon("ivysaur",2,[TYPE_GRASS,TYPE_POISON]),
		new Pokemon("venusaur",3,TYPE_GRASS),
		new Pokemon("charmander",4,TYPE_FIRE),
		new Pokemon("charmeleon",5,TYPE_FIRE),
		new Pokemon("charizard",6,[TYPE_FIRE,TYPE_FLYING]),
		new Pokemon("squirtle",7,TYPE_WATER),
		new Pokemon("wartortle",8,TYPE_WATER),
		new Pokemon("blastoise",9,TYPE_WATER),
		new Pokemon("caterpie",10,TYPE_BUG),
		new Pokemon("metapod",11,TYPE_BUG),
		new Pokemon("butterfree",12,[TYPE_BUG,TYPE_FLYING]),
		new Pokemon("weedle",13,[TYPE_BUG,TYPE_POISON]),
		new Pokemon("kakuna",14,[TYPE_BUG,TYPE_POISON]),
		new Pokemon("beedrill",15,[TYPE_BUG,TYPE_POISON]),
		new Pokemon("pidgey",16,[TYPE_NORMAL,TYPE_FLYING]),
		new Pokemon("pidgeotto",17,[TYPE_NORMAL,TYPE_FLYING]),
		new Pokemon("pidgeot",18,[TYPE_NORMAL,TYPE_FLYING]),
		new Pokemon("rattata",19,TYPE_NORMAL),
		new Pokemon("raticate",20,TYPE_NORMAL),
		new Pokemon("spearow",21,[TYPE_NORMAL,TYPE_FLYING]),
		new Pokemon("fearow",22,[TYPE_NORMAL,TYPE_FLYING]),
		new Pokemon("ekans",23,TYPE_POISON),
		new Pokemon("arbok",24,TYPE_POISON),
		new Pokemon("pikachu",25,TYPE_ELECTRIC),
		new Pokemon("raichu",26,TYPE_ELECTRIC),
		new Pokemon("sandshrew",27,TYPE_GROUND),
		new Pokemon("sandslash",28,TYPE_GROUND),
		new Pokemon("nidoran-f",29,TYPE_PSYCHIC),
		new Pokemon("nidorina",30,TYPE_POISON),
		new Pokemon("nidoqueen",31,[TYPE_POISON,TYPE_GROUND]),
		new Pokemon("nidoran-m",32,TYPE_PSYCHIC),
		new Pokemon("nidorino",33,TYPE_POISON),
		new Pokemon("nidoking",34,[TYPE_POISON,TYPE_GROUND]),
		new Pokemon("clefairy",35,TYPE_NORMAL),
		new Pokemon("clefable",36,TYPE_NORMAL),
		new Pokemon("vulpix",37,TYPE_FIRE),
		new Pokemon("ninetales",38,TYPE_FIRE),
		new Pokemon("jigglypuff",39,TYPE_NORMAL),
		new Pokemon("wigglytuff",40,TYPE_NORMAL),
		new Pokemon("zubat",41,[TYPE_POISON,TYPE_FLYING]),
		new Pokemon("golbat",42,[TYPE_POISON,TYPE_FLYING]),
		new Pokemon("oddish",43,[TYPE_GRASS,TYPE_POISON]),
		new Pokemon("oddish",44,[TYPE_GRASS,TYPE_POISON]),
		new Pokemon("vileplume",45,[TYPE_GRASS,TYPE_POISON]),
		new Pokemon("paras",46,[TYPE_BUG,TYPE_GRASS]),
		new Pokemon("parasect",47,[TYPE_BUG,TYPE_GRASS]),
		new Pokemon("venonat",48,[TYPE_BUG,TYPE_POISON]),
		new Pokemon("venomoth",49,[TYPE_BUG,TYPE_POISON]),
		new Pokemon("diglett",50,TYPE_GROUND),
		new Pokemon("dugtrio",51,TYPE_GROUND),
		new Pokemon("meowth",52,TYPE_NORMAL),
		new Pokemon("persian",53,TYPE_NORMAL),
		new Pokemon("psyduck",54,TYPE_WATER),
		new Pokemon("golduck",55,TYPE_WATER),
		new Pokemon("mankey",56,TYPE_FIGHT),
		new Pokemon("primeape",57,TYPE_FIGHT),
		new Pokemon("growlithe",58,TYPE_FIRE),
		new Pokemon("arcanine",59,TYPE_FIRE),
		new Pokemon("poliwag",60,TYPE_WATER),
		new Pokemon("poliwhirl",61,TYPE_WATER),
		new Pokemon("poliwrath",62,[TYPE_WATER,TYPE_FIGHT]),
		new Pokemon("abra",63,TYPE_PSYCHIC),
		new Pokemon("kadabra",64,TYPE_PSYCHIC),
		new Pokemon("alakazam",65,TYPE_PSYCHIC),
		new Pokemon("machop",66,TYPE_FIGHT),
		new Pokemon("machoke",67,TYPE_FIGHT),
		new Pokemon("machamp",68,TYPE_FIGHT),
		new Pokemon("bellsprout",69,[TYPE_GRASS,TYPE_POISON]),
		new Pokemon("weepinbell",70,[TYPE_GRASS,TYPE_POISON]),
		new Pokemon("victreebel",71,[TYPE_GRASS,TYPE_POISON]),
		new Pokemon("tentacool",72,[TYPE_WATER,TYPE_POISON]),
		new Pokemon("tentacruel",73,[TYPE_WATER,TYPE_POISON]),
		new Pokemon("geodude",74,[TYPE_ROCK,TYPE_GROUND]),
		new Pokemon("graveler",75,[TYPE_ROCK,TYPE_GROUND]),
		new Pokemon("golem",76,[TYPE_ROCK,TYPE_GROUND]),
		new Pokemon("ponyta",77,TYPE_FIRE),
		new Pokemon("rapidash",78,TYPE_FIRE),
		new Pokemon("slowpoke",79,[TYPE_WATER,TYPE_PSYCHIC]),
		new Pokemon("slowbro",80,[TYPE_WATER,TYPE_PSYCHIC]),
		new Pokemon("magnemite",81,TYPE_ELECTRIC),
		new Pokemon("magneton",82,TYPE_ELECTRIC),
		new Pokemon("farfetchd",83,[TYPE_NORMAL,TYPE_FLYING]),
		new Pokemon("doduo",84,[TYPE_NORMAL,TYPE_FLYING]),
		new Pokemon("dodrio",85,[TYPE_NORMAL,TYPE_FLYING]),
		new Pokemon("seel",86,TYPE_WATER),
		new Pokemon("dewgong",87,[TYPE_WATER,TYPE_ICE]),
		new Pokemon("grimer",88,TYPE_POISON),
		new Pokemon("muk",89,TYPE_POISON),
		new Pokemon("shellder",90,TYPE_WATER),
		new Pokemon("cloyster",91,[TYPE_WATER,TYPE_ICE]),
		new Pokemon("gastly",92,[TYPE_GHOST,TYPE_POISON]),
		new Pokemon("haunter",93,[TYPE_GHOST,TYPE_POISON]),
		new Pokemon("gengar",94,[TYPE_GHOST,TYPE_POISON]),
		new Pokemon("onix",95,[TYPE_ROCK,TYPE_GROUND]),
		new Pokemon("drowzee",96,TYPE_PSYCHIC),
		new Pokemon("hypno",97,TYPE_PSYCHIC),
		new Pokemon("krabby",98,TYPE_WATER),
		new Pokemon("kingler",99,TYPE_WATER),
		new Pokemon("voltorb",100,TYPE_ELECTRIC),
		new Pokemon("electrode",101,TYPE_ELECTRIC),
		new Pokemon("exeggcute",102,[TYPE_GRASS,TYPE_PSYCHIC]),
		new Pokemon("exeggutor",103,[TYPE_GRASS,TYPE_PSYCHIC]),
		new Pokemon("cubone",104,TYPE_GROUND),
		new Pokemon("marowak",105,TYPE_GROUND),
		new Pokemon("hitmonlee",106,TYPE_FIGHT),
		new Pokemon("hitmonchan",107,TYPE_FIGHT),
		new Pokemon("lickitung",108,TYPE_NORMAL),
		new Pokemon("koffing",109,TYPE_POISON),
		new Pokemon("weezing",110,TYPE_POISON),
		new Pokemon("rhyhorn",111,[TYPE_GROUND,TYPE_ROCK]),
		new Pokemon("rhydon",112,[TYPE_GROUND,TYPE_ROCK]),
		new Pokemon("chansey",113,TYPE_NORMAL),
		new Pokemon("tangela",114,TYPE_GRASS),
		new Pokemon("kangaskhan",115,TYPE_NORMAL),
		new Pokemon("horsea",116,TYPE_WATER),
		new Pokemon("seadra",117,TYPE_WATER),
		new Pokemon("goldeen",118,TYPE_WATER),
		new Pokemon("seaking",119,TYPE_WATER),
		new Pokemon("staryu",120,TYPE_WATER),
		new Pokemon("starmie",121,[TYPE_WATER,TYPE_PSYCHIC]),
		new Pokemon("mr-mime",122,TYPE_PSYCHIC),
		new Pokemon("scyther",123,[TYPE_BUG,TYPE_FLYING]),
		new Pokemon("jynx",124,[TYPE_ICE,TYPE_PSYCHIC]),
		new Pokemon("electabuzz",125,TYPE_ELECTRIC),
		new Pokemon("magmar",126,TYPE_FIRE),
		new Pokemon("pinsir",127,TYPE_BUG),
		new Pokemon("tauros",128,TYPE_NORMAL),
		new Pokemon("magikarp",129,TYPE_WATER),
		new Pokemon("gyarados",130,[TYPE_WATER,TYPE_FLYING]),
		new Pokemon("lapras",131,[TYPE_WATER,TYPE_ICE]),
		new Pokemon("ditto",132,TYPE_NORMAL),
		new Pokemon("eevee",133,TYPE_NORMAL),
		new Pokemon("vaporeon",134,TYPE_WATER),
		new Pokemon("jolteon",135,TYPE_ELECTRIC),
		new Pokemon("flareon",136,TYPE_FIRE),
		new Pokemon("porygon",137,TYPE_NORMAL),
		new Pokemon("omanyte",138,[TYPE_WATER,TYPE_ROCK]),
		new Pokemon("omastar",139,[TYPE_WATER,TYPE_ROCK]),
		new Pokemon("kabuto",140,[TYPE_WATER,TYPE_ROCK]),
		new Pokemon("kabutops",141,[TYPE_WATER,TYPE_ROCK]),
		new Pokemon("aerodactyl",142,[TYPE_ROCK,TYPE_FLYING]),
		new Pokemon("snorlax",143,TYPE_NORMAL),
		new Pokemon("articuno",144,[TYPE_ICE,TYPE_FLYING]),
		new Pokemon("zapdos",145,[TYPE_ELECTRIC,TYPE_FLYING]),
		new Pokemon("moltres",146,[TYPE_FIRE,TYPE_FLYING]),
		new Pokemon("dratini",147,TYPE_DRAGON),
		new Pokemon("dragonair",148,TYPE_DRAGON),
		new Pokemon("dragonite",149,[TYPE_DRAGON,TYPE_FLYING]),
		new Pokemon("mewtwo",150,TYPE_PSYCHIC),
		new Pokemon("mew",151,TYPE_PSYCHIC)
	];
}

// Initialize objects
function setup() {
		createCanvas(1000,1000);

		// Pokemon setups
		for (var i=0; i<POKEMON.length; i++) {
			POKEMON[i].setup();
		}

		// Initialize other objects
		player = new Player();
		opponent = new Opponent();

		// Initialize selectedMove variable
		selectedMove = player.currentPokemon.moveset[0];

		// Set initial message
		textScreenMessage = "What will "+player.currentPokemon.name+" do?";
}

// Update UI, player and opponent
function draw() {
		clear(0,0,1000,1000);
		drawUI();

		player.update();
		opponent.update();
}

// menuScreen dependent mouseClick events
function mouseClicked() {
	if (menuScreen == MENU_MAIN) {
		if (mouseX > 25+(WIDTH-50)/2 && mouseX < 25+(WIDTH-50)/2 + (WIDTH-50)/4 && mouseY > HEIGHT-175 && mouseY < HEIGHT-100) {
			menuScreen = MENU_FIGHT;
		}

		if (textScreenFreezeActive) {
			textScreenFreezeActive = false;
			attack();
		}
	}
	else if (menuScreen == MENU_FIGHT) {
		if (mouseX > 25 && mouseX < 25+(WIDTH-50)/4 && mouseY > HEIGHT-175 && mouseY < HEIGHT-100) {
			selectedMove = player.currentPokemon.moveset[0];
		}
		if (mouseX > 25+(WIDTH-50)/4 && mouseX < 25+(WIDTH-50)/2 && mouseY > HEIGHT-175 && mouseY < HEIGHT-100) {
			selectedMove = player.currentPokemon.moveset[1];
		}
		if (mouseX > 25 && mouseX < 25+(WIDTH-50)/4 && mouseY > HEIGHT-100 && mouseY < HEIGHT-25) {
			selectedMove = player.currentPokemon.moveset[2];
		}
		if (mouseX > 25+(WIDTH-50)/4 && mouseX < 25+(WIDTH-50)/2 && mouseY > HEIGHT-100 && mouseY < HEIGHT-25) {
			selectedMove = player.currentPokemon.moveset[3];
		}

		// Back button
		if (mouseX > (3*WIDTH-50)/4+(WIDTH-50)/4-75 && mouseX < (3*WIDTH-50)/4+(WIDTH-50)/4-5 && mouseY > HEIGHT-45 && mouseY < HEIGHT-25) {
			menuScreen = MENU_MAIN;
		}

		// GO! button
		if (mouseX > 3*(WIDTH-50)/4-50 && mouseX < 3*(WIDTH-50)/4+100 && mouseY > HEIGHT-75 && mouseY < HEIGHT-35 && selectedMove.pp > 0) {
			textScreenMessage = player.currentPokemon.name+" used "+selectedMove.name;
			menuScreen = MENU_MAIN;
			textScreenFreezeActive = true;
		}
	}
}
