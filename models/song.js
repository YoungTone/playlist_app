var mongoose = require("mongoose");

var songSchema = new mongoose.Schema({
    title: String,
    artist: String,
    album: String,
    year: String,
    length: String,
    bpm: Number,
    genre: String,
    art: String
});

var Song = mongoose.model("Song", songSchema);

module.exports = Song;