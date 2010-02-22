function HelpAssistant(){

    snowStorm.show();
    snowStorm.resume();
}

HelpAssistant.prototype.setup = function(){
    this.forum = this.goForum.bind(this);
    Mojo.Event.listen($('supportForum'), Mojo.Event.tap, this.forum);
    this.contact = this.goContact.bind(this);
    Mojo.Event.listen($('contact'), Mojo.Event.tap, this.contact);
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

HelpAssistant.prototype.deactivate = function(event){
}

HelpAssistant.prototype.cleanup = function(event){
}
