var currentCategory = "title";
var searchResultsArray  = null;
var searchResultsArrayFilteredMain = null;


change placeholder in the search
$(".searchCategory").click(function(){
	var radioButton = this;
	var searchBox = document.getElementById("searchBox");
	searchBox.placeholder = " Search by " + radioButton.value + "...";
	currentCategory = radioButton.value;
});

//hide search results section for the first load
$("#moviesToWatch").hide();


document.querySelector('.quickSearch').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      var searchText = this; 
      var searchValue = searchText.value;

      var url = "http://www.omdbapi.com/?s=" + searchValue + "&y=&plot=full&r=json";
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
                        var search = document.getElementById("searchBox");
                        search.value = "No results";
	            		// alert("Sorry, it appears we don't have that movie in our database. Check the spelling or try another movie");
	            		return;
	            	}
	            	// var test = Data.Actor;
	            searchResultsArray = data.Search;
	            searchResultsArrayFilteredMain = filterArray(searchResultsArray, searchValue, currentCategory);
	            alert("here");
	            renderSearchResults();
     //            var tempTitle = data.Title;
     //            var tempPoster = data.Poster;
     //            var tempYear = data.Year;
     //            var tempGenre = data.Genre;
     //            var tempActors = data.Actors;
     //            var tempDirector = data.Director;
     //            var tempRuntime = data.Runtime;
     //            var tempCountry = data.Country;
     //            var tempRating = data.imdbRating;
     //            var tempLanguage = data.Language;
     //            var tempPlot = data.Plot;
     //            var tempImdbID = data.imdbID;
					// //create the movie
     //            var tempMovie = new Movie(tempImdbID,undefined,tempTitle,tempPoster,tempYear,tempGenre,
     //                tempActors,tempDirector,tempRuntime,tempCountry,tempRating,
     //                tempLanguage,tempPlot);
     //                displayMovieSearch(tempMovie);
     //                tempMovie = undefined;
    			   
	        },
	        error: function () {
	            console.log('Failed!');
	     },

		});
		 
    }
    // tempMovie = undefined;
});


//filter search array by category
function filterArray(searchResultsArrayTemp, searchValueTemp, currentCategoryTemp){
	var category = currentCategoryTemp[0].toUpperCase() + currentCategoryTemp.substring(1);
	var searchResultsArrayFiltered = [];
	for (var i = 0; i < searchResultsArrayTemp.length; i++) {
		var movieCategory = searchResultsArrayTemp[i][category];
		if(movieCategory == null ||
			movieCategory == undefined ||
			movieCategory == "N/A"){
			continue;
		}
		var movieCategoryItem = searchResultsArrayTemp[i][category];
		if(movieCategoryItem.toUpperCase().includes(searchValueTemp.toUpperCase())){
			searchResultsArrayFiltered.push(searchResultsArrayTemp[i]);
		}
	}
	return searchResultsArrayFiltered;
}

function renderSearchResults(){
    $.each(searchResultsArrayFilteredMain,function(index,value){
       var movieArticle ="<article id='" + index + "' class='movie-div-template'><div id='poster" + index + 
        "' class='poster'></div><p id='title" + index + 
        "' class='title'></p></article>";
        
            $("#searchResults").append(movieArticle);

    

            var tempTitle = value.Title;
            var tempPoster = value.Poster;
            var tempYear = value.Year;
            setDivFavourite(tempTitle,tempPoster,tempYear,index);
            var article = document.getElementById(index);
            addFavouriteMovieEvent(article); 
})
}