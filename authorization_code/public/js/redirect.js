$("#body2").hide();
const $rdr = $('.redirect');
$rdr.on('click',() =>
{
    window.location = "https://accounts.spotify.com/authorize?client_id=94f148c89427471dbde46bd7b3f2af43&redirect_uri=http:%2F%2Flocalhost:8888&scope=user-top-read%20user-read-private%20playlist-modify-public%20playlist-modify-private%20user-read-email&response_type=token&show_dialog=true";
});