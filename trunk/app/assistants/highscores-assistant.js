function HighscoresAssistant(params){
    this.hsDB = params.db;
    if (params.score) {
        this.Score = params.score;
    }
    if (params.skier) {
        this.chosenSkier = params.skier;
    }
}

HighscoresAssistant.prototype.setup = function(){
    this.appMenuModel = {
        visible: true,
        items: [Mojo.Menu.editItem, {
            label: $L('Clear High Scores'),
            command: 'clearScores'
        }]
    };
    
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    }, this.appMenuModel);
    
    this.innerListAttrs = {
        listTemplate: 'highscores/listcontainer',
        itemTemplate: 'highscores/listItem'
    };
    this.resultList = [{
        resultString: " "
    }]
    this.listModel = {
        items: this.resultList
    };
    this.controller.setupWidget('results_list', this.innerListAttrs, this.listModel);
    Mojo.Event.listen($('retry'), Mojo.Event.tap, this.retry.bind(this));
    
    //snowStorm.resume();
}

HighscoresAssistant.prototype.handleCommand = function(event){
    this.controller = Mojo.Controller.stageController.activeScene();
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'clearScores':
                this.dropTable();
                this.resultList.clear();
                this.controller.modelChanged(this.listModel, this);
                break;
        }
    }
}

HighscoresAssistant.prototype.activate = function(event){
    this.getHighScores();
    if (!this.Score) {
        $('retry').style.display = 'none';
    }
    else {
        this.checkScore(this.Score);
    }
}

HighscoresAssistant.prototype.callback = function(value){
    if (this.Score) {
        this.addHighScore(value);
    }
}

HighscoresAssistant.prototype.deactivate = function(event){
}

HighscoresAssistant.prototype.cleanup = function(event){
    this.controller.stopListening($('retry'), Mojo.Event.tap, this.retry.bind(this));
}

HighscoresAssistant.prototype.getHighScores = function(){
    var query = 'select name, score from highScore order by score desc;'
    this.hsDB.transaction((function(transaction){
        transaction.executeSql(query, [], this.buildList.bind(this), this.errorHandler.bind(this));
    }).bind(this));
}

HighscoresAssistant.prototype.checkScore = function(score){
    var query = 'select score from highScore where ' + score + ' > (select score from highScore order by score asc limit 1);';
    this.hsDB.transaction((function(transaction){
        transaction.executeSql(query, [], this.isHighScore.bind(this), this.errorHandler.bind(this));
    }).bind(this));
}

HighscoresAssistant.prototype.addHighScore = function(name){
    var query = 'INSERT INTO highScore (id, name, score) VALUES (?,?,?); GO;'
    this.hsDB.transaction((function(transaction){
        transaction.executeSql(query, [Math.random(), name, this.Score], this.getHighScores.bind(this), this.errorHandler.bind(this));
    }).bind(this));
}

HighscoresAssistant.prototype.dropTable = function(){
    var query = 'DELETE FROM highScore; GO;';
    this.hsDB.transaction((function(transaction){
        transaction.executeSql(query, []);
    }).bind(this));
}

HighscoresAssistant.prototype.buildList = function(transaction, results){
    // Handle the results 
    var string = "";
    
    try {
        var list = [];
        for (var i = 0; i < results.rows.length; i++) {
            var row = results.rows.item(i);
            
            var rowClass = "";
            
            if (i === 0) {
                var rowClass = "first";
            }
            else 
                if (i === results.rows.length - 1) {
                    var rowClass = "last";
                }
            
            var string = {
                score: row["score"],
                name: row["name"],
                rowClass: rowClass
            };
            
            list.push(string);
        }
        //update the list widget
        this.resultList.clear();
        if (list.length > 0) {        
            Object.extend(this.resultList, list);
            this.controller.modelChanged(this.listModel, this);
        }else{
			throw "";
		}
    } 
    catch (e) {
        
    }
}

HighscoresAssistant.prototype.isHighScore = function(transaction, results){
    if (results.rows.length > 0 || this.resultList.length == 0) {
        this.controller.showDialog({
            template: 'entry/entry-scene',
            assistant: new EntryAssistant(this, this.callback.bind(this), this.Score),
            preventCancel: true
        });
    }
}

HighscoresAssistant.prototype.retry = function(event){
    var params = {
        chosen: this.chosenSkier,
        db: this.hsDB
    }
    
    this.controller.stageController.assistant.showScene("game", 'game', params);
}

HighscoresAssistant.prototype.errorHandler = function(transaction, error){
    console.log('Error was ' + error.message + ' (Code ' + error.code + ')');
    return true;
}
