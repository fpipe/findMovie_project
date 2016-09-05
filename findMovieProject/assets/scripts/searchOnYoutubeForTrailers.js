// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms
var YT = 'undefined';
// Helper function to display JavaScript value on HTML page.
function showResponse(response) {
    YT = response;
}

// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {
    // This API key is intended for use only in this lesson.
    // See http://goo.gl/PdPA1 to get a key for your own applications.
    gapi.client.setApiKey('AIzaSyD49-XZ2JV7Rws3KDM2T7nA56Jbi-O7djY');
}

function getRequest() {
    var request = gapi.client.youtube.search.list({
        part: 'snippet',
        kind: 'youtube#video',
        q: document.getElementById("artiest").value + " - " + document.getElementById("nummer").value,
    });

    // Send the request to the API server,
    // and invoke onSearchRepsonse() with the response.
    return request;

}

$(document).ready(function() {
    $('#muziek').on('submit', function() {
        var request = getRequest();
        request.execute(function(response) {
            $('#muziek').unbind('submit');
            YT = response;
            document.getElementById("VideoURL").value = YT.items[0].id.videoId;
            $('#muziek').submit();
        });     
        return false;
    });
});