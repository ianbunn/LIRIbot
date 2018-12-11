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

(Installed)

- Node-Spotify-API
- Axios

(Not installed yet)

- Moment
- DotEnv

These technologies work in unison to retrieve data requested using `axios` package to the following APIs:

- Bands in Town
- Spotify
- OMDB