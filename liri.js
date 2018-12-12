const DotEnv = require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const Axios = require("axios");
const Moment = require("moment");
const fs = require("fs");

var nodeArgs = process.argv;

// Saving argument from CLI
var action = process.argv[2];

// Checking for action in actions array to make sure the action is known by LIRIbot
var actions = ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"];
if (actions.indexOf(action) === -1) {
    // Provide a list of all action commands for LIRIbot
    console.log(`\n----------SYSTEM MESSAGE----------\nLIRIbot doesn't know your ${action} command, please retry with one of the following:\nconcert-this\nspotify-this-song\nmovie-this\ndo-what-it-says\n----------END SYSTEM MESSAGE----------\n`)
}

// Save user's input throwing away spaces after 3-index from command and joining with spaces code
var input = process.argv.slice(3).join("%20");

// Append action command to log.txt
fs.appendFile("log.txt", ", " + action, function (err) {
    if (err) {
        return console.log("Error, error, errorrrrr....._")
    }
    console.log(`\n----------LOG RECORD----------`)
    console.log(`\nLogged command ${action}`)
    console.log(`\n----------END LOG RECORD----------`)
});

// concert-this action command
function findConcerts (){

    // Getting key from keys.js
    const bandsInTown = keys.bandsInTown;

    // If there is no input using concert-this, log this command
    if(!input){
        console.log(`\n----------BANDS IN TOWN ERROR----------`)
        console.log("\nAn error occurred. Please retry and enter an artist or band name.")
        console.log(`\n----------BANDS IN TOWN ERROR----------`)
    } else {

        // If input is entered, check for concerts using Axios and BandsInTown API
        Axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=" + bandsInTown).
            then(function(events){
                // Check for errors
                if (events.data.length === 0 || events === undefined || events.data[0].lineup === undefined){
                    console.log(`\n----------BANDS IN TOWN ERROR----------`)
                    console.log(`\nThere are no concerts for the requested value.`);
                    console.log(`\n----------END BANDS IN TOWN ERROR----------`)
                } else {
                    // Display each concert found in its own section with record number for easy reference
                    for(var i = 0; i < events.data.length; i++){
                        console.log(`\n----------BANDS IN TOWN RECORD NUMBER ${i+1}----------`);
                        console.log(`\n• LINEUP: ${events.data[i].lineup}`);
                        console.log(`\n• VENUE: ${events.data[i].venue.name}`);
                        console.log(`\n• LOCATION: ${events.data[i].venue.city}, ${events.data[i].venue.country}`);
                        console.log(`\n• DATE: ${Moment(events.data[i].datetime).format("MM/DD/YYYY")}`);
                        console.log(`\n----------END BANDS IN TOWN RECORD NUMBER ${i+1}----------`);
                    }
                }
            });
    }
}

// spotify-this-song action command
function getSongDetails () {
    const spotify = new Spotify(keys.spotify);

    // If no input, set input to default value
    if(!input){
        input = "Ace of Base The Sign";
    }

    // Get input details from spotify
    spotify.
        search({ type: "track", query: input }).then(function (data) {
            // Check for errors
            if (data === undefined || data.tracks.items === 0 || data.tracks.items[0]===undefined) {
                console.log(`\n----------SPOTIFY ERROR----------`);
                console.log("\nAn error occurred, please check your song spelling.");
                console.log(`\n----------END SPOTIFY ERROR----------`);
            } else {
                // Log spotify details based on input
                var path = data.tracks.items[0];
                console.log(`\n----------SPOTIFY DETAILS----------`);
                console.log(`\n• ARTIST: ${path.artists[0].name}`);
                console.log(`\n• SONG: ${path.name}`);
                console.log(`\n• ALBUM: ${path.album.name}`);
                console.log(`\n• PREVIEW LINK: ${path.preview_url}`);
                console.log(`\n----------END SPOTIFY DETAILS----------`);
            }
        });
}

// movie-this action command
function getMovieDetails () {
    var omdb = keys.omdb;
    
    // If no input, set input to default value
    if(!input){
        input = "Mr+Nobody";
    }

    // Setting queryUrl for Axios and OMDB API
    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=&apikey=" + omdb;
    
    // Getting OMDB API data using AXIOS
    Axios.get(queryUrl).then(function(data){
        // Check for errors
        if (data.data.Title === undefined) {
            console.log(`\n----------OMDB ERROR----------`);
            console.log("\nSorry, the value you entered doesn't exist. Please check your spelling.")
            console.log(`\n----------END OMDB ERROR----------`);
        } else {
            // Display OMDB movie details
            console.log(`\n----------OMDB DETAILS----------`);
            console.log(`\n• MOVIE TITLE: ${data.data.Title}`);
            console.log(`\n• RELEASE YEAR: ${data.data.Year}`);
            console.log(`\n• IMDB RATING: ${data.data.imdbRating}`);
            // If there is no Rotten Tomatoes rating, display NOT APPLICABLE
            if(data.data.Ratings.length === 1){
                console.log(`\n• ROTTEN TOMATOES RATING: NOT APPLICABLE`);
            } else {
                console.log(`\n• ROTTEN TOMATOES RATING: ${data.data.Ratings[1].Value}`);
            }
            console.log(`\n• COUNTRY ORIGIN: ${data.data.Country}`);
            console.log(`\n• PLOT: ${data.data.Plot}`);
            console.log(`\n• CAST: ${data.data.Actors}`);
            console.log(`\n----------END OMDB DETAILS----------`);
        }
    })
}

// do-what-it-says action command
function doIt (){

    // read file contents from random.txt
    fs.readFile("random.txt","utf8",function(err,data){
        if(err){
            console.log(err);
        }

        // Use the random.txt contents as an input for all action commands
        input = data.split(",").map(x => x.trim());
        
        // Run all action commands with the random.txt contents
        findConcerts(input[0]);
        getSongDetails(input[0]);
        getMovieDetails(input[0]);
    })
}

// Check for the specific action to run the action's function
switch(action){
    case "concert-this": findConcerts(); break;
    case "spotify-this-song": getSongDetails(); break;
    case "movie-this": getMovieDetails(); break;
    case "do-what-it-says": doIt(); break;
};