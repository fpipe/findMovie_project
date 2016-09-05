var currentCategory = "title";
var searchResultsArray  = null;
var searchResultsArrayFilteredMain = null;
var allMoviesFiltered  = [];
var allMoviesFilteredWithPosters = [];
var dataFlowCounter = 1;
var dataFlowCounterDetails = 1;
var firstTimeFlag = true;
var pages = 0;
var popUpFiltered = [];
var popUpFilteredWithPosters = [];

// change placeholder in the search
$(".searchCategory").click(function(){
	var radioButton = this;
	var searchBox = document.getElementById("searchBox");
	searchBox.placeholder = " Search by " + radioButton.value + "...";
	currentCategory = radioButton.value;
});

//hide search results section for the first load and handle
//back to top for later 
$("#resultsText").hide();
$("#backToTop").hide();
$("#mainSection").scroll(function(){
	$("#backToTop").fadeIn();
});



document.querySelector('#searchBox').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      // $("#loadingSearch").show();
	  allMoviesFilteredWithPosters = [];
	  allMoviesFiltered = [];
	  document.getElementById("searchResults").innerHTML = "";
	  $("#backToTop").hide();

	  firstTimeFlag = true;
	  $("#resultsText").hide();
	  $("#loadingSearch").show();
      var searchText = this; 
      var searchValue = searchText.value;

      //START CHECKING AND LOOP PARSING
      setTimeout(checkSearchPages(searchValue),0);
      
	  setTimeout(function(){

	  var totalPages = pages;
	  var pagesToLoop =  Math.ceil(Number(totalPages) / 10);
	  for (var i = 1; i <= pagesToLoop; i++) {
      var url = "http://www.omdbapi.com/?s=" + searchValue + "&plot=full&page=" + i + "&r=json";
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
	            		setTimeout(falseResponse(),0);
	            		return false;
	            	}
	            	searchResultsArray = data.Search;
	            	
	            	setTimeout(filerMoviesCallback(searchResultsArray, searchValue, currentCategory, i),0);
	        },
	        error: function () {
	            console.log('Failed!');
	            return false;
	     },

		});
	 }

	}, 1000);
	  
	//END CHECKING AND LOOP PARSING	 
    
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

function renderSearchResultsBy(allMoviesFilteredTemp){

    $.each(allMoviesFilteredTemp,function(index,value){
       var movieArticle ="<article id='" + index + "' class='movie-div-template'><div id='poster" + index + 
        "' class='poster'></div><p id='title" + index + 
        "' class='title'></p></article>";
        //if we use this in search by window
        if(/search/.test(window.location.href)){
            $("#searchResults").append(movieArticle);
        }
    
            var tempTitle = value.Title;
            //check does movie have poster
            if(value.Poster == undefined || value.Poster == "N/A"){
            	allMoviesFilteredTemp[index].poster = "https://cdn.amctheatres.com/Media/Default/Images/noposter.jpg"
            } else{
            	allMoviesFilteredTemp[index].poster = value.Poster;
			}
            var tempPoster = allMoviesFilteredTemp[index].poster;
            var tempYear = value.Year;
            setDivFavourite(tempTitle,tempPoster,tempYear,index);
            var article = document.getElementById(index);
            addFavouriteMovieEvent(article); 
})
    $("#resultsText").show();
	if(popUpSearchResults.length == 0){
		$("#resultsText").hide();	
	}
	$("#loadingSearch").hide();
}

function addFavouriteMovieEvent(article){
    // When the user clicks on the movie, open the modal and display the movie
    article.addEventListener("click", displayMovie);
}


//get only movies who dont have poster
var filterMoviesWithoutPoster = function(allMoviesFilteredTemp){
	$.each(allMoviesFilteredTemp,function(index, value){
			if((value.Poster != undefined) && (value.Poster != "N/A") &&
			 (value.Poster != "https://cdn.amctheatres.com/Media/Default/Images/noposter.jpg")){
				allMoviesFilteredWithPosters.push(value);
			}
	})
}


