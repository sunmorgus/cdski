$(function() {

});
// var _storage = window.localStorage;
var _gameObj;
var _moveX = null;

/*
 * Begin jQuery Events
 */
$j('#newGameButton').live('tap', function(e) {
	StopDefaults(e);

	StartNewGame();
});

$j('#hsButton').live('tap', function(e) {
	StopDefaults(e);

	$j.mobile.changePage($j('#hs'));
});

$j('#helpButton').live('tap', function(e) {
	StopDefaults(e);

	$j.mobile.changePage($j('#help'));
});

// if coming from the game page, stop game loop, make the _gameObj null, and
// remove game page from dom.
$j('#game').live("pagehide", function(e, data) {
	if (_gameObj != null) {
		_gameObj.StopMainLoop();
		_gameObj = null;
	}
})

$j('#hs').live("pageshow", function(e, data) {
	$j.mobile.showPageLoadingMsg();
	$j('#globalHsList').hide();
	BuildLocalList();
	BuildGlobalList();
})
/*
 * End jQuery Events
 */

/*
 * Begin phonegap events
 */
function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
	// Register the event listener
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	document.addEventListener("backbutton", onBack, true);

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
	$j.mobile.changePage($j('#index'));
}

// back button
function onBack() {
	$j.mobile.changePage($j('#index'));
}
/*
 * End phonegap Events
 */

/*
 * Begin Methods
 */
function StartNewGame() {
	snowStorm.stop();
	snowStorm.freeze();

	var params = {
		chosen : "riley"
	}

	_gameObj = new Game();
	_gameObj.SetupCanvas(params);
	$j(window).resize(function() {
		_gameObj.SetupCanvas(params);
	});

	$j.mobile.changePage($j('#game'));
}
/*
 * End Methods
 */

/*
 * Begin Utility Functions
 */
function StopDefaults(e) {
	e.stopImmediatePropagation();
	e.preventDefault();
}
function printObjProps(obj) {
	var str = "";
	for (prop in obj) {
		str += prop + " value: " + obj[prop] + "\n";
	}
	return str; // Show all properties and its value
}
/*
 * End Utility Functions
 */