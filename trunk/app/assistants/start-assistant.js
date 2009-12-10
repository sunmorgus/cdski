function StartAssistant(params){
    if (params) {
        this.hsDB = params.db;
    }
}

StartAssistant.prototype.hsDB = null;

StartAssistant.prototype.setup = function(){
    this.start = this.startGame.bind(this);
    Mojo.Event.listen($('startGame'), Mojo.Event.tap, this.start);
    
    this.createDB();
}

StartAssistant.prototype.activate = function(event){
}

StartAssistant.prototype.deactivate = function(event){
}

StartAssistant.prototype.cleanup = function(event){
}

StartAssistant.prototype.createDB = function(){
    try {
        var name = "SkiPreDB";
        var version = "0.1";
        
        /* Open (or create) the database */
        this.hsDB = openDatabase(name, version, 'SkiPreDataStore', 100000);
        
        if (this.hsDB) {
            /* Create Table(s) */
            var string = 'CREATE TABLE IF NOT EXISTS highScore (id TEXT PRIMARY KEY DESC DEFAULT "nothing", name TEXT NOT NULL DEFAULT "nothing", score TEXT NOT NULL DEFAULT "nothing"); GO;'
            this.hsDB.transaction((function(transaction){
                transaction.executeSql(string, [])
            }).bind(this));
        }
    } 
    catch (e) {
        console.log('Error: ' + e);
    }
}

StartAssistant.prototype.startGame = function(event){
    var params = {
        chosen: 'riley',
        db: this.hsDB
    }
    
    this.controller.stageController.assistant.showScene("game", 'game', params);
}
