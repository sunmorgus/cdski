$(function() {

});
var storage = window.localStorage;

$(document).bind("pagebeforechange", function(e, data) {

});

$(document).bind("pagechange", function(e, data) {
//	alert(typeof data.toPage.selector);
//	var str="";
//	for(prop in data.toPage)
//	{
//		str += prop + " value: " + data.toPage[prop] + "\n";
//	}
//	console.log(str); // Show all properties and its value
	if (typeof data.toPage.selector === "string") {
		if(data.toPage.selector.indexOf("game.html") >= 0){
			SetupCanvas();
		}
	}
});
function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
	// Register the event listener
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);

	// start the snow
	snowStorm.show();
	snowStorm.resume();
}

// app exit
function onPause() {
}

// app open
function onResume() {
}