SkiPre = {};
SkiPre.lite = 'com.rjamdev.skipretrial';
SkiPre.pro = 'com.rjamdev.skipre';

function StageAssistant(){
}

StageAssistant.prototype.setup = function(){
	SkiPre.Metrix = new Metrix();
	SkiPre.Metrix.postDeviceData();
	
	SkiPre.id = Mojo.Controller.appInfo.id;
	
    this.cookie = new Mojo.Model.Cookie(Mojo.Controller.appInfo.version);
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
