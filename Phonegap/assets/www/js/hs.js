var globalHsUrl = 'http://hide.rjamdev.info/monstertrucks/skiprehs.php?method=%s';
/*
 * Start SQL Queries
 */
var getScoresQuery = 'select name, score, global_id from highScore order by score desc, id asc limit 100;';
var checkScoreQuery = 'select score from highScore where %s > (select score from (select score from highScore order by score desc limit 10) order by score asc limit 1);';
var insertHighScoreQuery = 'INSERT INTO highScore (id, name, score, global_id) VALUES (?,?,?,?); GO;'
/*
 * End SQL Queries
 */

/*
 * Start List Binding
 */
function BuildLocalList(tx, results) {
	$j('#localHsList').empty();
	var len = results.rows.length;
	for ( var i = 0; i < len; i++) {
		var item = results.rows.item(i);
		var star = "";
		if (item.global_id == 0)
			star = "*";
		var listItem = sprintf('<li>%s<span style="float: right;">%s%s</span></li>"', item.name, item.score, star);
		$j(listItem).appendTo($j('#localHsList'));
		if (i === 0) {
			_local.setItem('topScore', item.score);
			_local.setItem('globalScoreId', item.global_id);
		}
	}
	$j('#localHsList').listview('refresh');
	if (len == 0)
		SetHeaderMessage("noScores");
	else
		document.getElementById('noScores').style.display = 'none';
	
	var globalId = _local.getItem('globalScoreId');
	if (globalId != null && globalId != 0) {
		var topScore = _local.getItem('topScore');
		var getRankQuery = sprintf('r&g=%s', globalId);
		var getRankUrl = sprintf(globalHsUrl, getRankQuery);
		$j.ajax({
				url : getRankUrl,
				dataType : 'json',
				success : function(data) {
					var message = sprintf('Your highest score of %s ranks %s out of %s on the Global High Score list!', topScore, data[0].rank, data[0].count);
					SetHeaderMessage(message);
				}
		});
	}
	
	$j.mobile.hidePageLoadingMsg();
}

function BuildGlobalList() {
	$j.ajax({
			url : sprintf(globalHsUrl, 's'),
			dataType : 'json',
			success : function(data) {
				$j('#globalHsList').empty();
				var len = data.length;
				for ( var i = 0; i < len; i++) {
					var item = data[i];
					var listItem = sprintf('<li>%s<span style="float: right;">%s</span></li>"', item.name, item.score);
					$j(listItem).appendTo($j('#globalHsList'));
				}
				$j('#globalHsList').listview('refresh');
				$j.mobile.hidePageLoadingMsg();
			},
			error : function(jqXHR, textStatus, errorThrown) {
				$j.mobile.hidePageLoadingMsg();
			}
	})
}

function GetLocalHsList() {
	if(_db != null){
		_score = null;
		_db.transaction(function(tx) {
			tx.executeSql(getScoresQuery, [], BuildLocalList, DbError);
		}, DbError);
	}
}
/*
 * End List Binding
 */

/*
 * Start Score Check/Insert
 */

function CheckScore(score) {
	if(_db != null){
		var query = sprintf(checkScoreQuery, score);
		_db.transaction(function(tx) {
			tx.executeSql(query, [], IsHighScore, DbError);
		}, DbError);
	} else {
		//insert score globally, skipping local score
	}
}

function IsHighScore(tx, results) {
	var len = results.rows.length;
	var score = _score;
	if (results.rows.length > 0 || $j('#localHsList').html() == "") {
		var congratsMsg = sprintf("Congratulations!\r\n%s is a new High Score!\r\n\r\nEnter your name below to submit your score!", _score);
		var storedName = _local.getItem("name");
		var name = prompt(congratsMsg, storedName);
		if (name != null && name != "") {
			_local.setItem("name", name);
			InsertGlobalHighScore(name, score);
		} else {
			_score = null;
			GetLocalHsList();
		}
	} else {
		GetLocalHsList();
	}
}

function InsertGlobalHighScore(name, score) {
	var urlQuery = sprintf("i&n=%s&s=%s", name, score);
	var insertUrl = sprintf(globalHsUrl, urlQuery);
	$j.ajax({
			url : insertUrl,
			success : function(data) {
				var globalId = data;
				InsertHighScore(name, score, globalId);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				InsertHighScore(name, score, 0);
			}
	});
}

function InsertHighScore(name, score, global_id) {
	_db.transaction(function(tx) {
		tx.executeSql(insertHighScoreQuery, [ Math.random(), name, score, global_id ], function(tx, results) {
			GetLocalHsList();
		}, DbError);
	}, DbError);
}

/*
 * End Score Check/Insert
 */

/*
 * Start Utility Functions
 */
function SetHeaderMessage(type) {
	switch (type) {
	case "noScores":
		$j('#hsHeader').html('You have no high scores!');
		document.getElementById('noScores').style.display = 'block';
		break;
	default:
		$j('#hsHeader').html(type);
		document.getElementById('noScores').style.display = 'none';
		break;
	}
}
/*
 * End Utility Functions
 */