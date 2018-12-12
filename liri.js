const DotEnv = require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const Axios = require("axios");
const Moment = require("moment");
const fs = require("fs");

var nodeArgs = process.argv;
var action = process.argv[2];
var input = process.argv.slice(3).join("%20");

fs.appendFile("random.txt", ", " + action, function (err) {
    if (err) {
        return console.log("Error, error, errorrrrr....._")
    }

    console.log("Logged command")
});

// concert-this
function findConcerts (){
    const bandsInTown = keys.bandsInTown;

    Axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=" + bandsInTown).
        then(function(events){
            // console.log(events.data[0]);
            if (events.data.length === 0 || events === undefined || events.data[0].lineup === undefined){
                console.log(`\nThere are no events for the requested value.\n`)
            } else {
                for(var i = 0; i < events.data.length; i++){
                    console.log(`\n----------`);
                    console.log(`\n• LINEUP: ${events.data[i].lineup}\r`);
                    console.log(`\n• VENUE: ${events.data[i].venue.name}\r`);
                    console.log(`\n• LOCATION: ${events.data[i].venue.city}, ${events.data[i].venue.country}\r`);
                    console.log(`\n• DATE: ${Moment(events.data[i].datetime).format("MM/DD/YYYY")}\n`);
                    console.log(`\n----------`);
                }
            }
        });
}

function getSongDetails () {
    const spotify = new Spotify(keys.spotify);

    if (input != null) {
        spotify.
            search({ type: "track", query: input }, function (err, data) {
                if (err) {
                    return console.log("Error occurred: " + err);
                } else {
                    var path = data.tracks.items[0];
                    console.log(`\n----------`);
                    console.log(`\n• ARTIST: ${path.artists[0].name}\r`);
                    console.log(`\n• SONG: ${path.name}\r`);
                    console.log(`\n• ALBUM: ${path.album.name}\r`);
                    console.log(`\n• PREVIEW LINK: ${path.preview_url}\n`);
                    console.log(`\n----------`);
                }
            });
    } else {
        spotify.
            search({ type: "track", query: "Ace of Base The Sign" }, function (err, data) {
                if (err) {
                    return console.log("Error occurred: " + err);
                } else {
                    var path = data.tracks.items[0];
                    console.log(`\n----------`);
                    console.log(`\n• ARTIST: ${path.artists[0].name}\r`);
                    console.log(`\n• SONG: ${path.name}\r`);
                    console.log(`\n• ALBUM: ${path.album.name}\r`);
                    console.log(`\n• PREVIEW LINK: ${path.preview_url}\n`);
                    console.log(`\n----------`);
                }
            });
    }
}

function getMovieDetails () {
    var omdb = keys.omdb;

    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=&apikey=" + omdb;
    if(input == "") {
        input = "Mr+Nobody"
        queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=&apikey=" + omdb;
        Axios.get(queryUrl).then(function (data) {
            console.log(`\n----------`);
            console.log(`\n• MOVIE TITLE: ${data.data.Title}\r`);
            console.log(`\n• RELEASE YEAR: ${data.data.Year}\r`);
            console.log(`\n• IMDB RATING: ${data.data.imdbRating}\r`);
            console.log(`\n• ROTTEN TOMATOES RATING: ${data.data.Ratings[1].Value}\r`);
            console.log(`\n• COUNTRY ORIGIN: ${data.data.Country}\r`);
            console.log(`\n• PLOT: ${data.data.Plot}\r`);
            console.log(`\n• CAST: ${data.data.Actors}\r`);
            console.log(`\n----------`);
        })
    } else {
        Axios.get(queryUrl).then(function(data){
            // console.log(data.data)
            if (data.data.Title === undefined) {
                console.log("Sorry, the value you entered doesn't exist. Please check your spelling.")
            } else {
                console.log(`\n----------`);
                console.log(`\n• MOVIE TITLE: ${data.data.Title}\r`);
                console.log(`\n• RELEASE YEAR: ${data.data.Year}\r`);
                console.log(`\n• IMDB RATING: ${data.data.imdbRating}\r`);
                if(data.data.Ratings.length === 1){
                    console.log(`\n• ROTTEN TOMATOES RATING: NOT APPLICABLE\r`);
                } else {
                    console.log(`\n• ROTTEN TOMATOES RATING: ${data.data.Ratings[1].Value}\r`);
                }
                console.log(`\n• COUNTRY ORIGIN: ${data.data.Country}\r`);
                console.log(`\n• PLOT: ${data.data.Plot}\r`);
                console.log(`\n• CAST: ${data.data.Actors}\r`);
                console.log(`\n----------`);
            }
        })
    }
}

function doIt (){

    fs.readFile("random.txt","utf8",function(err,data){
        if(err){
            console.log(err);
        }

        input = data.split(",").map(x => x.trim());
        
        findConcerts(input[0]);
        getSongDetails(input[0]);
        getMovieDetails(input[0]);

    })

}

switch(action){
    case "concert-this": findConcerts(); break;
    case "spotify-this-song": getSongDetails(); break;
    case "movie-this": getMovieDetails(); break;
    case "do-what-it-says": doIt(); break;
};