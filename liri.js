const DotEnv = require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const Axios = require("axios");
const Moment = require("moment");
const fs = require("fs");

var nodeArgs = process.argv;
var action = process.argv[2];
var input = process.argv.slice(3).join("%20");

// append action command to log.txt
fs.appendFile("log.txt", ", " + action, function (err) {
    if (err) {
        return console.log("Error, error, errorrrrr....._")
    }
    console.log(`\n----------LOG----------`)
    console.log(`\nLogged command ${action}`)
    console.log(`\n----------END LOG----------`)
});

// concert-this
function findConcerts (){
    const bandsInTown = keys.bandsInTown;

    Axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=" + bandsInTown).
        then(function(events){
            // console.log(events.data[0]);
            if (events.data.length === 0 || events === undefined || events.data[0].lineup === undefined){
                console.log(`\n----------BANDS IN TOWN ERROR----------`)
                console.log(`\nThere are no concerts for the requested value.`);
                console.log(`\n----------END BANDS IN TOWN ERROR----------`)
            } else {
                for(var i = 0; i < events.data.length; i++){
                    console.log(`\n----------BANDS IN TOWN----------`);
                    console.log(`\n• LINEUP: ${events.data[i].lineup}`);
                    console.log(`\n• VENUE: ${events.data[i].venue.name}`);
                    console.log(`\n• LOCATION: ${events.data[i].venue.city}, ${events.data[i].venue.country}`);
                    console.log(`\n• DATE: ${Moment(events.data[i].datetime).format("MM/DD/YYYY")}`);
                    console.log(`\n----------END BANDS IN TOWN----------`);
                }
            }
        });
}

function getSongDetails () {
    const spotify = new Spotify(keys.spotify);

    // If no input, set input to default value
    if(!input){
        input = "Ace of Base The Sign";
    }

    // Get input details from spotify
    spotify.
        search({ type: "track", query: input }).then(function (data) {
            // console.log(data.tracks.items[0]);
            
            if (data === undefined || data.tracks.items === 0 || data.tracks.items[0]===undefined) {
                console.log(`\n----------SPOTIFY ERROR----------`);
                console.log("\nAn error occurred, please check your song spelling.");
                console.log(`\n----------END SPOTIFY ERROR----------`);
            } else {
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

function getMovieDetails () {
    var omdb = keys.omdb;
    
    // If no input, set input to default value
    if(!input){
        input = "Mr+Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=&apikey=" + omdb;
    
    Axios.get(queryUrl).then(function(data){
        // console.log(data.data)
        if (data.data.Title === undefined) {
            console.log(`\n----------OMDB ERROR----------`);
            console.log("\nSorry, the value you entered doesn't exist. Please check your spelling.")
            console.log(`\n----------END OMDB ERROR----------`);
        } else {
            console.log(`\n----------OMDB DETAILS----------`);
            console.log(`\n• MOVIE TITLE: ${data.data.Title}`);
            console.log(`\n• RELEASE YEAR: ${data.data.Year}`);
            console.log(`\n• IMDB RATING: ${data.data.imdbRating}`);
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