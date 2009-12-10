function HighscoresAssistant(params){
    this.hsDB = params.db;
    this.Score = params.score;
    this.chosenSkier = params.skier;
}

HighscoresAssistant.prototype.setup = function(){
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
    Mojo.Event.listen($('quit'), Mojo.Event.tap, this.quit.bind(this));
}

HighscoresAssistant.prototype.activate = function(event){
    this.getHighScores();
    this.addHighScore();
}

HighscoresAssistant.prototype.deactivate = function(event){
}

HighscoresAssistant.prototype.cleanup = function(event){
}

HighscoresAssistant.prototype.getHighScores = function(){
    var query = 'select name, score from highScore order by score desc;'
    this.hsDB.transaction((function(transaction){
        transaction.executeSql(query, [], this.buildList.bind(this), this.errorHandler.bind(this));
    }).bind(this));
}

HighscoresAssistant.prototype.checkScore = function(score){
    var query = 'select score from highScore where ';
}

HighscoresAssistant.prototype.addHighScore = function(score){
    var query = 'INSERT INTO highScore (id, name, score) VALUES (?,?,?); GO;'
    this.hsDB.transaction((function(transaction){
        transaction.executeSql(query, [Math.random(), 'Nick', this.Score], this.getHighScores.bind(this), this.errorHandler.bind(this));
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
        Object.extend(this.resultList, list);
        this.controller.modelChanged(this.listModel, this);
    } 
    catch (e) {
        $('result').update(e);
    }
}

HighscoresAssistant.prototype.retry = function(event){
    var params = {
        chosen: this.chosenSkier,
        db: this.hsDB
    }
    
    this.controller.stageController.assistant.showScene("game", 'game', params);
}

HighscoresAssistant.prototype.quit = function(event){
    var params = {
        db: this.hsDB
    }
    
    this.controller.stageController.assistant.showScene("start", 'start', params);
}

HighscoresAssistant.prototype.errorHandler = function(transaction, error){
    console.log('Error was ' + error.message + ' (Code ' + error.code + ')');
    return true;
}
