function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
	this.controller.pushScene("start");
}

/*
 * This function will push a passed in scene.  The reason we are using a special function here is that
 * for file organization purposes we have put scene files in sub directories & to load them from these
 * locations requires that we use the name and sceneTemplate properties when pushing the scenes.
 */
StageAssistant.prototype.showScene = function(directory, sceneName, arguments){
    if (arguments === undefined) {
        this.controller.pushScene({
            name: sceneName,
            sceneTemplate: directory + "/" + sceneName + "-scene"
        })
    }
    else {
        this.controller.pushScene({
            name: sceneName,
            sceneTemplate: directory + "/" + sceneName + "-scene"
        }, arguments)
    }
}