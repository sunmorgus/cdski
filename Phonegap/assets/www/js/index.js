$(function() {

});
var storage = window.localStorage;

$(document).bind("pagebeforechange", function(e, data) {

});
function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
	// Register the event listener
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	
	//start the snow
	snowStorm.show();
	snowStorm.resume();
}

//app exit
function onPause() {
}

//app open
function onResume() {
}