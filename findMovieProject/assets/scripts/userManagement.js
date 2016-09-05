//dom content loaded
// $( document ).ready(function(){
if(/login_register/.test(window.location.href)){
        $("#signUpContainer").append("<form id='signUpForm'></form>");
        var signUpForm = $("#signUpForm");
        signUpForm.append("<h1>Sign Up</h1>");
        signUpForm.append("<p></p><input id='username' name='username' type='text' placeholder=' Username'></input></br>");
        signUpForm.append("<p></p><input id='password' name='password' type='password' placeholder=' Password'></input></br>");
        signUpForm.append("<p></p><input id='confirmPassword' name='confirmPassword' type='password' placeholder=' Confirm Password'></input></br>");
        signUpForm.append("<p></p><input id='email' name='email' type='email' placeholder=' Email'></input></br>");
        signUpForm.append("<p></p><input id='age' name='age' type='number' min='10' placeholder=' Age'></input>");
        signUpForm.append("<button type='button' id='signUp' >Register</button>");
    }
    
// });


// for the first time setting users to local
// var id = 0;
// var users = [];

//after setting first 
var activeUser = JSON.parse(localStorage.activeUser || null);
// //get users and id from local
var users = JSON.parse(localStorage.users || null);
var id = null;
if(users == null){}else{
    id = users.length;
}

//setting for first time
if(id == null || users == null){
    var id = 0;
    var users = [];
}else{
    checkActiveUserAndSetProfile(activeUser);
}


//users constructor
function User(id, username, password, email, age, favouriteMovies){
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.age = age;
    this.favouriteMovies = [];

    this.ToString = function(){
        return "ID:" + this.id + " Username:" + this.username + " Email:" + email; 
    }
}

function checkActiveUserAndSetProfile(openProfileUser){
    if(openProfileUser !== null){
        openProfile(openProfileUser);
    }
};

//add or remove movie from favourites
$("#addFavourite").click(function(){
    //current movie comes from other scripts
    //check does current movie is added to favourites before
    manageFavourites();
    
    
});

