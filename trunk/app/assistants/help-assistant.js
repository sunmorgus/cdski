function HelpAssistant(){

    snowStorm.show();
    snowStorm.resume();
}

HelpAssistant.prototype.setup = function(){
	this.controller.enableFullScreenMode(true);
	
    this.forum = this.goForum.bind(this);
    Mojo.Event.listen($('supportForum'), Mojo.Event.tap, this.forum);
    this.contact = this.goContact.bind(this);
    Mojo.Event.listen($('contact'), Mojo.Event.tap, this.contact);
	this.changes = this.goChanges.bind(this);
	Mojo.Event.listen($('changes'), Mojo.Event.tap, this.changes);
    
    this.controller.stageController.setWindowProperties({
        fastAccelerometer: false,
        blockScreenTimeout: false
    });
}

HelpAssistant.prototype.activate = function(event){
    snowStorm.show();
    snowStorm.resume();
}

HelpAssistant.prototype.goForum = function(){
    window.location = "http://support.rjamdev.info";
}

HelpAssistant.prototype.goContact = function(){
    window.location = "http://rjamdev.info/?page_id=32";
}

HelpAssistant.prototype.goChanges = function(event){
	this.controller.stageController.pushScene('changes');
}

HelpAssistant.prototype.deactivate = function(event){
}

HelpAssistant.prototype.cleanup = function(event){
	this.controller.stopListening($('supportForum'), Mojo.Event.tap, this.forum);
	this.controller.stopListening($('contact'), Mojo.Event.tap, this.contact);
	this.controller.stopListening($('changes'), Mojo.Event.tap, this.changes);
}
