<?php

$USERNAME = 'abominable';
$PASSWORD = 'VPjwQfRZ7HVGFYwj';
$DATABASE = 'skipre';
$URL = 'localhost';

function getScores(){
	global $URL, $USERNAME, $PASSWORD, $DATABASE;
	mysql_connect($URL, $USERNAME, $PASSWORD);
	mysql_select_db($DATABASE) or die('Cannot Connect to Database');

	$returnArray = array();

	$query = 'select id, name, score, @rownum:=@rownum+1 "rank" from highscore, (select @rownum:=0) r order by score desc, id asc limit 100;';
	$result = mysql_query($query);

	while($row = mysql_fetch_assoc($result)){
		array_push($returnArray, $row);
	}

	mysql_close();

	echo json_encode($returnArray);
}

function insertScore($name, $score){
	global $URL, $USERNAME, $PASSWORD, $DATABASE;
	mysql_connect($URL, $USERNAME, $PASSWORD);
	mysql_select_db($DATABASE) or die('Cannot Connect to Database');

	$query = "insert into highscore (name, score, date) values ('$name', '$score', NOW());";

	if(!mysql_query($query)){
		echo 0;
		die;
	}
	else{
		echo mysql_insert_id();
	}

	mysql_close();
}

function getWebTable($num){
	global $URL, $USERNAME, $PASSWORD, $DATABASE;
	mysql_connect($URL, $USERNAME, $PASSWORD);
	mysql_select_db($DATABASE) or die('Cannot Connect to Database');

	$returnArray = array();

	$query = 'select id, name, score, @rownum:=@rownum+1 "rank" from highscore, (select @rownum:=0) r order by score desc, id asc limit 10;';
	$result = mysql_query($query);

	while($row = mysql_fetch_assoc($result)){
		array_push($returnArray, $row);
	}

	mysql_close();

	echo '<table>';

	foreach($returnArray as $record){
		echo '<tr style="border-bottom: solid">';
		echo '<td>' . $record["rank"] . '.</td>';
		echo '<td>' . $record["name"] . '</td>';
		echo '<td>' . $record["score"] . '</td>';
		echo '</tr>';
	}

	echo '</table>';
}

function getRank($id){
	global $URL, $USERNAME, $PASSWORD, $DATABASE;
	mysql_connect($URL, $USERNAME, $PASSWORD);
	mysql_select_db($DATABASE) or die('Cannot Connect to Database');

	if($id !== 0){
		$query = "select a.rank+b.rank as rank, (select count(*) from highscore) count
			from (SELECT count(*)+1 as rank FROM highscore where score > (select score from highscore where id = $id)) as a
			straight_join
			(SELECT count(*) as rank FROM highscore where score = (select score from highscore where id = $id) and id < $id ) as b";
	}

	$result = mysql_query($query);

	while($row = mysql_fetch_assoc($result)){
		$returnArray = array($row);
	}

	echo json_encode($returnArray);

	mysql_close();
}

if(isset($_GET['method'])){
	$get = $_GET['method'];
	switch($get){
		case 's':
			getScores();
			break;
		case 'i':
			if(isset($_GET['n']) && isset($_GET['s'])){
				$name = $_GET['n'];
				$score = $_GET['s'];
				insertScore($name, $score);
			}
			else{
				echo 0;
			}
			break;
		case 'r':
			if(isset($_GET['g'])){
				$gId = $_GET['g'];
				getRank($gId);
			}
			break;
		case 'w':
			$num = 10;
			if(isset($_GET['m'])){
				$num = 0;
			}
			getWebTable($num);
			break;
	}
}

?>
