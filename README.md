# LIRIbot

Language Interpretation and Recognition Interface node js application

LIRIbot is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRIbot is a Language Interpretation and Recognition Interface. LIRIbot is a command line node app that takes in parameters and gives you back data.

LIRIbot will search:

- Spotify for songs
- Bands in Town for concerts
- OMDB for movies

## Technologies

To use LIRIbot node js app, `git clone` this repo, and install the app's dependencies by running `npm install` in your cloned repo folder.

Dependencies used in this app are:

- Node-Spotify-API
- Axios
- Moment
- DotEnv
- FS

These technologies work in unison to retrieve data requested using `axios` package to the following APIs:

- Bands in Town
- OMDB

## How To

To run LIRIbot after installing all dependencies, open your CLI and run the following action commands:

- `node liri concert-this + artist name`
  - This action command will list you concerts/events for the specific artist name inputted

- `node liri spotify-this-song + song name`
  - This action command will list the Spotify details for the first song name encountered from the API response (at 0-index)

- `node liri movie-this + movie name`
  - This action command will list the movie details using OMDB API

- `node liri do-what-it-says`
  - This action command will run all action commands above with the contents of `random.txt` file

## Error Handling

There are multiple error handlers to indicate where the action command or the input went wrong. Please review the output in the CLI for more details.

## Live Example

![LIRIBot example](/LIRIBot-gif.gif)