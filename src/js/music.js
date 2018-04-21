/*
	ELEMENT CREATION:
	- 3 songs to a row
*/

$(document).ready(function(){

	$.get("src/text/music.txt", function(data) {
		var lines = data.split("\n");
		var totalSongs = lines.length/4;
		var totalRows = Math.ceil(totalSongs/3);

		for (var i=0; i<totalRows; i++) {
			var $row = $("<div/>", {"class": "contentContainer"});

			for (var j=3*i; j<3*(i+1); j++) {
				// If the song is non-existant, make it a blank shell
				if (j > totalSongs-1) {
					var $songBox = $("<span/>", {"class": "songBox"}).css("visibility","hidden");
					$row.append($songBox);

					continue;
				}

				// Check for viewability
				var viewable = (lines[(j*4)+3].slice(5) == "T") ? true : false;

				// Find ID and Name in music.txt
				var id = lines[(j*4)+1].slice(3);
				var name = lines[(j*4)+2].slice(5);

				// Top level containers
				var $songBox = $("<span/>", {"class": "songBox"});
				var $metaBox = $("<span/>", {"class": "contentContainer"});
				var $optionBox = $("<span/>", {"class": "contentContainer"});

				// Meta information
				var $songName = $("<span/>", {"class": "contentDescriptor songName"});

				// Action links
				var $play = $("<span/>", {
					"id":"p_"+id,
					"class": "contentDescriptor play",
					"onclick": "playOrPause(this)"
				});
				var $download = $("<span/>", {"class": "contentDescriptor download"});
				var $downloadA = $("<a/>", {"href":"src/aud/M_"+id+".mp3"});
				var $view = $("<span/>", {"class": "contentDescriptor view"});
				var $viewA = $("<a/>", {"href": "src/pdf/"+id+".pdf"});

				// Find MP3 audio file
				var song = document.createElement("audio");
				song.setAttribute("src","src/aud/M_"+id+".mp3");
				song.setAttribute("id",id);
				song.setAttribute("visibility","hidden");

				// Set contents of each element
				$songName.html(name);
				$play.html("Play");
				$downloadA.html("Download");
				$viewA.html("View");

				// Append
				$download.append($downloadA);
				$view.append($viewA);
				$metaBox.append($songName);
				$metaBox.append(song);
				$optionBox.append($play);
				$optionBox.append($download);

				// Apend only if viewable
				if (viewable) {
					$optionBox.append($view);
				}

				$songBox.append($metaBox);
				$songBox.append($optionBox);
				$row.append($songBox);
			}
			$("#musicContainer").append($row);
		}
	});
});

function playOrPause(obj) {
	$.get("src/text/music.txt", function(data){
		var lines = data.split("\n");
		for (var i=0; i<lines.length; i++) {
			if (obj.id == "p_"+lines[i].slice(3)) {

				var id = obj.id.slice(2);
				var song = document.getElementById(id);

				if (obj.innerHTML == "Play") {
		    	song.play();
					obj.innerHTML = "Pause";
					console.log(song.paused);
		    }
				else {
		    	song.pause();
					obj.innerHTML = "Play";
		    }

				break;
			}
		}
	});
}
