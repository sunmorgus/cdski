// var _storage = window.localStorage;
var _gameObj;
var _moveX = null;
// do i use this?
var _score = null;
var _db;
var _local = window.localStorage;

/*
 * Begin jQuery Events
 */
$j('#quit').live('tap', function(e) {
	//this.StopMainLoop();
	$j.mobile.changePage($j('#index'));
});

$j('#newGameButton').live('tap', function(e) {
	StopDefaults(e);

	StartNewGame();
});

$j('#hsButton').live('tap', function(e) {
	StopDefaults(e);
	// if (_db != null)
	$j.mobile.changePage($j('#hs'));
	// else
	// alert('High Scores are only available to users of the Mobile Application
	// (Android and/or webOS)');
});

$j('#helpButton').live('tap', function(e) {
	StopDefaults(e);

	$j.mobile.changePage($j('#help'));
});

$j('#globalHsButton').live('tap', function(e) {
	$j('#localHsList').hide();
	$j('#localHsButton').removeClass('ui-btn-active');

	$j('#globalHsList').show();
	$j('#globalHsButton').addClass('ui-btn-active');

	BuildGlobalList();
});

$j('#localHsButton').live('tap', function(e) {
	$j('#localHsList').show();
	$j('#localHsButton').addClass('ui-btn-active');

	$j('#globalHsList').hide();
	$j('#globalHsButton').removeClass('ui-btn-active');

	GetLocalHsList();
});

$j('#homeButton').live('tap', function(e) {
	StopDefaults(e);

	$j.mobile.changePage($j('#index'));
});

// if coming from the game page, stop game loop, make the _gameObj null
$j('#game').live("pagehide", function(e, data) {
	if (_gameObj != null) {
		_gameObj.StopMainLoop();
		_gameObj = null;
	}

	snowStorm.show();
	snowStorm.resume();
});

$j('#hs').live("pageshow", function(e, data) {
	$j.mobile.showPageLoadingMsg();

	if (_db != null) {
		$j('#localHsList').show();
		$j('#localHsButton').addClass('ui-btn-active');

		$j('#globalHsList').hide();
		$j('#globalHsButton').removeClass('ui-btn-active');
	} else {

		$j('#localHsList').hide();
		$j('#localHsButton').removeClass('ui-btn-active');
		$j('#localHsButton').hide();

		$j('#globalHsList').show();
		$j('#globalHsButton').addClass('ui-btn-active');
	}

	if (_score != null) {
		var score = _score;
		var score = Math.floor(Math.round(score));
		CheckScore(score);
		_score = null;
	} else {
		if (_db != null) {
			$j('#globalHsList').hide();
			GetLocalHsList();
		} else {
			$j('#localHsList').hide();
			BuildGlobalList();
		}
	}
});

$j(document).bind('mobileinit', function() {
	$j.mobile.loadingMessage = "Loading Local & Global Scores";
});
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
	//document.addEventListener("backbutton", onBack, false);

	$j.mobile.changePage($j('#index'));

	if (window.openDatabase) {
		// open the hs db
		_db = window.openDatabase("hsdb", "1.0", "SkiPre High Score Database", 200000);
		_db.transaction(function(tx) {
			var queryString = 'CREATE TABLE IF NOT EXISTS highScore (id TEXT PRIMARY KEY DESC DEFAULT "nothing", name TEXT NOT NULL DEFAULT "nothing", score INTEGER NOT NULL DEFAULT "nothing", global_id INTEGER NULL DEFAULT "0"); GO;';
			tx.executeSql(queryString);
		}, DbError, function(tx, results) {
		});
	} else {
		//alert('no db support');
	}

	// start the snow
	snowStorm.show();
	snowStorm.resume();
}

// app exit
function onPause() {
	if (_gameObj != null)
		_gameObj.StopMainLoop();

	snowStorm.stop();
	snowStorm.freeze();
}

// app open
function onResume() {
	$j.mobile.changePage($j('#index'));
	snowStorm.show();
	snowStorm.resume();
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
	};

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
	return str;
	// Show all properties and its value
}

function DbError(err) {
	alert("Error processing SQL: " + err.code);
}

function IsTouchDevice() {
	try {
		document.createEvent("TouchEvent");
		return true;
	} catch (e) {
		return false;
	}
}

function getQueryString() {
	var result = {}, queryString = location.search.substring(1), re = /([^&=]+)=([^&]*)/g, m;

	while ( m = re.exec(queryString)) {
		result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}

	return result;
}

/*
 * End Utility Functions
 */