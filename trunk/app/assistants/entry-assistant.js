function EntryAssistant(sceneAssistant, callbackFunc, score){
    this.callbackFunc = callbackFunc;
    this.sceneAssistant = sceneAssistant;
    this.controller = sceneAssistant.controller;
    this.score = score;
}

EntryAssistant.prototype.setup = function(widget){
    this.widget = widget;
    this.controller.stageController.setWindowProperties({
        fastAccelerometer: false,
        blockScreenTimeout: false
    });
    var attributes = {
        hintText: 'Enter Your Name',
        textFieldName: 'name',
        modelProperty: 'original',
        changeOnKeyPress: true,
        focus: true
    };
    
    this.cookie = new Mojo.Model.Cookie('hsNameSkiPre');
    if (this.cookie.get()) 
        var lastName = this.cookie.get().hsname;
    
    this.model = {
        'original': lastName,
        disabled: false
    };
    this.controller.setupWidget('textField', attributes, this.model);
    
    this.save = this.save.bindAsEventListener(this);
    this.cancel = this.cancel.bindAsEventListener(this);
    
    Mojo.Event.listen($('save'), Mojo.Event.tap, this.save);
    Mojo.Event.listen($('cancel'), Mojo.Event.tap, this.cancel);
}

EntryAssistant.prototype.activate = function(event){
    $('score').innerHTML = this.score + ' is a new High Score!';
}

EntryAssistant.prototype.deactivate = function(event){
}

EntryAssistant.prototype.cleanup = function(event){
    this.controller.stopListening($('save'), Mojo.Event.tap, this.save);
    this.controller.stopListening($('cancel'), Mojo.Event.tap, this.cancel)
}

EntryAssistant.prototype.save = function(event){
    var name = this.model['original'];
    this.cookie = new Mojo.Model.Cookie('hsNameSkiPre');
    this.cookie.put({
        hsname: name
    });
    this.callbackFunc(name);
    this.widget.mojo.close();
}

EntryAssistant.prototype.cancel = function(event){
    this.widget.mojo.close();
}
