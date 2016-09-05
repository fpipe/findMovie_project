
//MOVIE CONSTRUCTOR
var Movie = function Movie(imdbID, ID, title, poster, year, genre, actors,
     director, runtime, country, imdbRating, language, plot) {
    this.ID = ID;
    this.imdbID = imdbID;
    this.poster = poster;
    this.title = title;
    this.year = year;
    this.genre = genre;
    this.actors = actors;
    this.director = director;
    this.runtime = runtime;
    this.country = country;
    this.imdbRating = imdbRating;
    this.language = language;
    this.plot = plot;

    this.isFavourite = false;


    this.ToString = function(){
        return "ID:" + this.ID + " Movie: " + this.title + "(" + this.year + ")";
    }
}

var randomMovies = [];



// GENERATE RANDOM ID
function pad(number, length) {
  var str = '' + number;
  while(str.length < length) {
    str = '0' + str;
  }
  return str;
}

// GENERATE RANDOM MOVIE DIVS
for(var i = 1; i <= 20 ; i++){
    // creating new movie article
    var movieArticle ="<article id='" + i + "' class='movie-div-template'><div id='poster" + i + 
    "' class='poster'></div><p id='title" + i + 
    "' class='title'></p></article>";

    $("#randomMovies").append(movieArticle);
    
    // AJAX and filling arcticle
   fillArticle(i);
   var article = document.getElementById(i);
   addArticleEvent(article);
}

// PUST RANDOM MOVIE TO ARRAY
var setMovieToArray = function(imdbID, ID, title, poster, year, genre, actors,
     director, runtime, country, imdbRating, language, plot){
    randomMovies.push(new Movie(imdbID, ID, title, poster, year, genre, actors,
     director, runtime, country, imdbRating, language, plot));
};

// SET DIV TEMPLATE
function setDiv(title, poster, year, ID){
        var posterDiv = document.getElementById("poster"+ ID);
        var titleDiv = document.getElementById("title" + ID);
        if(title.length > 35) {
            titleDiv.innerHTML = title.substring(0, 31) + "... (" + year + ")";
        } else {
            titleDiv.innerHTML = title + "<br/> (" + year + ")";
        }
        //set poster image
        var image = document.createElement("IMG");
        image.src = poster;
        image.alt= title;
        image.style.maxWidth = "180px";
        image.style.maxHeight = "250px";
        posterDiv.appendChild(image);
};



// FILL ARTICLE
function fillArticle(index){
    var url = "http://www.omdbapi.com/?type=movie&i=tt" + 
    pad(Math.floor((Math.random() * 2155529) + 1), 7) + "&plot=full&r=json";
    $.ajax({  
        url: url,
        data: null,
        type: 'GET',
        crossDomain: true,
        dataType: 'json',
        success: function (data) {
            //check if the random movie dont have poster
            if(data.Title === "undefined" || data.Title == undefined || 
            data.Poster === "N/A" || data.Poster == undefined ||
            data.Year == undefined && data.Type == movie || (data.Title.indexOf("Episode") > -1) ||
            (data.Title.indexOf("#DUPE#") > -1)
            ){
                fillArticle(index);          
            }else{
                var tempTitle = data.Title;
                var tempPoster = data.Poster;
                var tempYear = data.Year;
                var tempGenre = data.Genre;
                var tempActors = data.Actors;
                var tempDirector = data.Director;
                var tempRuntime = data.Runtime;
                var tempCountry = data.Country;
                var tempRating = data.imdbRating;
                var tempLanguage = data.Language;
                var tempPlot = data.Plot;
                var tempImdbID = data.imdbID;
                

                //set movie to array and set div
                setDiv(tempTitle,tempPoster,tempYear,index);
                // SET TO RANDOM MOVIES
                //title, poster, year, genre, actors,
                //director, runtime, country, imdbRating, language, plot)
                setMovieToArray(tempImdbID,index,tempTitle,tempPoster,tempYear,tempGenre,
                    tempActors,tempDirector,tempRuntime,tempCountry,tempRating,
                    tempLanguage,tempPlot); 
            }
                    
        },
        error: function () { 
            console.log('Failed!');
            fillArticle(index);
         },
    }); 
}

// SHOW MOVIE








