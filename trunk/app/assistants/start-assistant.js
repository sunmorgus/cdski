function StartAssistant() {
}

StartAssistant.prototype.setup = function() {	
	this.start = this.startGame.bind(this);
	Mojo.Event.listen($('startGame'), Mojo.Event.tap, this.start);
}

StartAssistant.prototype.activate = function(event) {
}

StartAssistant.prototype.deactivate = function(event) {
}

StartAssistant.prototype.cleanup = function(event) {
}

StartAssistant.prototype.startGame = function(event){
	this.controller.stageController.assistant.showScene("game", 'game', 'riley');
}
