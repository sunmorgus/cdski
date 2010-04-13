function StartAssistant(params){
    if (params) {
        this.hsDB = params.db;
        this.chosenSkier = params.chosen
    }
    
    snowStorm.show();
    snowStorm.resume();
}

StartAssistant.prototype.hsDB = null;
StartAssistant.prototype.chosenSkier = null;
StartAssistant.prototype.skier = null;
StartAssistant.prototype.options = null;

StartAssistant.prototype.setup = function(){
    this.appMenuModel = {
        visible: true,
        items: [Mojo.Menu.editItem, {
            label: $L('Help'),
            command: 'help'
        }]
    };
    
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    }, this.appMenuModel);
    
    
    this.controller.setupWidget('options', {}, {
        buttonLabel: 'Options'
    });
    this.options = this.options.bind(this);
    Mojo.Event.listen($('options'), Mojo.Event.tap, this.options);
    /*     
     this.controller.setupWidget('aiden', {}, {
     buttonLabel: '\'Boarder'
     });
     this.aiden = this.skierAiden.bind(this);
     Mojo.Event.listen($('aiden'), Mojo.Event.tap, this.aiden);
     */
    this.start = this.startGame.bind(this);
    Mojo.Event.listen($('startGame'), Mojo.Event.tap, this.start);
    
    this.highscores = this.highScores.bind(this);
    Mojo.Event.listen($('highScores'), Mojo.Event.tap, this.highscores);
    
    this.help = this.showHelp.bind(this);
    Mojo.Event.listen($('help'), Mojo.Event.tap, this.help);
    
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
    
    this.cookie = new Mojo.Model.Cookie('optionsSkiPre');
    if (this.cookie.get()) {
        this.ftModel = {
            value: this.cookie.get().fButton
        }
        
        this.fButtonVisible = this.cookie.get().fButton;
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
        if (control) {
            this.tilt = control;
            this.ctModel = {
                value: control
            }
        }
    }
    else {
        this.ftModel = {
            value: false
        }
        
        this.chosenSkier = 'riley';
        this.ptModel = {
            value: true
        }
        
        this.ctModel = {
            value: true
        }
    }
    
/*
    this.controller.setupWidget('noFButton', this.ftattr, this.ftModel);
    this.ftogglePressed = this.ftogglePressed.bindAsEventListener(this);
    Mojo.Event.listen($('noFButton'), Mojo.Event.propertyChange, this.ftogglePressed);
    
    this.controller.setupWidget('avatar', this.ptattr, this.ptModel);
    this.ptogglePressed = this.ptogglePressed.bindAsEventListener(this);
    Mojo.Event.listen($('avatar'), Mojo.Event.propertyChange, this.ptogglePressed);
    
    this.controller.setupWidget('control', this.ctattr, this.ctModel);
    this.ctogglePressed = this.ctogglePressed.bindAsEventListener(this);
    Mojo.Event.listen($('control'), Mojo.Event.propertyChange, this.ctogglePressed);
*/
    
    this.createDB();
}

StartAssistant.prototype.handleCommand = function(event){
    this.controller = Mojo.Controller.stageController.activeScene();
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'help':
                this.controller.stageController.assistant.showScene("help", 'help');
                break;
        }
    }
}

StartAssistant.prototype.options = function(event){
    var params = {
        chosen: this.chosenSkier,
        db: this.hsDB,
        fButtonVisible: this.fButtonVisible,
        tilt: this.tilt
    }
    
    this.cookie = new Mojo.Model.Cookie('optionsSkiPre');
    this.cookie.put({
        fButton: params.fButtonVisible,
        chosen: params.chosen,
        tilt: params.tilt
    })
    
    this.controller.stageController.assistant.showScene("options", 'options', params);
}

StartAssistant.prototype.ftogglePressed = function(event){
    this.fButtonVisible = event.value;
}

StartAssistant.prototype.ptogglePressed = function(event){
    switch (event.value) {
        case true:
            this.skierRiley();
            break;
        case false:
            this.skierAiden();
            break;
    }
}

StartAssistant.prototype.ctogglePressed = function(event){
    this.tilt = event.value;
}

StartAssistant.prototype.activate = function(event){
    snowStorm.show();
    snowStorm.resume();
}

StartAssistant.prototype.deactivate = function(event){
}

StartAssistant.prototype.cleanup = function(event){
    /*
     this.controller.stopListening($('riley'), Mojo.Event.tap, this.riley);
     this.controller.stopListening($('aiden'), Mojo.Event.tap, this.aiden);
     */
    this.controller.stopListening($('startGame'), Mojo.Event.tap, this.start);
    this.controller.stopListening($('highScores'), Mojo.Event.tap, this.highscores);
    this.controller.stopListening($('help'), Mojo.Event.tap, this.help);
    this.controller.stopListening($('noFButton'), Mojo.Event.propertyChange, this.ftogglePressed);
    this.controller.stopListening($('avatar'), Mojo.Event.propertyChange, this.ptogglePressed);
}

StartAssistant.prototype.createDB = function(){
    try {
        var name = "SkiPreDB";
        var version = "0.1";
        
        /* Open (or create) the database */
        this.hsDB = openDatabase(name, version, 'SkiPreDataStore', 100000);
        
        if (this.hsDB) {
            /* Create Table(s) */
            var string = 'CREATE TABLE IF NOT EXISTS highScore (id TEXT PRIMARY KEY DESC DEFAULT "nothing", name TEXT NOT NULL DEFAULT "nothing", score INTEGER NOT NULL DEFAULT "nothing", global_id INTEGER NULL DEFAULT "0"); GO;'
            this.hsDB.transaction((function(transaction){
                transaction.executeSql(string, [], this.addColumn.bind(this))
            }).bind(this));
        }
    } 
    catch (e) {
        console.log('Error DB: ' + e);
    }
}

StartAssistant.prototype.addColumn = function(){
    string = 'ALTER TABLE highScore ADD global_id INTEGER NULL DEFAULT "0"; GO;';
    this.hsDB.transaction((function(transaction){
        transaction.executeSql(string, [])
    }).bind(this));
}

StartAssistant.prototype.skierRiley = function(){
    $('skier').src = 'images/sprites/r/riley_down.png';
    this.chosenSkier = 'riley';
}

StartAssistant.prototype.skierAiden = function(){
    $('skier').src = 'images/sprites/a/aiden_down.png';
    this.chosenSkier = 'aiden';
}

StartAssistant.prototype.startGame = function(event){
    var params = {
        chosen: this.chosenSkier,
        db: this.hsDB,
        fButtonVisible: this.fButtonVisible,
        tilt: this.tilt
    }
    
    this.cookie = new Mojo.Model.Cookie('optionsSkiPre');
    this.cookie.put({
        fButton: params.fButtonVisible,
        chosen: params.chosen,
        tilt: params.tilt
    })
    
    this.controller.stageController.assistant.showScene("game", 'game', params);
}

StartAssistant.prototype.highScores = function(event){
    var params = {
        chosen: this.chosenSkier,
        db: this.hsDB
    }
    
    this.controller.stageController.assistant.showScene("highscores", 'highscores', params);
}

StartAssistant.prototype.showHelp = function(event){
    this.controller.stageController.assistant.showScene("help", 'help');
}
