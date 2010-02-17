function HelpAssistant(){

    snowStorm.show();
    snowStorm.resume();
}

HelpAssistant.prototype.setup = function(){
}

HelpAssistant.prototype.activate = function(event){

    snowStorm.show();
    snowStorm.resume();
}


HelpAssistant.prototype.deactivate = function(event){
}

HelpAssistant.prototype.cleanup = function(event){
}
