/*
	ELEMENT CREATION:
	- In $('#comedyList'), 2 columnContainer divs
  - First columnContainer: <img> , <span class="author">NAME</span>
  - Second columnContainer: <span class="joke">JOKE</span> <span class="author">NAME</span>
*/

$(document).ready(function(){
	$.get("src/text/comedy.txt", function(data) {
		var lines = data.split("\n");

    var $comicContainer = $("<div/>", {"class": "columnContainer"});
    var $jokeContainer = $("<div/>", {"class": "columnContainer"});

    for (i=1; i<lines.length; i+=4) {
      if (lines[i].slice(5) == "COMIC") {
        var id = lines[i+1].slice(3);
        var name = lines[i+2].slice(5);
        var $img = $("<img/>", {"src": "src/img/C_"+id+".png"});
        var $authorSpan = $("<span/>", {"class": "author"});

        $authorSpan.html(name);

        $comicContainer.append($img);
        $comicContainer.append($authorSpan);
      }
      else if (lines[i].slice(5) == "JOKE") {
        var joke = lines[i+1].slice(5);
        var name = lines[i+2].slice(7);
        var $jokeSpan = $("<span/>", {"class": "joke"});
        var $authorSpan = $("<span/>", {"class": "author"});

        $jokeSpan.html("\""+joke+"\"");
        $authorSpan.html("-"+name);

        $jokeContainer.append($jokeSpan);
        $jokeContainer.append($authorSpan);
      }
    }

    $('#comedyList').append($comicContainer);
    $('#comedyList').append($jokeContainer);
	});
});
