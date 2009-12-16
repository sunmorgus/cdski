function StartAssistant(params){
    if (params) {
        this.hsDB = params.db;
        this.chosenSkier = params.chosen
    }
}

StartAssistant.prototype.hsDB = null;
StartAssistant.prototype.chosenSkier = null;
StartAssistant.prototype.skier = null;

StartAssistant.prototype.setup = function(){
    this.controller.setupWidget('riley', {}, {
        buttonLabel: 'Skier'
    });
    this.riley = this.skierRiley.bind(this);
    Mojo.Event.listen($('riley'), Mojo.Event.tap, this.riley);
    
    this.controller.setupWidget('aiden', {}, {
        buttonLabel: '\'Boarder'
    });
    this.aiden = this.skierAiden.bind(this);
    Mojo.Event.listen($('aiden'), Mojo.Event.tap, this.aiden);
    
    this.start = this.startGame.bind(this);
    Mojo.Event.listen($('startGame'), Mojo.Event.tap, this.start);
    
    this.highscores = this.highScores.bind(this);
    Mojo.Event.listen($('highScores'), Mojo.Event.tap, this.highscores);
    
    this.createDB();
    
    this.chosenSkier = 'riley';
}

StartAssistant.prototype.activate = function(event){

}

StartAssistant.prototype.deactivate = function(event){
}

StartAssistant.prototype.cleanup = function(event){
    this.controller.stopListening($('riley'), Mojo.Event.tap, this.riley);    
    this.controller.stopListening($('aiden'), Mojo.Event.tap, this.aiden);    
    this.controller.stopListening($('startGame'), Mojo.Event.tap, this.start);    
    this.controller.stopListening($('highScores'), Mojo.Event.tap, this.highscores);
}

StartAssistant.prototype.createDB = function(){
    try {
        var name = "SkiPreDB";
        var version = "0.1";
        
        /* Open (or create) the database */
        this.hsDB = openDatabase(name, version, 'SkiPreDataStore', 100000);
        
        if (this.hsDB) {
            /* Create Table(s) */
            var string = 'CREATE TABLE IF NOT EXISTS highScore (id TEXT PRIMARY KEY DESC DEFAULT "nothing", name TEXT NOT NULL DEFAULT "nothing", score INTEGER NOT NULL DEFAULT "nothing"); GO;'
            this.hsDB.transaction((function(transaction){
                transaction.executeSql(string, [])
            }).bind(this));
        }
    } 
    catch (e) {
        console.log('Error: ' + e);
    }
}

StartAssistant.prototype.skierRiley = function(){
    $('skier').src = 'images/sprites/r/riley_down.png';
}

StartAssistant.prototype.skierAiden = function(){
    $('skier').src = 'images/sprites/r/riley_left.png';
}

StartAssistant.prototype.startGame = function(event){
    var params = {
        chosen: this.chosenSkier,
        db: this.hsDB
    }
    
    this.controller.stageController.assistant.showScene("game", 'game', params);
}

StartAssistant.prototype.highScores = function(event){
    var params = {
        chosen: this.chosenSkier,
        db: this.hsDB
    }
    
    this.controller.stageController.assistant.showScene("highscores", 'highscores', params);
}
