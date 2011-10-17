$(function() {

});
var storage = window.localStorage;

$(document).bind("pagebeforechange", function(e, data) {
	if (typeof data.toPage === "string") {
		var u = $.mobile.path.parseUrl(data.toPage);
		switch (u.hash) {
		case "#game":
			break;
		default:
			_obstacles.splice(0, _obstacles.length);
			var params = {
				chosen : "riley"
			}

			SetupCanvas(params);
			break;
		}
	}
});

$(document).bind("pagechange", function(e, data) {
	// alert(typeof data.toPage.selector);
	// var str="";
	// for(prop in data.toPage)
	// {
	// str += prop + " value: " + data.toPage[prop] + "\n";
	// }
	// console.log(str); // Show all properties and its value
	if (typeof data.toPage.selector === "string") {
		if (data.toPage.selector.indexOf("game") >= 0) {
			snowStorm.stop();
			snowStorm.freeze();

			var params = {
				chosen : "riley"
			}

			SetupCanvas(params);
			$(window).resize(function() {
				SetupCanvas(params)
			});
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

	$('.ui-page').css('minHeight', screen.availHeight);
}

// app exit
function onPause() {
	StopMainLoop();
}

// app open
function onResume() {
	// StartMainLoop();
}