// Boilerplate code
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

var db = require('./models');

var request = require('request');

var express = require('express'),
    app = express(),
    request = require('request');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Setting the root
app.get('/', function(req, res) {
    res.redirect('/songs');
});

app.get('/songs', function(req, res) {
    db.Song.find({}, function(err, songs) {
        res.render('songs/index', {
            songs: songs
        });
    });
});

// GET request for new song
app.get('/songs/new', function(req, res) {
    res.render('songs/new');
});

// look up song by id and display it
app.get('/songs/:id', function(req, res) {
    db.Song.findById(req.params.id, function(err, song) {
        err ? console.log(err) : res.render('songs/show', {
            song: song
        });
    });

});

// adding a song
app.post('/songs', function(req, res) {
    // req.body.song replace the need for {name: req.body.name} etc...
    db.Song.create(req.body.song, function(err, song) {
        err ? console.log(err) : res.redirect('/');

    });
});

// displaying form to edit
app.get('/songs/:id/edit', function(req, res) {
    db.Song.findById(req.params.id, function(err, song) {
        err ? res.send(err) : res.render('edit', {
            song: song
        });
    });

});

// update a specific song with data from edit
app.put('/songs/:id', function(req, res) {
    db.Song.findByIdAndUpdate(req.params.id, req.body.song, function(err, song) {
        err ? res.send(err) : res.redirect('/');
    });
});

// deleting a song
app.delete('/songs/:id', function(req, res) {
    db.Song.findByIdAndRemove(req.params.id, function(err, song) {
        err ? res.send(err) : res.redirect('/');
    });
});

// searching api for a song
app.get("/searchresults", function(req, res) { // res our servers object that allows us to respond/ express objec that allows us to respond
    var search = encodeURIComponent(req.query.query);
    console.log(req.query);
    request.get('https://itunes.apple.com/search?term=' + search, function(error, response, body) { // response we have recieved from api/ data
        if (error) {
            res.status(500).send("You got an error - " + error);
        } else if (!error && response.statCode >= 300) {
            res.status(500).send("Something went wrong! Status: " + response.statusCode);
        }
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);
            var song = body.results[0];
            res.render('songs/searchresults', {
                song: song
            });
        }
    });
});


// start server
app.listen(3000, function() {
    console.log('server running on port 3000');
});