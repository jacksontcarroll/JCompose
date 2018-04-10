// Images
var img_email = new Image();
var img_youtube = new Image();
var img_twitter = new Image();
var img_instagram = new Image();
var img_twitch = new Image();
var img_steam = new Image();
var img_chess = new Image();
var img_spotify = new Image();
var img_soundcloud = new Image();

function preloadUniversalImages() {
	img_email.src = "src/img/universal/email.png";
	img_youtube.src = "src/img/universal/youtube.png";
	img_twitter.src = "src/img/universal/twitter.png";
	img_instagram.src = "src/img/universal/instagram.png";
	img_twitch.src = "src/img/universal/twitch.png";
	img_steam.src = "src/img/universal/steam.png";
	img_chess.src = "src/img/universal/chess.png";
	img_spotify.src = "src/img/universal/spotify.png";
	img_soundcloud.src = "src/img/universal/soundcloud.png";
}

function setLastUpdatedInformation() {
	$.get("src/text/changelog.txt", function(data) {
		var lines = data.split("\n");
		var current = lines.slice(-2)[0];
		var sections = current.split(" - ");
		var year = "20"+sections[1].split("/")[2];
		document.getElementsByClassName('copyright')[0].innerHTML = "Copyright <span class='themeColor'>&copy</span> "+year+" JCompose | "+sections[0]+" | Last Updated "+sections[1];
	});
}
