var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/playlist_app");

module.exports.Song = require("./song");
