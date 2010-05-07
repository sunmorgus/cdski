function StageAssistant(){
}

StageAssistant.prototype.setup = function(){
    this.cookie = new Mojo.Model.Cookie('showChanges1-7-4');
    if (this.cookie.get()) {
        this.controller.pushScene("start");
    }
    else {
        this.controller.pushScene("changes");
    }
}

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
