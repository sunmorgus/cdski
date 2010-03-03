function HighscoresAssistant(params){
    this.hsDB = params.db;
    if (params.score) {
        this.Score = params.score;
    }
    if (params.skier) {
        this.chosenSkier = params.skier;
    }
    
    //this.scoreUrl = "http://monstertrucks.rjamdev.info/skiprehs.php?method=";
    this.scoreUrl = "http://monstertrucks.rjamdev.info/skiprehs_beta.php?method=";
    
    snowStorm.stop();
    snowStorm.freeze();
}

HighscoresAssistant.prototype.setup = function(){
    this.appMenuModel = {
        visible: true,
        items: [Mojo.Menu.editItem, {
            label: $L('Clear High Scores'),
            command: 'clearScores'
        }, {
            label: $L('Help'),
            command: 'help'
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
    
    this.cmdMenuModel = {
        label: $L('Menu Demo'),
        items: [{}, {
            label: $L('Back/Fwd'),
            toggleCmd: 'local',
            items: [{
                label: $L('Your Scores'),
                command: 'local',
                width: 160
            }, {
                label: $L('Global Scores'),
                command: 'global',
                width: 160
            }]
        }]
    };
    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, this.cmdMenuModel);
    
    this.exampleSpinner = 'my-spinner';
    this.exampleSpinnerAttrs = {
        spinnerSize: Mojo.Widget.spinnerLarge
    }
    
    this.controller.setupWidget(this.exampleSpinner, this.exampleSpinnerAttrs, {});
    this.scrim = Mojo.View.createScrim(this.controller.document, {
        scrimClass: 'palm-scrim'
    });
    this.controller.get("my-scrim").appendChild(this.scrim).appendChild($(this.exampleSpinner));
}

HighscoresAssistant.prototype.ready = function(){
    this.controller.get(this.exampleSpinner).mojo.start();
    this.scrim.hide();
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
            case 'local':
                this.getHighScores();
                break;
            case 'global':
                this.getGlobalHighScores();
                $('noScores').style.display = 'none';
                break;
            case 'help':
                this.controller.stageController.pushScene("help", 'help');
                break;
        }
    }
}

HighscoresAssistant.prototype.activate = function(event){
    this.getHighScores();
    if (this.Score) {
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
}

HighscoresAssistant.prototype.getHighScores = function(){
    var query = 'select name, score, global_id from highScore order by score desc, id asc limit 10;';
    this.hsDB.transaction((function(transaction){
        transaction.executeSql(query, [], this.buildList.bind(this), this.errorHandler.bind(this));
    }).bind(this));
}

HighscoresAssistant.prototype.getGlobalHighScores = function(){
    this.scrim.show();
    var url = this.scoreUrl + 's';
    
    var request = new Ajax.Request(url, {
        method: 'get',
        evalJSON: 'force',
		timeout: 2000,
        onSuccess: this.buildGlobalList.bind(this),
        onFailure: this.errorHandler.bind(this)
    });
}

HighscoresAssistant.prototype.checkScore = function(score){
    var query = 'select score from highScore where ' + score + ' > (select score from (select score from highScore order by score desc limit 10) order by score asc limit 1);';
    this.hsDB.transaction((function(transaction){
        transaction.executeSql(query, [], this.isHighScore.bind(this), this.errorHandler.bind(this));
    }).bind(this));
}

HighscoresAssistant.prototype.addHighScore = function(name){
    this.scrim.show();
    var url = this.scoreUrl + 'i&n=' + name + '&s=' + this.Score;
    this.name = name;
    var request = new Ajax.Request(url, {
        method: 'get',
        evalJSON: 'force',
		timeout: 2000,
        onSuccess: this.globalAddSuccess.bind(this),
        onFailure: this.globalAddFailure.bind(this)
    });
}

HighscoresAssistant.prototype.globalAddSuccess = function(transport){
    var globalId = transport.responseText;
    var query = 'INSERT INTO highScore (id, name, score, global_id) VALUES (?,?,?,?); GO;'
    this.hsDB.transaction((function(transaction){
        transaction.executeSql(query, [Math.random(), this.name, this.Score, globalId], this.getHighScores.bind(this), this.errorHandler.bind(this));
    }).bind(this));
    this.scrim.hide();
}

HighscoresAssistant.prototype.globalAddFailure = function(transport){
    var globalId = 0;
    var query = 'INSERT INTO highScore (id, name, score, global_id) VALUES (?,?,?,?); GO;'
    this.hsDB.transaction((function(transaction){
        transaction.executeSql(query, [Math.random(), this.name, this.Score, globalId], this.getHighScores.bind(this), this.errorHandler.bind(this));
    }).bind(this));
	this.scrim.hide();
}

HighscoresAssistant.prototype.dropTable = function(){
    var query = 'DELETE FROM highScore; GO;';
    this.hsDB.transaction((function(transaction){
        transaction.executeSql(query, []);
    }).bind(this));
    
    var top = $('top');
    top.innerHTML = 'You have no highscores!';
    $('noScores').style.display = 'block';
}

HighscoresAssistant.prototype.buildGlobalList = function(transport){
    var r = transport.responseJSON;
    this.resultList.clear();
    Object.extend(this.resultList, $A(r));
    this.controller.modelChanged(this.listModel, this);
    $('results_list').style.display = 'block';
    
    var title = $('title');
    title.innerHTML = 'Global High Scores';
    
    this.scrim.hide();
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
                this.topScore = row["score"];
                this.globalScoreId = row["global_id"];
            }
            else 
                if (i === results.rows.length - 1) {
                    var rowClass = "last";
                }
            
            var star = "";
            if (row["global_id"] == 0) {
                star = "*";
            }
            
            var string = {
                rank: i + 1,
                score: row["score"] + star,
                name: row["name"],
                rowClass: rowClass
            };
            
            list.push(string);
        }
        //update the list widget
        this.resultList.clear();
        if (list.length > 0) {
            Object.extend(this.resultList, list);
            $('results_list').style.display = 'block';
            $('noScores').style.display = 'none';
        }
        else {
            $('noScores').style.display = 'block';
            var top = $('top');
            top.innerHTML = 'You have no high scores!';
        }
        
        this.controller.modelChanged(this.listModel, this);
        
        var title = $('title');
        title.innerHTML = 'Your High Scores';
        
        if (this.globalScoreId != 0) {
            var url = this.scoreUrl + 'r&g=' + this.globalScoreId;
            
            var request = new Ajax.Request(url, {
                method: 'get',
                evalJSON: 'force',
				timeout: 2000,
                onSuccess: this.setSubtitle.bind(this),
                onFailure: this.errorHandler.bind(this)
            });
        }
    } 
    catch (e) {
    
    }
}

HighscoresAssistant.prototype.setSubtitle = function(transport){
    var r = transport.responseJSON;
    var top = $('top');
    top.innerHTML = 'Your highest score of ' + this.topScore + ' ranks ' + r[0].rank + ' out of ' + r[0].count + ' other scores!';
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

HighscoresAssistant.prototype.retry = function(){
    var params = {
        chosen: this.chosenSkier,
        db: this.hsDB
    }
    
    this.controller.stageController.assistant.showScene("game", 'game', params);
}

HighscoresAssistant.prototype.errorHandler = function(transaction, error){
	this.scrim.hide();
    console.log('Error was ' + error.message + ' (Code ' + error.code + ')');
    return true;
}
