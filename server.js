// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var fs = require('fs');
var request = require('request');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

var clientId, clientSecret, token;

clientId = process.env.CLIENTID;
clientSecret = process.env.CLIENTSECRET;

function authenticate () {
    request.post('https://accounts.spotify.com/api/token', {
        form: 'grant_type=client_credentials',
        auth: { username: clientId, password: clientSecret }
    }, function(error, response, body){
        try {
            var res = JSON.parse(body);
            token = res.access_token;

            setTimeout(authenticate, res.expires_in);
        }
        catch (e) {
            console.log('[ERR] token error!');
        }
    });
}

io.on('connection', function (socket) {
    socket.on('track', function(data){
        if (data.id) {
            request.get('https://api.spotify.com/v1/tracks/' + encodeURIComponent(data.id), {
                auth: {
                    bearer: token
                }
            }, function(err, response, body){
                try {
                    if (err) {
                        socket.emit('track', {
                            error: true,
                            message: 'Could not get the track.'
                        });
                        return;
                    }
                    var res = JSON.parse(body);
                    socket.emit('track', {
                        error: false,
                        title: res.name,
                        artist: res.artists[0].name,
                        cover: res.album.images[0].url
                    });
                }
                catch (e) {
                    socket.emit('track', {
                        error: true,
                        message: 'Could not get the track.'
                    });
                }
            });
        }
        else {
            socket.emit('error', {
                message: 'No Track ID provided.'
            });
        }
    });

    socket.on('artist', function(data){
        if (data.id) {
            request.get('https://api.spotify.com/v1/artists/' + encodeURIComponent(data.id) + '/top-tracks?country=' + encodeURIComponent(data.region ? data.region : 'US'), {
                auth: {
                    bearer: token
                }
            }, function(err, response, body){
                console.log(body);
                try {
                    if (err) {
                        socket.emit('artist', {
                            error: true,
                            message: 'Could not get the artist.'
                        });
                        return;
                    }
                    var res = JSON.parse(body);

                    var tracks = [];
                    res.tracks.forEach(function(track){
                        console.log(track);
                        tracks.push({
                            name: track.name,
                            album: track.album.name,
                            cover: track.album.images[0].url
                        });
                    });

                    socket.emit('artist', {
                        error: false,
                        name: res.tracks[0].artists[0].name,
                        tracks: tracks
                    });
                }
                catch (e) {
                    socket.emit('artist', {
                        error: true,
                        message: 'Could not get the artist.'
                    });
                }
            });
        }
        else {
            socket.emit('error', {
                message: 'No Artist ID provided.'
            });
        }
    });

    socket.on('album', function(data){
        if (data.id) {
            var region;
            request.get('https://api.spotify.com/v1/albums/' + encodeURIComponent(data.id), {
                auth: {
                    bearer: token
                }
            }, function(err, response, body){
                try {
                    if (err) {
                        socket.emit('album', {
                            error: true,
                            message: 'Could not get the album.'
                        });
                        return;
                    }
                    var res = JSON.parse(body);

                    var tracks = [];
                    res.tracks.items.forEach(function(track){
                        tracks.push(track.name);
                    });

                    socket.emit('album', {
                        error: false,
                        title: res.name,
                        artist: res.artists[0].name,
                        cover: res.images[0].url,
                        tracks: tracks
                    });
                }
                catch (e) {
                    socket.emit('album', {
                        error: true,
                        message: 'Could not get the album.'
                    });
                }
            });
        }
        else {
            socket.emit('error', {
                message: 'No Album ID provided.'
            });
        }
    });

    socket.on('playlist', function(data){
        if (data.id) {
            var offset = data.offset ? data.offset : 0;
            request.get('https://api.spotify.com/v1/users/' + encodeURIComponent(data.userId) + '/playlists/' + encodeURIComponent(data.id) + '/tracks?limit=50&offset=' + encodeURIComponent(offset * 50), {
                auth: {
                    bearer: token
                }
            }, function(err, response, body){
                try {
                    if (err) {
                        socket.emit('playlist', {
                            error: true,
                            message: 'Could not get the playlist.'
                        });
                        return;
                    }
                    var res = JSON.parse(body);

                    var tracks = [];
                    res.items.forEach(function(item){
                        tracks.push({
                            name: item.track.name,
                            album: item.track.album.name,
                            artist: item.track.artists[0].name,
                            cover: item.track.album.images[0].url
                        });
                    });

                    socket.emit('playlist', {
                        error: false,
                        total: res.total,
                        offset: offset,
                        tracks: tracks
                    });
                }
                catch (e) {
                    socket.emit('playlist', {
                        error: true,
                        message: 'Could not get the playlist.'
                    });
                }
            });
        }
        else {
            socket.emit('playlist', {
                message: 'No Playlist ID provided.'
            });
        }
    });
});