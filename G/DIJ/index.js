// CONSTANTS
var ALPHABET = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var NODESIZE = 16;

// SCREENS
var TITLE = 0;
var MAIN = 1;
var END = 2;

// Variables
var nodes = [];
var edges = [];
var checkedEdges = [];
var titleButtonAlphas = [255,255,255];
var current;
var screen;


function setup() {
	createCanvas(1024,576);
	screen = TITLE;
}

function draw() {
	background(255);

	if (screen == TITLE) {
		fill(50,255,80,150);
		noStroke();
		rect(20,20,width-40,height-40);

		fill(255);
		textSize(48);
		textAlign(CENTER, CENTER);
		text("Dijkstra's Algorithm Simulator", width/2, 100);
		
		if (mouseX >= width/2-300 && mouseX <= width/2-140 && mouseY >= 400 && mouseY <= 500) { fill(50,255,80,125); }
		else { fill(50,255,80,255); }
	
		rect(width/2-300, 400, 160, 100);
		
		if (mouseX >= width/2-80 && mouseX <= width/2+80 && mouseY >= 400 && mouseY <= 500)	{ fill(50,255,80,125); }
		else { fill(50,255,80,255); }
		
		rect(width/2-80, 400, 160, 100);

		if (mouseX >= width/2+140 && mouseX <= width/2+300 && mouseY >= 400 && mouseY <= 500) { fill(50,255,80,125); }
		else { fill(50,255,80,255); }
		
		rect(width/2+140, 400, 160, 100);
		
		fill(255);
		textSize(32);
		text("3 nodes",width/2-220,450);
		text("4 nodes",width/2,450);
		text(">4 nodes",width/2+220,450);
	}
	else if (screen == MAIN) {
		// Draw nodes
		for (var i=0; i<nodes.length; i++) {
			nodes[i].update();
		}

		// Node labels
		updateNodeLabels();

		// Draw edges
		for (var i=0; i<edges.length; i++) {
			edges[i].update();
		}
	}
	else if (screen == END) {

	}
}

function keyPressed() {
	// Fullscreen toggle
	if (key == 'F') { fullscreen(!fullscreen()); }
	if (key == ' ') { stepForward(); }
}

function mouseMoved() {

	
}

function mousePressed() {
	if (mouseY > 400 && mouseY < 500) {
		if (mouseX > width/2-300 && mouseX < width/2-140)	{
			setupMain(3);
		}
		if (mouseX > width/2-80 && mouseX < width/2+80)	{
			setupMain(4);
		}
		if (mouseX > width/2+140 && mouseX < width/2+300)	{
			setupMain(Math.round(random(5,26)));
		}
	}
}

function setupMain(num) {
	// Create Nodes
	for (var i=0; i<num; i++) {
		nodes.push(new Node());
	}

	// Create edges
	connectNodes();
	
	// Set current
	current = nodes[0];
	current.dist = 0;

	screen = MAIN;
}

function connectNodes() {
	for (var i=0; i<nodes.length; i++) {
		for (var j=0; j<nodes.length; j++) {
			// Can't connect a node to itself / an already connected edge
			if (j <= i) { continue; }

			// Create a new edge between nodes[i] and nodes[j]
			edges.push(new Edge(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y));
		}
	}
}

function updateNodeLabels() {
	for (var i=0; i<nodes.length; i++) {
		// Node label
		fill(0);
		text(ALPHABET[i] + " ("+nodes[i].dist+")", nodes[i].x+NODESIZE/2, nodes[i].y-NODESIZE);
	}
}

function stepForward() {
	var leastCost = 10000;
	var connectedNode;
	var confirmedActive;

	for (var i=0; i<edges.length; i++) {

		if (checkedEdges.length == nodes.length-1) {
			current.used = true;

			var tempLeastCost = 10000;
			var tempCurrent;
			for (var j=0; j<nodes.length; j++) {
				if (!nodes[j].used && current != nodes[j] && nodes[j].dist < tempLeastCost) {
					tempLeastCost = nodes[j].dist;
					tempCurrent = nodes[j];
				}
			}
			current = tempCurrent;
			checkedEdges = [];
			return;
		}

		// If current = an (x,y) in edges[i], then
		if (current.x == edges[i].x1 && current.y == edges[i].y1) {
			
			// Loop thru nodes[] to find the node connected to current by the edge
			for (var j=0; j<nodes.length; j++) {

				// If the node selected by the for loop matches the x and y of edges[i], then
				if (nodes[j].x == edges[i].x2 && nodes[j].y == edges[i].y2) {

					// By default, confirmedActive is true. If the edge has been checked, it is turned off.
					confirmedActive = true;

					for (var k=0; k<checkedEdges.length; k++) {
						if (edges[i] == checkedEdges[k]) { confirmedActive = false; }
					}

					// Set connected node, update leastCost
					if (confirmedActive && current.dist + edges[i].cost < leastCost) { 
						connectedNode = nodes[j]; 
						leastCost = current.dist + edges[i].cost;
					}
				}
			}
		}
		
		if (current.x == edges[i].x2 && current.y == edges[i].y2) {
			// Loop thru nodes[] to find the node connected to current by the edge
			for (var j=0; j<nodes.length; j++) {

				// If the node selected by the for loop matches the x and y of edges[i], then
				if (nodes[j].x == edges[i].x1 && nodes[j].y == edges[i].y1) {

					// By default, confirmedActive is true. If the edge has been checked, it is turned off.
					confirmedActive = true;

					for (var k=0; k<checkedEdges.length; k++) {
						if (edges[i] == checkedEdges[k]) { confirmedActive = false; }
					}

					// Set connected node, update leastCost
					if (confirmedActive && current.dist + edges[i].cost < leastCost) { 
						connectedNode = nodes[j]; 
						leastCost = current.dist + edges[i].cost;
					}
				}
			}
		}
	}

	for (var i=0; i<edges.length; i++) {
		// Check for edge cost and update
		if (current.dist + edges[i].cost == leastCost) {
			
			if (current.dist + edges[i].cost < connectedNode.dist) {
				// Update node with new cost
				connectedNode.dist = leastCost;
			}

			// Add edge to the list of checked edges
			checkedEdges.push(edges[i]);

			print("LEAST AVAILABLE EDGE: "+edges[i].cost);
		}	
	}	

	if (leastCost + current.dist < connectedNode.dist) {
		connectedNode.dist = leastCost + current.dist;
		connectedNode.thru = current;
	}
}

function edgeCost(edge) {
	return Math.floor(random(1,1000));
}

var Node = function() {
	this.x = random(width-NODESIZE);
	this.y = random(height-NODESIZE);
	this.dist = 10000;
	this.used = false;
	this.thru;
	
	this.update = function() {
		// Blue if current, red otherwise
		if (this == current) { fill(0,0,255); }
		else { fill(255,0,0); }

		// Draw node
		rect(this.x,this.y,NODESIZE,NODESIZE,NODESIZE/2);
	}
}

var Edge = function(x1,y1,x2,y2) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.cost = edgeCost(this);

	this.update = function() {
		// Text settings
		textSize(24);
		textAlign(CENTER, CENTER);

		// Draw edge
		stroke(0,0,0,50);
		line(this.x1+NODESIZE/2,this.y1+NODESIZE/2,this.x2+NODESIZE/2,this.y2+NODESIZE/2);
		
		// Node distance
		fill(175,175,175);
		noStroke();
		text(this.cost, (this.x1+NODESIZE/2+this.x2+NODESIZE/2)/2, (this.y1+NODESIZE/2+this.y2+NODESIZE/2)/2);
	}
}