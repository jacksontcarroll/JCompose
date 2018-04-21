/*
	ELEMENT CREATION:
	- Every 4 games, create a new row (.contentContainer)
	- For every game, create a span (id: ID in games.txt; class: content bordered)
	- For every game, append to the span an img (src: "src/img/games/"+id+".png")
	- If less than a multiple of 4 games are programmed, add a blank game and label
*/

$(document).ready(function(){

	$.get("src/text/games.txt", function(data) {
		var lines = data.split("\n");
		var totalGames = lines.length/7;
		var totalRows = Math.ceil(totalGames/4);

		for (var i=0; i<totalRows; i++) {
			var $imgContainer = $("<div/>", {"class": "contentContainer"});
			var $labelContainer = $("<div/>", {"class": "contentContainer"});

			for (var j=4*i; j<4*(i+1); j++) {
				// If the game is non-existant, make it a blank shell
				if (j > totalGames-1) {
					var $imgSpan = $("<span/>", {"class": "content"});
					var $label = $("<span/>", {"class": "contentDescriptor"});

					$imgContainer.append($imgSpan);
					$labelContainer.append($label);

					continue;
				}

				var id = lines[(j*7)+1].slice(3);
				var name = lines[(j*7)+2].slice(5);

				var $imgSpan = $("<span/>", {
					"id": id,
					"class": "content bordered",
					"onclick": "updateGamePanel(this)"
				});
				var $img = $("<img/>", {"src": "src/img/G_"+id+".png"});
				var $label = $("<span/>", {"class": "contentDescriptor"});

				// Update gamePanel with most recent game information

				if (i == 0 && j == 0) {
					var desc = lines[(j*7)+3].slice(5);
					var code = lines[(j*7)+4].slice(5);
					var art = lines[(j*7)+5].slice(4);
					var music = lines[(j*7)+6].slice(6);

					$("#gameGif img").attr("src","src/img/G_"+id+".gif");
					$("#gameName").html(name);
					$("#gameDesc").html(desc);
					$("#gameCodeCreds span").html(code);
					$("#gameArtCreds span").html(art);
					$("#gameMusicCreds span").html(music);
					$("#playButton a").attr("href","src/html/"+id+".html");
				}

				$imgSpan.append($img);
				$imgContainer.append($imgSpan);

				$label.html(name);
				$labelContainer.append($label);
			}
			$("#gamesList").append($imgContainer);
			$("#gamesList").append($labelContainer);
		}
	});
});

$("#playButton").on("click",function(){
	window.open($("#playButton a").attr("href"),"_self");
});

/*
	UPDATE #GAMEPANEL
	On content click:
		- Update gameGif, gameName, gameDesc, gameCodeCreds, gameArtCreds, gameMusicCreds, and playButton
*/

function updateGamePanel(obj) {

	$.get("src/text/games.txt", function(data){
		var lines = data.split("\n");
		for (var i=0; i<lines.length; i++) {
			if (obj.id == lines[(i*7)+1].slice(3)) {

				var id = lines[(i*7)+1].slice(3);
				var name = lines[(i*7)+2].slice(5);
				var desc = lines[(i*7)+3].slice(5);
				var code = lines[(i*7)+4].slice(5);
				var art = lines[(i*7)+5].slice(4);
				var music = lines[(i*7)+6].slice(6);

				$("#gameGif img").attr("src","src/img/G_"+id+".gif");
				$("#gameName").html(name);
				$("#gameDesc").html(desc);
				$("#gameCodeCreds span").html(code);
				$("#gameArtCreds span").html(art);
				$("#gameMusicCreds span").html(music);
				$("#playButton a").attr("href","src/html/"+id+".html");

				break;
			}
		}
	});
}
