function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
	var x = new Date()
	var y = x.getFullYear()
	var m = x.getMonth() + 1
	var d = x.getDate()
	var dateNow = m + '/' + d + '/' + y
	if (dateNow !== '3/13/2010')
		this.controller.pushScene("start");
}

StageAssistant.prototype.showScene = function(directory, sceneName, arguments) {
	if (arguments === undefined) {
		this.controller.pushScene( {
			name : sceneName,
			sceneTemplate : directory + "/" + sceneName + "-scene"
		})
	} else {
		this.controller.pushScene( {
			name : sceneName,
			sceneTemplate : directory + "/" + sceneName + "-scene"
		}, arguments)
	}
}