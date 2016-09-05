var currentMovie = null;
var displayMovieFlag = false;
//add evemt to the movie article
var addArticleEvent = function(article){
	// When the user clicks on the movie, open the modal and display the movie
	article.addEventListener("click", displayMovie);
}

    
$(document).keyup(function(e) {
     if (e.keyCode == 27) {
        if(displayMovieFlag == true){
          closePopUp();
          $("#backToTop").hide();  
        }
    }
});

// Get the modal
var modal = document.getElementById('popUpShowMovieDiv');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    closePopUp();
}

var closePopUp = function(){
    if(/login_register/.test(window.location.href)){
            location.reload();   
    }
    deleteAppendedLinks();
    modal.style.display = "none";
    $("#backToTop").show();
    displayMovieFlag = false;   
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        if(/login_register/.test(window.location.href)){
            location.reload();
        }
        console.log("here");
    deleteAppendedLinks();
    modal.style.display = "none";
    $("#backToTop").show();
    displayMovieFlag = false;
}
}

var displayMovie = function(activeUser){
        //this is article clicked
        displayMovieFlag = true;
        var movie;
        var movieID = this.id;
        var activeUser = JSON.parse(localStorage.activeUser || null);

        //HOME PAGE LOCATION
    	if (/home/.test(window.location.href)){
        	for (var i = 0; i < randomMovies.length; i++) {
	        	if(randomMovies[i].ID == movieID){
	        		movie = randomMovies[i];
	        		break;
	        	}        
        	}
    	}

    	//USER LOCATION
    	if(/login_register/.test(window.location.href)){
	        		movie = activeUser.favouriteMovies[movieID];
    	}

    	//SEARCH LOCATION
    	if(/search/.test(window.location.href)){
    			movie = popUpSearchResults[movieID];
                $("#backToTop").hide();
    	}
        
        currentMovie = movie;
        // console.log(movieID);
        

        // Check and validate does the movie is loaded
        if(movie == undefined ){
        	return;	
        }else{

        	modal.style.display = "block";
        	// console.log(movie.ToString());
        	//Poster
            $("#movieImg").remove();
        	var posterDiv = document.getElementById("moviePoster");
            var image = document.createElement("IMG");
            image.id = "movieImg";
            image.src = movie.poster || movie.Poster;
            image.style.maxWidth = "300px";
            image.style.maxHeight = "400px";
            posterDiv.appendChild(image);
        	// Title
        	var movieTitleParagraph = document.getElementById("showMovieTitle");
        	movieTitleParagraph.innerHTML = movie.title || movie.Title ;
        	//Year
        	var movieYear = document.getElementById("movieYear");
        	movieYear.innerHTML = "<small>Year of release: </small>" + (movie.year || movie.Year);
        	//Genre
        	var movieGenre = document.getElementById("movieGenre");
        	movieGenre.innerHTML = "<small>Genre: </small>" + (movie.genre || movie.Genre);
        	// Director
        	var movieDirector = document.getElementById("movieDirector");
        	movieDirector.innerHTML = "<small>Director: </small>" + (movie.director || movie.Director);
        	//Actors
        	var movieActors = document.getElementById("movieActors");
        	movieActors.innerHTML = "<small>Cast: </small>" + (movie.actors || movie.Actors);
        	//Plot
        	var moviePlot = document.getElementById("moviePlot");
        	moviePlot.innerHTML = "<small>Plot: </small><br> " + (movie.plot || movie.Plot);
        	//Country
        	var movieCountry = document.getElementById("movieCountry");
        	movieCountry.innerHTML = "<small>Country: </small>" + (movie.country || movie.Country);
            // IMDB Link
            $("#movieDetails").append("<a id='moreOnImdb' class='movie-details-link' target='_blanc'>More on IMDb</a>");
            var moreOnImdb = document.getElementById("moreOnImdb");
            moreOnImdb.href = 'http://www.imdb.com/title/' + movie.imdbID + '/';
        	
            
            $("#movieDetails").append("<a id='moreOnYoutube' class='movie-details-link' target='_blanc'>Youtube trailer</a>");
            var movieOnYoutube = document.getElementById("moreOnYoutube");

        	// SEARCH ON YOUTUBE
        	//https:www.youtube.com/results?search_query=batman+vs+superman
        	var titleWords = (movie.title || movie.Title).split(" ");
        	var queryString = "";
        	for (var i = 0; i < titleWords.length; i++) {
        		queryString+= titleWords[i] + "+";
        	}
        	queryString = queryString.substring(0, queryString.length - 1);
        	var youtubeSearchUrl = "https:www.youtube.com/results?search_query=" + queryString + " " +(movie.year || movie.Year) + "+movie+trailer";
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

        }

        // if(activeUser === null){
        //     //user need to login
        //     backToProfile();
        // }

        //check does movie exists in active user favourite lists
        var movieExists = false;
            for (var i = 0; i < activeUser.favouriteMovies.length; i++) {
                if(activeUser.favouriteMovies[i].imdbID == currentMovie.imdbID){
                    movieExists = true;
                    break;
            }
        }
        //get updated activeUser
        var activeUser = JSON.parse(localStorage.activeUser || null);

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

    
};

//delete links from movie details
var deleteAppendedLinks = function(){
    var movieDetail = document.getElementById("movieDetails");
    for (var i = 1; i <= 3; i++) {
        var lastChild = movieDetail.lastChild;
        movieDetail.removeChild(lastChild);
    }
}



