var getGlobalHsUrl = 'http://monstertrucks.rjamdev.info/skiprehs.php?method=s';

function BuildLocalList() {
	$j('#localHsList').listview('empty');
	for ( var i = 1; i <= 7; i++) {
		var listItem = '<li>Name<span style="float: right;">' + i + "</span></li>";
		$j(listItem).appendTo($j('#localHsList'));
	}
	$j('#localHsList').listview('refresh');
}

function BuildGlobalList() {
	$j('#hsHeader').html('Your highest score of {0} ranks {1} out of {2} other scores!');

	$j.ajax({
			url : getGlobalHsUrl,
			success : function(data) {
				$j.mobile.hidePageLoadingMsg();
			},
			error : function(jqXHR, textStatus, errorThrown) {
				$j.mobile.hidePageLoadingMsg();
			}
	})
}