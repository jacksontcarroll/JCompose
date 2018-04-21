
function randomizeTitleEnding() {
	var endings = [
		"edy",
		"puters",
		"position"
	];

	document.getElementsByClassName('ending')[0].innerHTML = endings[Math.floor(Math.random()*endings.length)];
}

$(document).ready(function(){

	// Element hovering color changes

	$('.g').on('mouseover', function(){
		$('#gimg').attr("src","src/img/I_games-hover.gif");
		$('.jc').css('color','#6DBE45');
		$('#gcontent').css('color','#6DBE45');
	});

	$('.g').on('mouseleave', function(){
		$('#gimg').attr("src","src/img/I_games.png");
		$('.jc').css('color','#ff5d5d');
		$('#gcontent').css('color','#FFFFFF');
	});

	$('.m').on('mouseover', function(){
		$('#mimg').attr("src","src/img/I_music-hover.gif");
		$('.jc').css('color','#568fea');
		$('#mcontent').css('color','#568fea');
	});

	$('.m').on('mouseleave', function(){
		$('#mimg').attr("src","src/img/I_music.png");
	  $('.jc').css('color','#ff5d5d');
		$('#mcontent').css('color','#FFFFFF');
	});

	$('.c').on('mouseover', function(){
		$('#cimg').attr("src","src/img/I_comedy-hover.gif");
		$('.jc').css('color','#e0de31');
		$('#ccontent').css('color','#e0de31');
	});

	$('.c').on('mouseleave', function(){
		$('#cimg').attr("src","src/img/I_comedy.png");
		$('.jc').css('color','#ff5d5d');
		$('#ccontent').css('color','#FFFFFF');
	});
});
