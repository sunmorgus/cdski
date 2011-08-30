function OptionsAssistant() {

}

OptionsAssistant.prototype.setup = function() {
    this.controller.enableFullScreenMode(true);

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

    this.leftKeyAttr = {
        textCase: Mojo.Widget.steModeLowerCase,
        autoFocus: false,
        maxLength: 1,
        focusMode: Mojo.Widget.focusSelectMode,
        holdToEnable: true
    }

    this.rightKeyAttr = {
        textCase: Mojo.Widget.steModeLowerCase,
        autoFocus: false,
        maxLength: 1,
        focusMode: Mojo.Widget.focusSelectMode,
        holdToEnable: true
    }

    this.fastKeyAttr = {
        textCase: Mojo.Widget.steModeLowerCase,
        autoFocus: false,
        maxLength: 1,
        focusMode: Mojo.Widget.focusSelectMode,
        holdToEnable: true
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

    this.controller.setupWidget('default', {},
    {
        buttonLabel: 'Defaults'
    });
    this.defaultButton = this.defaultButton.bind(this);
    Mojo.Event.listen($('default'), Mojo.Event.tap, this.defaultButton);
    
    this.controller.setupWidget('back', {}, {
    	buttonLabel: "Back"
    });
    this.backButton = this.backButton.bind(this);
    Mojo.Event.listen($('back'), Mojo.Event.tap, this.backButton);

    this.controller.setupWidget('leftkey', this.leftKeyAttr, this.leftKeyModel);
    this.controller.setupWidget('rightkey', this.rightKeyAttr, this.rightKeyModel);
    this.controller.setupWidget('fastkey', this.fastKeyAttr, this.fastKeyModel);
    
    if(jQuery(window).height() < 700){
    	$('preOptions').style.visibility = 'visible';
    }
};
OptionsAssistant.prototype.skierRiley = function() {
    this.chosenSkier = 'riley';
};
OptionsAssistant.prototype.skierAiden = function() {
    this.chosenSkier = 'aiden';
};
OptionsAssistant.prototype.ftogglePressed = function(event) {
    this.fButtonVisible = event.value;
};
OptionsAssistant.prototype.ptogglePressed = function(event) {
    switch (event.value) {
        case true:
            this.skierRiley();
            break;
        case false:
            this.skierAiden();
            break;
    }
};
OptionsAssistant.prototype.ctogglePressed = function(event) {
    this.tilt = event.value;
};
OptionsAssistant.prototype.defaultButton = function(event) {
    this.cookie = new Mojo.Model.Cookie('optionsSkiPre');
    this.cookie.remove();
    var reload = setTimeout( function() {
        this.loadOptions();
        this.controller.setWidgetModel('noFButton', this.ftModel);
        this.controller.setWidgetModel('avatar', this.ptModel);
        this.controller.setWidgetModel('control', this.ctModel);
        this.controller.setWidgetModel('leftkey', this.leftKeyModel);
        this.controller.setWidgetModel('rightkey', this.rightKeyModel);
        this.controller.setWidgetModel('fastkey', this.fastKeyModel);
    }
    .bind(this), 1000);

};
OptionsAssistant.prototype.backButton = function(event){
	this.controller.stageController.popScene();
};
OptionsAssistant.prototype.loadOptions = function() {
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
        } else {
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

        this.leftKeyModel = {
            value: (this.cookie.get().leftKey) ? this.cookie.get().leftKey : "a",
            disabled: true
        }

        this.rightKeyModel = {
            value: (this.cookie.get().rightKey) ? this.cookie.get().rightKey : "d",
            disabled: true
        }
        
        this.fastKeyModel = {
          value: (this.cookie.get().fastKey) ? this.cookie.get().fastKey : "f",
          disabled: true
        }
    } else {
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

        this.leftKeyModel = {
            value: "a",
            disabled: true
        }

        this.rightKeyModel = {
            value: "d",
            disabled: true
        }
        
        this.fastKeyModel = {
          value: "f",
          disabled: true
        }
    }

    this.controller.setupWidget('noFButton', this.ftattr, this.ftModel);
    this.controller.setupWidget('avatar', this.ptattr, this.ptModel);
    this.controller.setupWidget('control', this.ctattr, this.ctModel);
}
OptionsAssistant.prototype.activate = function(event) {

};
OptionsAssistant.prototype.deactivate = function(event) {
    var params = {
        chosen: this.chosenSkier,
        fButtonVisible: this.fButtonVisible,
        tilt: this.tilt,
        leftKey: this.leftKeyModel.value,
        rightKey: this.rightKeyModel.value,
        fastKey: this.fastKeyModel.value
    }

    this.cookie = new Mojo.Model.Cookie('optionsSkiPre');
    this.cookie.put({
        fButton: params.fButtonVisible,
        chosen: params.chosen,
        tilt: params.tilt,
        leftKey: params.leftKey,
        rightKey: params.rightKey,
        fastKey: params.fastKey
    })
};
OptionsAssistant.prototype.cleanup = function(event) {
    this.controller.stopListening($('noFButton'), Mojo.Event.propertyChange, this.ftogglePressed);
    this.controller.stopListening($('avatar'), Mojo.Event.propertyChange, this.ptogglePressed);
    this.controller.stopListening($('control'), Mojo.Event.propertyChange, this.ctogglePressed);
    this.controller.stopListening($('default'), Mojo.Event.tap, this.defaultButton);
    this.controller.stopListening($('back'), Mojo.Event.tap, this.backButton);
};
