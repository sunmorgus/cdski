function ChangesAssistant(){
}

ChangesAssistant.prototype.setup = function(){
    this.cmdMenuModel = {
        label: $L('Menu Demo'),
        items: [{}, {
            label: $L('Ok, I\'ve Read...Let\'s Continue'),
            command: 'ok'
        }, {}]
    };
    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, this.cmdMenuModel);
};

ChangesAssistant.prototype.handleCommand = function(event){
    this.controller = Mojo.Controller.stageController.activeScene();
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'ok':
                this.cookie = new Mojo.Model.Cookie('showChanges1-7-0');
                this.cookie.put({
					viewed: true
				});
                this.controller.stageController.pushScene('start');
                break;
        }
    }
}

ChangesAssistant.prototype.activate = function(event){
};

ChangesAssistant.prototype.deactivate = function(event){

};

ChangesAssistant.prototype.cleanup = function(event){

};
