var currentMovie = null;

document.querySelector('#quickSearch').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      var searchValue = this.value;

      var url = "http://www.omdbapi.com/?t=" + searchValue + "&y=&plot=full&r=json";
      // AJAX quickSearch
	      $.ajax({  
	        url: url,
	        data: null,
	        type: 'GET',
	        crossDomain: true,
	        dataType: 'json',
	        success: function (data) {
	            //change this if the search results are false
	            	if(data.Response === "False"){
                        var search = document.getElementById("quickSearch");
                        search.value = "No results";
	            		// alert("Sorry, it appears we don't have that movie in our database. Check the spelling or try another movie");
	            		return;
	            	}
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
					//create the movie
                var tempMovie = new Movie(tempImdbID,undefined,tempTitle,tempPoster,tempYear,tempGenre,
                    tempActors,tempDirector,tempRuntime,tempCountry,tempRating,
                    tempLanguage,tempPlot);
                    displayMovieSearch(tempMovie);
                    tempMovie = undefined;    
	        },
	        error: function () {
	            console.log('Failed!');
	     },
		}); 
    }
    tempMovie = undefined;
});

var displayMovieSearch = function(tempMovie){
        //this is article clicked
        var searchMovie = tempMovie;
        currentMovie = searchMovie;

        if(activeUser === null){
            //user need to login
            backToProfile();
        }
        //check does movie exists in active user favourite lists
        var movieExists = false;
            for (var i = 0; i < activeUser.favouriteMovies.length; i++) {
                if(activeUser.favouriteMovies[i].imdbID == currentMovie.imdbID){
                    movieExists = true;
                    break;
            }
        }
        
        //when movie loaded check does exists in array
        if(movieExists){
            currentMovie.isFavourite = true;
            $("#addFavourite").text("Remove from favourites");
        }else{
            currentMovie.isFavourite = false;
            $("#addFavourite").text("Add to favourites");
        }

        	modal.style.display = "block";
        	console.log(searchMovie.ToString());
        	//Poster
            $("#movieImg").remove();
        	var posterDiv = document.getElementById("moviePoster");
            var image = document.createElement("IMG");
            image.id = "movieImg";
            image.src = searchMovie.poster;
            image.style.maxWidth = "300px";
            image.style.maxHeight = "400px";
            posterDiv.appendChild(image);
        	// Title
        	var movieTitleParagraph = document.getElementById("showMovieTitle");
            movieTitleParagraph.innerHTML = searchMovie.title ;
        	//Year
        	var movieYear = document.getElementById("movieYear");
        	movieYear.innerHTML = "<small style='color:yellow'>Year of release: </small>" + searchMovie.year;
        	//Genre
        	var movieGenre = document.getElementById("movieGenre");
        	movieGenre.innerHTML = "<small style='color:yellow'>Genre: </small>" + searchMovie.genre;
        	// Director
        	var movieDirector = document.getElementById("movieDirector");
        	movieDirector.innerHTML = "<small style='color:yellow'>Director: </small>" + searchMovie.director;
        	//Actors
        	var movieActors = document.getElementById("movieActors");
        	movieActors.innerHTML = "<small style='color:yellow'>Cast: </small>" + searchMovie.actors;
        	//Plot
        	var moviePlot = document.getElementById("moviePlot");
        	moviePlot.innerHTML = "<small style='color:yellow'>Plot: </small><br> " + searchMovie.plot;
        	//Country
        	var movieCountry = document.getElementById("movieCountry");
        	movieCountry.innerHTML = "<small style='color:yellow'>Country: </small>" + searchMovie.country;
            // IMDB Link
            $("#movieDetails").append("<a id='moreOnImdb' class='movie-details-link' target='_blanc'>More on IMDb</a>");
            var moreOnImdb = document.getElementById("moreOnImdb");
            moreOnImdb.href = 'http://www.imdb.com/title/' + searchMovie.imdbID + '/';
            
            
            $("#movieDetails").append("<a id='moreOnYoutube' class='movie-details-link' target='_blanc'>Youtube trailer</a>");
            var movieOnYoutube = document.getElementById("moreOnYoutube");

            // SEARCH ON YOUTUBE
            //https:www.youtube.com/results?search_query=batman+vs+superman
            var titleWords = (searchMovie.title || searchMovie.Title).split(" ");
            var queryString = "";
            for (var i = 0; i < titleWords.length; i++) {
                queryString+= titleWords[i] + "+";
            }
            queryString = queryString.substring(0, queryString.length - 1);
            var youtubeSearchUrl = "https:www.youtube.com/results?search_query=" + queryString + " " +(searchMovie.year || searchMovie.Year) + "+movie+trailer";
            moreOnYoutube.href = youtubeSearchUrl;
            if(moreOnYoutube[0] != undefined){
                moreOnYoutube[0].href = youtubeSearchUrl;
            }


            $("#movieDetails").append("<a id='moreOnPutlocker' class='movie-details-link' target='_blanc'>Watch on putlocker</a>");
            var moreOnPutlocker = document.getElementById("moreOnPutlocker");

            //SEARCH ON PUTLOCKER
            //http://putlocker.is/search/search.php?q=batman%20v%20superman

            //WATCH
            ////http://putlocker.is/watch-all-star-superman-online-free-putlocker.html
            //http://putlocker.is/watch-batman-begins-online-free-putlocker.html
            var queryString = "";

            for (var i = 0; i < titleWords.length; i++) {
                queryString+= titleWords[i] + "+";
            }
            queryString = queryString.substring(0, queryString.length - 1);
            var putlockerSearchUrl = "http://putlocker.is/search/search.php?q=" + queryString;

            //open watch windows for moviebut problem with url on some movies(":",
            //needed year after movie) and change "+" to "-" from for
            // var putlockerSearchUrl = "http://putlocker.is/watch-" + queryString + "-online-free-putlocker.html";
            
            moreOnPutlocker.href = putlockerSearchUrl;
            if(moreOnPutlocker[0] != undefined){
                moreOnPutlocker[0].href = putlockerSearchUrl;
            }
};