var checkSearchPages = function(tempSearchValue){
	var url = "http://www.omdbapi.com/?s=" + tempSearchValue + "&plot=full&type=movie&r=json";
	$.ajax({  
	        url: url,
	        data: null,
	        type: 'GET',
	        crossDomain: true,
	        dataType: 'json',
	        success: function (data) {
	            	countPages(data);
	            	return true;
	        },
	        error: function () {
	            console.log('Failed!');
	            return false;
	     },
		});
	return pages;	 
};


//to do async ajax requests and data flow to be normal
var filerMoviesCallback = function(searchResultsArrayTemp, searchValueTemp2, currentCategoryTemp2, tempCounter){
	searchResultsArrayFilteredMain = filterArray(searchResultsArrayTemp, searchValueTemp2, currentCategoryTemp2);
	allMoviesFiltered = allMoviesFiltered.concat(searchResultsArrayFilteredMain);
	dataFlowCounter++;
	if(dataFlowCounter >= tempCounter){
		filterMoviesWithoutPoster(allMoviesFiltered);
		renderAndParseResults();
		dataFlowCounter=1;	
	}
}


var renderAndParseResults = function(){
	popUpSearchResults = [];
	document.getElementById("searchResults").innerHTML = "";
	if(firstTimeFlag == true){
		popUpFiltered = getMoviesFullDetails(allMoviesFiltered);
		popUpFilteredWithPosters = getMoviesFullDetails(allMoviesFilteredWithPosters);
	}
	
	if($("#checkBoxShowPosterMoviesShow").is(":checked")){
		if(firstTimeFlag == true){
			setTimeout(function(){maskForAsyncCallback()}, 3000);
		}else{
			popUpSearchResults = popUpFiltered;
			renderSearchResultsBy(popUpSearchResults);
		}
		// setInterval(renderCallback(popUpSearchResults), 5000, popUpSearchResults);
	}else{
		if(firstTimeFlag == true){
			setTimeout(function(){maskForAsyncCallback()}, 3000);
		}else{
			popUpSearchResults = popUpFilteredWithPosters;
			renderSearchResultsBy(popUpSearchResults);
		}
		// setInterval(renderCallback(popUpSearchResults), 5000, popUpSearchResults);
	}
	
}

var countPages = function(data){
	if(data.Response === "False"){
        var search = document.getElementById("searchBox");
        $("#backToTop").hide();
        $("#loadingSearch").hide();
        search.value = "No results";
        console.log("CP");
		// alert("Sorry, we dont have the movie");
		return;
	}
	pages = data.totalResults;
	$("#backToTop").hide();		
}

var maskForAsyncCallback = function(){
	if($("#checkBoxShowPosterMoviesShow").is(":checked")){
		popUpSearchResults = popUpFiltered;
	}else{
		popUpSearchResults = popUpFilteredWithPosters
	}
	firstTimeFlag = false;
	console.log("Here" + popUpSearchResults);
	renderSearchResultsBy(popUpSearchResults);
}

var falseResponse = function(){
	var search = document.getElementById("searchBox");
    search.value = "No results";
    console.log("FR");
    $("#resultsText").hide();
}

$("#checkBoxShowPosterMoviesShow").click(function(){
	renderAndParseResults();
});

var getMoviesFullDetails = function(arrayForDetails){
	var tempArrayWithDetails = [];
	$.each(arrayForDetails,function(index,value){
		var tempUrl = "http://www.omdbapi.com/?i=" + arrayForDetails[index].imdbID +"&plot=full&r=json";
		$.ajax({  
	        url: tempUrl,
	        data: null,
	        type: 'GET',
	        crossDomain: true,
	        dataType: 'json',	
	        //make it async 
	        success: function (movieFullData) {
	            //change this if the search results are false
	            if(movieFullData.Response == false){
	            	return false;
	            }
	            tempArrayWithDetails.push(movieFullData);
	        },
	        error: function () {
	            console.log('Failed!');
	            return false;
	     },

		});
	})
	return tempArrayWithDetails;
}