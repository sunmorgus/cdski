function OptionsAssistant(){

}

OptionsAssistant.prototype.setup = function(){
    this.controller.stageController.setWindowProperties({
        fastAccelerometer: false,
        blockScreenTimeout: false
    });
    
    this.ftattr = {
        trueLabel: 'yes',
        falseLabel: 'no'
    }
    
    this.ptattr = {
        trueLabel: 'Skier',
        falseLabel: '\'Boarder'
    }
    
    this.ctattr = {
        trueLabel: 'Tilt',
        falseLabel: 'Key'
    }
    
    this.loadOptions();
    
    this.controller.setupWidget('noFButton', this.ftattr, this.ftModel);
    this.ftogglePressed = this.ftogglePressed.bindAsEventListener(this);
    Mojo.Event.listen($('noFButton'), Mojo.Event.propertyChange, this.ftogglePressed);
    
    this.controller.setupWidget('avatar', this.ptattr, this.ptModel);
    this.ptogglePressed = this.ptogglePressed.bindAsEventListener(this);
    Mojo.Event.listen($('avatar'), Mojo.Event.propertyChange, this.ptogglePressed);
    
    this.controller.setupWidget('control', this.ctattr, this.ctModel);
    this.ctogglePressed = this.ctogglePressed.bindAsEventListener(this);
    Mojo.Event.listen($('control'), Mojo.Event.propertyChange, this.ctogglePressed);
    
    this.controller.setupWidget('default', {}, {
        buttonLabel: 'Defaults'
    });
    this.defaultButton = this.defaultButton.bind(this);
    Mojo.Event.listen($('default'), Mojo.Event.tap, this.defaultButton);
    
};

OptionsAssistant.prototype.skierRiley = function(){
    this.chosenSkier = 'riley';
};

OptionsAssistant.prototype.skierAiden = function(){
    this.chosenSkier = 'aiden';
};

OptionsAssistant.prototype.ftogglePressed = function(event){
    this.fButtonVisible = event.value;
};

OptionsAssistant.prototype.ptogglePressed = function(event){
    switch (event.value) {
        case true:
            this.skierRiley();
            break;
        case false:
            this.skierAiden();
            break;
    }
};

OptionsAssistant.prototype.ctogglePressed = function(event){
    this.tilt = event.value;
};

OptionsAssistant.prototype.defaultButton = function(event){
    this.cookie = new Mojo.Model.Cookie('optionsSkiPre');
    this.cookie.remove();
    var reload = setTimeout(function(){
        this.loadOptions();
        this.controller.setWidgetModel('noFButton', this.ftModel);
        this.controller.setWidgetModel('avatar', this.ptModel);
        this.controller.setWidgetModel('control', this.ctModel);
    }
.bind(this), 1000);
    
};

OptionsAssistant.prototype.loadOptions = function(){
    this.cookie = new Mojo.Model.Cookie('optionsSkiPre');
    if (this.cookie.get()) {
        var f = this.cookie.get().fButton;
        this.ftModel = {
            value: f
        }
        this.fButtonVisible = f;
        
        var chosenS = this.cookie.get().chosen;
        var ptModelCookie;
        if (chosenS) {
            switch (chosenS) {
                case 'riley':
                    this.skierRiley();
                    ptModelCookie = true;
                    break;
                case 'aiden':
                    this.skierAiden();
                    ptModelCookie = false;
                    break;
            }
        }
        else {
            this.chosenSkier = 'riley';
            ptModelCookie = true;
        }
        
        this.ptModel = {
            value: ptModelCookie
        }
        
        var control = this.cookie.get().tilt;
        this.tilt = control;
        this.ctModel = {
            value: control
        }
    }
    else {
        this.ftModel = {
            value: false
        }
        this.fButtonVisible = false;
        
        this.ptModel = {
            value: true
        }
        this.chosenSkier = 'riley';
        
        this.ctModel = {
            value: true
        }
        this.tilt = true;
    }
    
    this.controller.setupWidget('noFButton', this.ftattr, this.ftModel);
    this.controller.setupWidget('avatar', this.ptattr, this.ptModel);
    this.controller.setupWidget('control', this.ctattr, this.ctModel);
}

OptionsAssistant.prototype.activate = function(event){

};

OptionsAssistant.prototype.deactivate = function(event){
    console.log(this.fButtonVisible);
    var params = {
        chosen: this.chosenSkier,
        fButtonVisible: this.fButtonVisible,
        tilt: this.tilt
    }
    
    this.cookie = new Mojo.Model.Cookie('optionsSkiPre');
    this.cookie.put({
        fButton: params.fButtonVisible,
        chosen: params.chosen,
        tilt: params.tilt
    })
};

OptionsAssistant.prototype.cleanup = function(event){
    this.controller.stopListening($('noFButton'), Mojo.Event.propertyChange, this.ftogglePressed);
    this.controller.stopListening($('avatar'), Mojo.Event.propertyChange, this.ptogglePressed);
    this.controller.stopListening($('control'), Mojo.Event.propertyChange, this.ctogglePressed);
    this.controller.stopListening($('default'), Mojo.Event.tap, this.defaultButton);
};