function manageFavourites(){
        if(activeUser == null){
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

       if(currentMovie.isFavourite == false){
        // currentMovie.isFavourite = true;
        //add movie to favourites to current user
        currentMovie.isFavourite = true;
          activeUser.favouriteMovies.push(currentMovie);
          saveActiveUserToLocal(activeUser);
          $("#addFavourite").text("Remove from favourites");
            
        }else{
            currentMovie.isFavourite = true;
            var index = findMovieIndex(currentMovie);
            activeUser.favouriteMovies.splice(index,1);
            saveActiveUserToLocal(activeUser);
            currentMovie.isFavourite = false;
            $("#addFavourite").text("Add to favourites");
        } 
}

var findMovieIndex = (function(currentMovie){
    for (var i = 0; i < activeUser.favouriteMovies.length; i++) {
        if(activeUser.favouriteMovies[i].imdbID == currentMovie.imdbID){
            return i;
    }
}
});

//try yo login some user
$("#login").click(function(){
    var username = $("#loginUsername").val();
    var password = $("#loginPassword").val();
    $.each(users, function(index,user){
        //username and password validation
        if(((user.username  === username) || (user.email === username)) && (user.password === password)){
            activeUser = user;
            localStorage.activeUser = JSON.stringify(activeUser);
            openProfile(activeUser);
            console.log(activeUser.username," Sucessfully logged in!");
            return;
        } 
    });
    if(activeUser == null){
        $("#incorrectLogin").fadeIn(); 
      // alert("Your username or password are incorrect!");  
    }
});


//submit the register form
$("#signUp").click(function(){
    //username
    var username = $("#username").val();
    console.log("Username: " + username);
    //password
    var password = $("#password").val();
    console.log("Password: " + password);
    //confirm password
    var confirmPasswordForm = $("#confirmPassword").val();
    console.log("Confirm Password: " + confirmPasswordForm);
    //email
    var email = $("#email").val();
    console.log("Email: " + email);
    var age = $("#age").val();
    console.log("Age: " + age);
    var user = new User(id, username, password, email, age, emptyFavMovies);
    if(checkDuplicate(user) && confirmUsername(username) && confirmPassword(password, confirmPasswordForm) && confirmEmail(email) && confirmAge(age)){
        alert("You have sucessfully signed up");
        var signUpForm = document.getElementById("signUpForm");
        signUpForm.reset();
        var emptyFavMovies = [];
        id++;
        setUserToLocal(user);
    }
});

var checkDuplicate = function(tempUser){
    var duplicateFlag = false;
    $.each(users,function(index,value){
        if(users[index].password === tempUser.password 
        || users[index].username === tempUser.username
        || users[index].email === tempUser.email ){
            console.log("Duplicate register try");
            alert("Your informations are duplicate with other user");
            duplicateFlag = true;
            return false;
        }
    });
    if(duplicateFlag == true){
        return false;
    } else{
        return true; 
    }
}


//when user click sign out
var signOut = (function(){
    activeUser = null;
    localStorage.activeUser = JSON.stringify(null);
    $("nav ul .loginNavLink").html("<a href='login_register.html'>Login | Register</a></li>");
    $("#loginContainer").show();
    $("#signUpContainer").show();

    backToProfile();
});

//Show users and active user in console
var showUsers = (function(){
    $.each(users, function(index,user){
        console.log(user);
    });
});

var showActiveUser = (function(){
    console.log(activeUser);
});

function openProfile(loggedUser){
    $("nav ul .loginNavLink").html("");
    $("header nav ul .loginNavLink").append("<small id='userUsername' onclick='backToProfile()' style='border-bottom:2px solid #B57139'>" + loggedUser.username.substring(0,7) + 
            "</small><small> | </small>");
    $("#loginContainer").hide();
    $("#signUpContainer").hide();
    $("#intro").html("<h1 id='favouriteMovies' >Favourite movies</h1>");
    $("nav ul .loginNavLink").append("<span id='signOut' onclick='signOut()'>Log out</span>");
    
    if(/login_register/.test(window.location.href)){
        renderFavouriteMovies();
    }
         
    // addEventsToProfile();
    // showFavouriteMovies(loggedUser);
};

//when click on profile name or sign out back to profile html
var backToProfile = function(){
    window.location = "login_register.html";
};


// function addEventsToProfile(){
//     var usernameSmall = document.getElementById("userUsername");
//     // usernameSmall.OnClick = backToProfile();
//     usernameSmall.addEventListener("click", backToProfile);
//     var signOutSmall = document.getElementById("signOut");
//     signOutSmall.addEventListener("click", signOut);
// };

//confirm password
var confirmPassword = (function(password, confirmPassword){
    var regex = /(?=.*\d)(?=.*[!@#$%^&*._-]).{8,}/;
    if(regex.test(password)){
        if(password != confirmPassword){
            alert("Please confirm the same password");
            console.log("Password NOT validated, difficult password and confirm password");
            return false;
        }
        console.log("Password validated");
       return true; 
    }else {
        console.log("Password NOT validated");
        alert("You should have at least 8 characters, 1 digit and 1 special character in your password");
        return false;
    }
});

//confirm email
var confirmEmail= (function(email){
    var regex = /(.*)@(.*)(..com)/;
    if (regex.test(email)){
        console.log("Email valideted");
        return true;
    } else {
        console.log("Email NOT Validated");
        alert("Please insert valid email adress");
        return false;
    }
});

//confirm age
var confirmAge = (function(age){
    if(Number(age) < 120){
        if(Number(age)<18){
            alert("No kids allowed");
            console.log("Age NOT Validated");
            return false; 
        }
        console.log("Age Validated");
        return true;  
    } else {
        alert("Please insert valid age");
        console.log("Age NOT Validated");
        return true;
    }
});

//confirm username
var confirmUsername =(function(username){
    var regex = /(?=[A-Z])(.*).{5,}/;
    if(regex.test(username)){
        console.log("Username valideted");
        return true;
    }else{
        console.log("Username NOT Validated");
        alert("Please insert valid Username");
        return false;
    }
    
});

//set user to local storage and push to array
var setUserToLocal = (function(user){
    users.push(user);
    localStorage.users = JSON.stringify(users);
});

var saveActiveUserToLocal = (function(activeUserTemp){
    for (var i = 0; i < users.length; i++) {
        if(users[i].id == activeUserTemp.id){
            users[i]=activeUserTemp;
            break;
        }
    }
    localStorage.activeUser = JSON.stringify(activeUserTemp);
    localStorage.users = JSON.stringify(users);
});

//RENDER FAVOURITE MOVIES
function renderFavouriteMovies(){
    $.each(activeUser.favouriteMovies,function(index,value){
       var movieArticle ="<article id='" + index + "' class='movie-div-template'><div id='poster" + index + 
        "' class='poster'></div><p id='title" + index + 
        "' class='title'></p></article>";
            $("#favouriteMovies").append(movieArticle);
                var tempTitle = value.title || value.Title;
                var tempPoster = value.poster  || value.Poster;
                var tempYear = value.year  || value.Year;

                setDivFavourite(tempTitle,tempPoster,tempYear,index);
                var article = document.getElementById(index);
                addFavouriteMovieEvent(article);   
                
})
}

function setDivFavourite(title, poster, year, ID){
        if (title === undefined || year === undefined) {
            return;
        } else{
        var posterDiv = document.getElementById("poster"+ ID);
        var titleDiv = document.getElementById("title" + ID);
        if(title.length > 35) {
            titleDiv.innerHTML = title.substring(0, 31) + "... (" + year + ")";
        } else {
            if(titleDiv === null)
                return;
            titleDiv.innerHTML = title + " (" + year + ")";
        }
        
        //set poster image
        var image = document.createElement("IMG");
        image.src = poster;
        image.alt= title;
        image.style.maxWidth = "180px";
        image.style.maxHeight = "250px";
        posterDiv.appendChild(image);
    }
};

function addFavouriteMovieEvent(article){
    // When the user clicks on the movie, open the modal and display the movie
    article.addEventListener("click", displayMovie);
}

