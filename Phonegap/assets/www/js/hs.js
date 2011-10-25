var globalHsUrl = 'http://monstertrucks.rjamdev.info/skiprehs.php?method=%s';
/*
 * Start SQL Queries
 */
var getScoresQuery = 'select name, score, global_id from highScore order by score desc, id asc limit 10;';
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
		if(item.global_id == 0)
			star = "*";
		var listItem = sprintf('<li>%s<span style="float: right;">%s%s</span></li>"', item.name, item.score, star);
		$j(listItem).appendTo($j('#localHsList'));
	}
	$j('#localHsList').listview('refresh');
	$j.mobile.hidePageLoadingMsg();
}

function BuildGlobalList() {
	$j('#hsHeader').html('Your highest score of {0} ranks {1} out of {2} other scores!');

	$j.ajax({
			url : sprintf(globalHsUrl, 's'),
			success : function(data) {
				$j.mobile.hidePageLoadingMsg();
			},
			error : function(jqXHR, textStatus, errorThrown) {
				$j.mobile.hidePageLoadingMsg();
			}
	})
}

function GetLocalHsList() {
	_db.transaction(function(tx) {
		tx.executeSql(getScoresQuery, [], BuildLocalList, DbError);
	}, DbError);
}
/*
 * End List Binding
 */

/*
* Start Score Check/Insert
*/

function CheckScore(score){
	var query = sprintf(checkScoreQuery, score);
	_db.transaction(function(tx){
		tx.executeSql(query, [], IsHighScore, DbError);
	}, DbError);
}

function IsHighScore(tx, results){
	var len = results.rows.length;
	if(results.rows.length > 0 || $j('#localHsList').html() == ""){
		console.log('opening dialog');
		$j('#congrats').html(sprintf("Congratulations! %s is a new High Score!", _score))
		$j.mobile.changePage($j('#entry'), "slideup");
//		InsertHighScore("Nick", _score, 0);
	}
	else{
		GetLocalHsList();
	}
}

function InsertHighScore(name, score, global_id){
	_db.transaction(function(tx){
		tx.executeSql(insertHighScoreQuery, [Math.random(), name, score, global_id], function(tx, results){
			GetLocalHsList();
		}, DbError);
	}, DbError);
}

/*
*End Score Check/Insert
*/