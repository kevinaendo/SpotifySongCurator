    $(document).ready(function() {

        var hashParams = {};
                var e, r = /([^&;=]+)=?([^&;]*)/g,
                    q = window.location.hash.substring(1);
                while (e = r.exec(q)) {
                    hashParams[e[1]] = decodeURIComponent(e[2]);
                }


        if (Object.entries(hashParams).length> 0){
            $("#body1").delay(10).hide();
            $(".row-fluid-3").show().delay(500).hide(0);
            $("#body2").delay(500).fadeIn(0);
        }
        hashParams = "";

        var genre = "";

        (function () {

            /**
             * Obtains parameters from the hash of the URL
             * @return Object
             */
            const $hiphopBtn = $('#Hip-Hop');
            const $rbBtn = $('#RB');
            const $edmBtn = $('#EDM');

            $rbBtn.click(function () {
                genre = 'r&b';
                $rbBtn.fadeOut(150);
                $('.container-fluid-genre').hide();
                $('.container-fluid-selection').show();
                songRecommender();

            });
            $edmBtn.click(function () {
                genre = 'edm';
                $edmBtn.fadeOut(150);
                $('.container-fluid-genre').hide();
                $('.container-fluid-selection').show();
                songRecommender();

            });

            $hiphopBtn.click(function () {
                genre = 'hip-hop';
                $hiphopBtn.fadeOut(150);
                $('.container-fluid-genre').hide();
                $('.container-fluid-selection').show();
                songRecommender();

            });

            console.log(genre);
        })();

        function songRecommender() {
            console.log(this.genre);

            function getHashParams() {
                var hashParams = {};
                var e, r = /([^&;=]+)=?([^&;]*)/g,
                    q = window.location.hash.substring(1);
                while (e = r.exec(q)) {
                    hashParams[e[1]] = decodeURIComponent(e[2]);
                }
                return hashParams;
            }

            var userProfileSource = document.getElementById('user-profile-template').innerHTML,
                userProfileTemplate = Handlebars.compile(userProfileSource),
                userProfilePlaceholder = document.getElementById('user-profile');
            var oauthSource = document.getElementById('oauth-template').innerHTML,
                oauthTemplate = Handlebars.compile(oauthSource),
                oauthPlaceholder = document.getElementById('oauth');

            var params = getHashParams();
            console.log(params);

            var access_token = params.access_token,
                refresh_token = params.refresh_token,
                error = params.error;

            var user_id = "";



            if (error) {
                alert('There was an error during the authentication');
            } else {

                if (access_token) {
                    // render oauth info
                    oauthPlaceholder.innerHTML = oauthTemplate({
                        access_token: access_token,
                        refresh_token: refresh_token
                    });

                    $.ajax({
                        url: 'https://api.spotify.com/v1/me',
                        headers: {
                            'Authorization': 'Bearer ' + access_token
                        },
                        success: function (response) {
                            userProfilePlaceholder.innerHTML = userProfileTemplate(response);
                            user_id = response.id;

                            $('#login').hide();
                            $('#loggedin').show();
                        }
                    });

                    var tracklist = [];
                    var playlist = [];
                    var idlist = [];
                    var recList = [];

                    req = new XMLHttpRequest();
                    req2 = new XMLHttpRequest();
                    req3 = new XMLHttpRequest();
                    req4 = new XMLHttpRequest();
                    req5 = new XMLHttpRequest();
                    req6 = new XMLHttpRequest();

                    req.open("GET", "https://api.spotify.com/v1/me/top/artists", true);
                    req.setRequestHeader('Authorization', 'Bearer ' + access_token);
                    req.extraInfo = genre;
                    req.onload = function (genre) {
                        console.log(req.extraInfo);

                        json = JSON.parse(req.responseText);

                        let arr = json['items'];
                        console.log(arr);
                        var artistList = [];
                        for (var i = 0; i < arr.length; ++i) {
                            if (arr[i]['genres'].indexOf(req.extraInfo) >= 0) {
                                artistList.push(arr[i]['id']);
                            }
                        }

                        var seedArtists = "";

                        for (var g = 0; g < artistList.length; g++) {
                            seedArtists += artistList[g] + "%2C";
                        }

                        if (seedArtists.length == 0) {
                            console.log(req.extraInfo);
                            if (req.extraInfo == "r&b") {
                                seedArtists = "2h93pZq0e7k5yf4dywlkpM%2C";
                            } else if (req.extraInfo == "hip-hop") {
                                seedArtists = "0Y5tJX1MQlPlqiwlOH1tJY%2C";
                            } else {
                                seedArtists = "60d24wfXkVzDSfLS6hyCjZ%2C";
                            }
                        }
                        var idStr = seedArtists.substring(0, (seedArtists.length - 3));
                        var bigStr = "https://api.spotify.com/v1/recommendations?limit=25&market=US&seed_genres=" + req.extraInfo + "&seed_artists=" + idStr;

                        if (seedArtists.length > 0) {
                            req2.open("GET", bigStr, true);
                            req2.setRequestHeader('Authorization', 'Bearer ' + access_token);
                            req2.send();
                            req2.onload = function () {
                                json2 = JSON.parse(req2.responseText);
                                console.log(json2);
                                let arr2 = json2['tracks'];
                                for (var h = 0; h < arr2.length; h++) {
                                    tracklist.push(arr2[h].external_urls.spotify);
                                    idlist.push(arr2[h].id);
                                }

                                url = tracklist[0].substring(0, 25) + "embed/" + tracklist[0].substring(25, tracklist[0].length);
                                document.getElementById('song_info').innerHTML = '<iframe class = "col-xs-12" id = "play_button" src="' + url + '" width="400" height="450" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';

                                var i = 1;
                                console.log(idlist);
                                document.getElementById('no').addEventListener('click', function () {
                                    console.log(i);
                                    console.log(idlist[i - 1]);
                                    url = tracklist[i].substring(0, 25) + "embed/" + tracklist[i].substring(25, tracklist[i].length);
                                    document.getElementById('song_info').innerHTML = '<iframe class = "col-xs-12" id = "play_button" src="' + url + '" width="400" height="450" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
                                    i = i + 1;
                                });

                                // Updates spotify play button when green yes button is clicked
                                document.getElementById('yes').addEventListener('click', function () {
                                    console.log(i);
                                    playlist.push(idlist[i - 1]);
                                    console.log(idlist[i - 1]);
                                    console.log(playlist);

                                    if (playlist.length >= 5) {
                                        $("#welcome").hide();
                                        $("#yes").hide();
                                        $("#no").hide();
                                        $("#song_info").hide();

                                        console.log(playlist);
                                        var seedTracks = "";

                                        for (var j = 0; j < playlist.length; j++) {
                                            seedTracks += playlist[j] + "%2C";
                                            recList += "spotify%3Atrack%3A" + playlist[j] + "%2C";
                                            console.log(recList);
                                        }

                                        var trackStr = seedTracks.substring(0, (seedTracks.length - 3));
                                        var newStr =
                                            "https://api.spotify.com/v1/recommendations?limit=20&market=US&seed_tracks=" + trackStr;
                                        console.log(newStr);


                                        req3.open("GET", newStr, true);
                                        req3.setRequestHeader('Authorization', 'Bearer ' + access_token);
                                        req3.send();
                                        req3.onload = function () {
                                            json3 = JSON.parse(req3.responseText);
                                            console.log(json3);
                                            let arr3 = json3['tracks'];
                                            console.log(arr3);

                                            for (var z = 0; z < arr3.length; z++) {
                                                if (z < arr3.length - 1) {
                                                    recList += "spotify%3Atrack%3A" + arr3[z].id + "%2C";
                                                } else {
                                                    recList += "spotify%3Atrack%3A" + arr3[z].id
                                                }
                                            }

                                            console.log(user_id);
                                            req4.open("POST",
                                                "https://api.spotify.com/v1/users/" + user_id + "/playlists", true);
                                            req4.setRequestHeader('Authorization', 'Bearer ' + access_token);
                                            req4.setRequestHeader('Content-Type', 'application/json');
                                            req4.send("{\"name\":\"A Dope Playlist by Spotify Song Curator\", \"public\":false}");

                                            req4.onload = function () {
                                                json4 = JSON.parse(req4.responseText);
                                                console.log(json4);
                                                console.log(recList);

                                                req5.open("POST", "https://api.spotify.com/v1/playlists/" + json4.id + "/tracks?uris=" + recList, true);
                                                req5.setRequestHeader('Authorization', 'Bearer ' + access_token);
                                                req5.setRequestHeader('Content-Type', 'application/json');
                                                req5.send();
                                                req5.onload = function () {
                                                    json5 = JSON.parse(req5.responseText);
                                                    console.log(json5);
                                                    console.log(json4.id);
                                                    req6.open("GET", "https://api.spotify.com/v1/playlists/" + json4.id, true);
                                                    req6.setRequestHeader('Authorization', 'Bearer ' + access_token);
                                                    req6.send();
                                                    req6.onload = function () {
                                                        json6 = JSON.parse(req6.responseText);
                                                        console.log(json6);
                                                        padding = 500;
                                                        width = screen.width - padding;
                                                        height = screen.height - 400;
                                                        url = json6.external_urls.spotify.substring(0, 25) + "embed/" + json6.external_urls.spotify.substring(25, json6.external_urls.spotify.length);
                                                        $(".container-fluid-selection").html('<h1 id="choose" style="color: black" class = \'text-center\'>Check Out Your New Playlist!</h1><br><div class =\'col-sm-12\' id = \'song_info\'></div>');
                                                        $("#song_info").html('<iframe id = "play_button" src="' + url + '" width="' + width + '" height="' + height + '" frameborder="100" allowtransparency="true" allow="encrypted-media"></iframe><br><button type="button" class="create" id="fade redirect" onclick="window.location.reload()">Create Another Playlist</button><br><br><footer id="footer">Copyright © 2019 Created by <a id = "profile" href="https://www.linkedin.com/in/kevin-endo-b22238155/" target="_blank">Kevin Endo</a>, <a id = "profile" + href="https://www.linkedin.com/in/jordan-mercado-5905a5136/" target="_blank">Jordan Mercado</a> & <a id = "profile" href="https://gautammehta.me" target="_blank">Gautam Mehta</a></footer>');
                                                        $("#footer2").hide();

                                                    }
                                                }
                                            }
                                        }
                                    }
                                    url = tracklist[i].substring(0, 25) + "embed/" + tracklist[i].substring(25, tracklist[i].length);
                                    document.getElementById('song_info').innerHTML =
                                        '<iframe class = "col-xs-12" id =' + ' "play_button" src="' + url + '"width="400" height="450" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
                                    i = i + 1;
                                });

                                console.log(artistList);

                            }

                            // Makes request to get top user tracks
                        }
                        // NEED TO KEEP TRACK OF 'HIP HOP/EDM/R&B SELECTION USING COOKIES'
                        // Use items from JSON2 to put it into a list var
                        // Use Spotify Playlist to fill the remainder of list

                    }
                    req.send();

                    console.log(tracklist);
                } else {
                    // render initial screen
                    $('#login').show();
                    $('#loggedin').hide();
                }
            }

        }
    });
