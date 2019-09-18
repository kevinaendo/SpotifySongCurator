$(document).ready(function() {
    async function getPlaylists() {
        try {
            var req = new XMLHttpRequest();
            req.open('GET', 'https://spotifysongcurator.herokuapp.com/playlists', true);
            req.onload = function () {
                var data = JSON.parse(this.response)
                if (req.status >= 200 && req.status < 400) {
                    console.log(data);
                    let layout = ['left','middle','right'];

                    for (var i = 0; i < 3; i++){
                        let url = data[data.length-1-i].spotify_id;
                        document.getElementById(layout[i]).innerHTML = '<iframe class = "col-xs-12" id =' + ' "play_button" src="' + url + '"width="400" height="450" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
                    }
                } else {
                    console.log('error')
                }
            }
            req.send();
        } catch (error) {
            console.log(error);
        }
    }

    getPlaylists();
});
