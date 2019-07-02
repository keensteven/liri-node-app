require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
// var inquirer = require("inquirer");

// Runtime global variables
var commandChoice = process.argv[2];
var userInput = process.argv[3];

// If statements to run program based on user commands

if (commandChoice === "concert-this") {
  concertThis(userInput);
}

function concertThis(artist) {
  if (!artist) {
    artist = "Cher"
  }
  axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
    function (response) {
      console.log(response.data[0].venue.name);
      console.log(response.data[0].venue.city + " " + response.data[0].venue.region + " " + response.data[0].venue.country);
      var concertDate = response.data[0].datetime;
      console.log(moment(concertDate).format("MM/DD/YYYY"));
    })
}

if (commandChoice === "spotify-this-song") {
  spotifyThisSong(userInput);
}

function spotifyThisSong(song = "The Sign") {
  spotify.search({
    type: 'track',
    query: song
  }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log(data.tracks.items[0].album.artists[0].name);
    console.log(data.tracks.items[0].name);
    console.log(data.tracks.items[0].external_urls.spotify);
    console.log(data.tracks.items[0].album.name);
  });
};

// `node liri.js movie-this` If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

// Loop through all the words in the node argument and handle the inclusion of "+"s
//   if (i > 2 && i < nodeArgs.length) {
//     movieName = movieName + "+" + nodeArgs[i];
//   } else {
//     movieName += nodeArgs[i];

if (commandChoice === "movie-this") {
  movieThis(userInput)
}

function movieThis(movie = "Mr. Nobody") {
  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  axios.get(queryUrl).then(
      function (response) {
        console.log("TITLE: " + response.data.Title);
        console.log("IMDB RATING: " + response.data.imdbRating);
        console.log("RELEASED: " + response.data.Released);
        console.log("PRODUCED IN: " + response.data.Country);
        console.log("LANGUAGE: " + response.data.Language);
        console.log("PLOT: " + response.data.Plot);
        console.log("ACTORS: " + response.data.Actors);
      })
    .catch(function (error) {
      console.log(error)
    });
}
//  `node liri.js do-what-it-says`
//    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//      * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
//      * Edit the text in random.txt to test out the feature for movie-this and concert-this.

if (commandChoice === "do-what-it-says") {

  // This will read from the "random.txt" file and store the contents of the reading inside the variable "data"

  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    console.log(data);

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    // We will then re-display the content as an array for later use.
    console.log(dataArr[0]);
    console.log(dataArr[1]);
    song = dataArr[1];
    spotify.search({
      type: 'track',
      query: song
    }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      console.log(data.tracks.items[0].album.artists[0].name);
      console.log(data.tracks.items[0].name);
      console.log(data.tracks.items[0].external_urls.spotify);
      console.log(data.tracks.items[0].album.name);
    });
  });

}