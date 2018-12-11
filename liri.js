const dotenv = require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");

const spotify = new Spotify(keys.spotify);

spotify
    .request("https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx")
    .then(function (data) {
        console.log(data);
    })
    .catch(function (err) {
        console.error("Error occurred: " + err);
    });