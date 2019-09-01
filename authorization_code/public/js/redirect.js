$("#body2").hide();

const $rdr = $('.redirect');
$rdr.on('click',() =>
{
	// $('#redirect').fadeOut(150);
	$(".row-fluid-3").show().delay(500).hide(0);
	$("#body1").delay(10).hide();
    window.location = "https://accounts.spotify.com/authorize?client_id=94f148c89427471dbde46bd7b3f2af43&redirect_uri=https:%2F%2Fspotifysongcurator.herokuapp.com%2F&scope=user-top-read%20user-read-private%20playlist-modify-public%20playlist-modify-private%20user-read-email&response_type=token&show_dialog=true";
    // window.location = "https://accounts.spotify.com/authorize?client_id=94f148c89427471dbde46bd7b3f2af43&redirect_uri=http:%2F%2Flocalhost:5000&scope=user-top-read%20user-read-private%20playlist-modify-public%20playlist-modify-private%20user-read-email&response_type=token&show_dialog=true";
		$("#body1").show(); //might be unnecessary
});
