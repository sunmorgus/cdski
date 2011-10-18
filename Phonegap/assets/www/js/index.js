$(function() {

});
//var _storage = window.localStorage;
var _gameObj;

$j(document).bind("pagebeforechange", function(e, data) {
	if (typeof data.toPage === "string") {
		var u = $j.mobile.path.parseUrl(data.toPage);
		switch (u.hash) {
		case "#game":
			break;
		default:
			_gameObj.StopMainLoop();
			_gameObj = null;
			break;
		}
	}
});

$j(document).bind("pagechange", function(e, data) {
	if (typeof data.toPage.selector === "string") {
		if (data.toPage.selector.indexOf("game") >= 0) {
			snowStorm.stop();
			snowStorm.freeze();

			var params = {
				chosen : "riley"
			}
			
			_gameObj = new Game();
			_gameObj.SetupCanvas(params);
			$j(window).resize(function() {
				_gameObj.SetupCanvas(params)
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
}

// app exit
function onPause() {
	_gameObj.StopMainLoop();
}

// app open
function onResume() {
	// StartMainLoop();
}

function printObjProps(obj){
	 var str="";
	 for(prop in obj)
	 {
	 str += prop + " value: " + obj[prop] + "\n";
	 }
	 console.log(str); // Show all properties and its value	
}