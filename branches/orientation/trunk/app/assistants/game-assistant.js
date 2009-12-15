function GameAssistant(params){
    this.chosenSkier = params.chosen;
    this.hsDB = params.db;
}

GameAssistant.prototype.obsArray = new Array();
GameAssistant.prototype.randNum1 = null;
GameAssistant.prototype.numObstacles = null;
GameAssistant.prototype.obstacles = new Array();
GameAssistant.prototype.obstacleWidth = null;
GameAssistant.prototype.obstacleHeight = null;
GameAssistant.prototype.canvas = null;
GameAssistant.prototype.context = null;
GameAssistant.prototype.mainLoopInterval = null;
GameAssistant.prototype.mainLoopBind = null;
GameAssistant.prototype.divScoreBoard = null;
GameAssistant.prototype.canvasWidth = null;
GameAssistant.prototype.canvasHeight = null;
GameAssistant.prototype.keypressHandlerBind = null;
GameAssistant.prototype.skier = null;
GameAssistant.prototype.score = null;
GameAssistant.prototype.increaseDiffScore = null;
GameAssistant.prototype.speed = null;
GameAssistant.prototype.increaseSpeedScore = null;
GameAssistant.prototype.divLives = null;
GameAssistant.prototype.lives = null;
GameAssistant.prototype.isPaused = null;
GameAssistant.prototype.hsDB = null;
GameAssistant.prototype.isJumping = null;
GameAssistant.prototype.jumpLength = null;
GameAssistant.prototype.moveX = null;

GameAssistant.prototype.setup = function(){
    this.appMenuModel = {
        visible: true,
        items: [Mojo.Menu.editItem, {
            label: $L('New Game'),
            command: 'newGame'
        }]
    };
    
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    }, this.appMenuModel);
    
    this.controller.listen(document, 'acceleration', this.handleAcceleration.bindAsEventListener(this));
}

GameAssistant.prototype.handleCommand = function(event){
    this.controller = Mojo.Controller.stageController.activeScene();
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'newGame':
                this.obstacles.splice(0, this.obstacles.length);
                this.controller.stageController.assistant.showScene("start", 'start');
                break;
        }
    }
}

GameAssistant.prototype.activate = function(event){
    if (this.canvas) {
        //return;
    }
    
    this.keypressHandlerBind = this.keypressHandler.bind(this);
    Mojo.Event.listen(this.controller.document, Mojo.Event.keypress, this.keypressHandlerBind, true);
    
    this.canvas = $("slope");
    this.context = this.canvas.getContext("2d");
    this.context.fillStyle = "rgb(255,255,255)";
    this.canvasWidth = this.canvas.getAttribute("width");
    this.canvasHeight = this.canvas.getAttribute("height");
    
    this.isPaused = false;
    var tapHandler = this.tapEvent.bind(this);
    this.controller.listen("slope", Mojo.Event.tap, tapHandler);
    
    this.divScoreBoard = $("scoreboard");
    this.score = 0;
    this.increaseDiffScore = 50;
    
    this.setupObstacles();
    
    //skier draw goes here
    this.setupSkierEasy("initial");
    
    this.context.drawImage(this.skier.img, this.skier.x, this.skier.y, this.skier.width, this.skier.height);
    
    this.isJumping = false;
    this.jumpLength = 0;
    
    this.mainLoopBind = this.mainLoop.bind(this);
    
    this.startMainLoop();
}


GameAssistant.prototype.deactivate = function(event){
    this.stopMainLoop();
}

GameAssistant.prototype.setupSkierEasy = function(state){
    var chosen = this.chosenSkier;
    switch (state) {
        case "initial":
            this.setupSkier(150, 20, 14, 32, chosen + "_down");
            break;
        case "down":
            this.setupSkier(this.skier.x, 20, 14, 32, chosen + "_down");
            break;
        case "right":
            this.setupSkier(this.skier.x + this.moveX, 20, 16, 33, chosen + "_right");
            break;
        case "left":
            this.setupSkier(this.skier.x + this.moveX, 20, 18, 31, chosen + "_left");
            break;
        case "crash":
            this.setupSkier(this.skier.x - 2, 20, 18, 22, chosen + "_crash");
    }
}

GameAssistant.prototype.setupSkier = function(x, y, width, height, imgSrc){
    this.skier = {
        img: new Image(),
        x: x,
        y: y,
        width: width,
        height: height,
        maxX: (this.canvasWidth - width - 2),
        maxY: (this.canvasHeight - height - 2)
    };
    
    this.skier.img.src = "images/sprites/" + this.chosenSkier.substr(0, 1) + "/" + imgSrc + ".png";
}

GameAssistant.prototype.setupObstacles = function(){
    this.obsArray[0] = {
        name: "tree",
        imgSrc: "images/obstacles/tree.png",
        width: 30,
        height: 44
    };
    
    this.obsArray[1] = {
        name: "stone",
        imgSrc: "images/obstacles/stone.png",
        width: 25,
        height: 10
    };
    
    this.obsArray[2] = {
        name: "snowman",
        imgSrc: "images/obstacles/snowman.png",
        width: 20,
        height: 19
    };
    
    this.obsArray[3] = {
        name: "ramp",
        imgSrc: "images/obstacles/ramp.png",
        width: 24,
        height: 20
    }
    
    this.addObstacle(6);
}

GameAssistant.prototype.getRandomObsNum = function(){
    var num = Math.floor(Math.random() * (this.obsArray.length));
    return num;
}

GameAssistant.prototype.addObstacle = function(num){
    for (i = 0; i < num; i++) {
        this.randNum1 = Math.floor(Math.random() * 100);
        if (this.randNum1 <= this.treeWidth) {
            this.randNum1 = false;
        }
        else {
            this.randNum1 = true;
        }
        
        var randomObstacle = this.getRandomObsNum();
        
        var currentObstacle = this.obsArray[randomObstacle];
        var startPosition = (this.canvasHeight - currentObstacle.height - 2);
        
        var obstacle = {
            img: new Image(),
            x: Math.floor(Math.random() * (this.canvasWidth - currentObstacle.width - 2)),
            y: startPosition + currentObstacle.height + Math.floor(Math.random() * 100),
            width: currentObstacle.width,
            height: currentObstacle.height,
            vDir: this.randNum1,
            maxX: (this.canvasWidth - currentObstacle.width - 2),
            maxY: startPosition,
            name: currentObstacle.name
        };
        
        obstacle.img.src = this.obsArray[randomObstacle].imgSrc;
        
        this.obstacles.push(obstacle);
    }
}

GameAssistant.prototype.mainLoop = function(){
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    var l = this.obstacles.length;
    var currentSpeed = this.speed;
    
    //draw trees
    for (var i = 1; i < l; i++) {
        var currentObs = this.obstacles[i];
        
        //check for obstacle collision
        var x = ((currentObs.x <= this.skier.x) && ((currentObs.x + currentObs.width) >= this.skier.x));
        if (!x) {
            x = ((currentObs.x <= (this.skier.x + this.skier.width)) && ((currentObs.x + currentObs.width) >= (this.skier.x + this.skier.width)));
        }
        var y = ((Math.floor(currentObs.y) <= (this.skier.y + this.skier.height - 12)));
        
        if (!this.isJumping) {
            if (x && y && (currentObs.name != "ramp")) {//skier has collided with obstacle
                this.context.fillRect(this.skier.x, this.skier.y, this.skier.width, this.skier.height);
                this.setupSkierEasy("crash");
                this.context.drawImage(this.skier.img, this.skier.x, this.skier.y, this.skier.width, this.skier.height);
                
                this.stopMainLoop();
                var t = setTimeout(this.checkHighScore.bind(this), 1000);
            }
            else 
                if (x && y && (currentObs.name == "ramp")) {
                    this.isJumping = true;
                    var unjump = setTimeout(this.stopJump.bind(this), 2000);
                }
                else {
                    this.context.drawImage(this.skier.img, this.skier.x, this.skier.y, this.skier.width, this.skier.height);
                }
        }
        else {
            this.context.drawImage(this.skier.img, this.skier.x, this.skier.y - 3, this.skier.width + 3, this.skier.height + 3);
        }
        
        this.context.drawImage(currentObs.img, currentObs.x, currentObs.y, currentObs.width, currentObs.height);
        
        if (currentObs.vDir) {
            currentObs.y = currentObs.y - currentSpeed;
        }
        else {
            var randomObstacle = this.getRandomObsNum();
            
            var currentObstacle = this.obsArray[randomObstacle];
            currentObs.img.src = currentObstacle.imgSrc;
            currentObs.height = currentObstacle.height;
            currentObs.width = currentObstacle.width;
            
            currentObs.y = currentObs.maxY + currentObs.height + Math.floor(Math.random() * 100);
            currentObs.x = Math.floor(Math.random() * (this.canvasWidth - currentObs.width - 2));
            currentObs.vDir = this.canvasHeight;
            currentObs.name = currentObstacle.name;
        }
        
        if (currentObs.y <= -currentObs.height) {
            currentObs.vDir = !currentObs.vDir;
        }
    }
    
    if (this.isJumping) {
        this.score += 5.3;
    }
    else {
        this.score += .3;
    }
    var printScore = Math.round(this.score);
    this.divScoreBoard.innerHTML = "Score: " + Math.round(printScore);
    //this.divLives.innerHTML = "Live(s): " + this.lives;
    
    if (printScore >= this.increaseDiffScore) {
        this.stopMainLoop();
        this.addObstacle(1);
        this.startMainLoop();
        
        this.increaseDiffScore += 50;
    }
}

GameAssistant.prototype.startMainLoop = function(){
    this.mainLoopInterval = setInterval(this.mainLoopBind, 33);
}

GameAssistant.prototype.stopMainLoop = function(){
    clearInterval(this.mainLoopInterval);
    this.mainLoopInterval = null;
}

GameAssistant.prototype.stopJump = function(){
    this.isJumping = false;
}

GameAssistant.prototype.checkHighScore = function(){
    this.obstacles.splice(0, this.obstacles.length);
    
    var params = {
        db: this.hsDB,
        score: Math.round(this.score + .3),
        skier: this.chosenSkier
    }
    
    this.controller.stageController.assistant.showScene("highscores", 'highscores', params);
}

GameAssistant.prototype.keypressHandler = function(event){
    switch (event.originalEvent.keyCode) {
        // Left.
        case Mojo.Char.a:
        case Mojo.Char.a + 32:
            if (this.skier.x > 2) {
                this.setupSkierEasy("left");
            }
            break;
            
        // Right.
        case Mojo.Char.d:
        case Mojo.Char.d + 32:
            if (this.skier.x < this.skier.maxX) {
                this.setupSkierEasy("right");
            }
            break;
            
        // Down.
        case Mojo.Char.s:
        case Mojo.Char.s + 32:
            this.setupSkierEasy("down");
            break;
    }
}

GameAssistant.prototype.handleAcceleration = function(event){
    if (this.skier.x > 2 && this.skier.x < this.skier.maxX) {
        var accelX = Math.floor(event.accelX * 100);
        if (event.accelX >= 0 && this.skier.x < this.skier.maxX) {
            this.moveX = accelX;
            this.setupSkierEasy("right");
        }
        
        if (event.accelX <= 0 && this.skier.x > 2) {
            this.moveX = accelX;
            this.setupSkierEasy("left");
        }
        
        if (accelX >= -3 && accelX <= 3) {
            this.moveX = 0;
            this.setupSkierEasy("down");
        }
    }
    
    this.speed = Math.floor(Math.abs(event.accelY * 10));
}

GameAssistant.prototype.tapEvent = function(event){
    if (this.isPaused) {
        this.startMainLoop();
        this.isPaused = false;
    }
    else {
        this.stopMainLoop();
        this.isPaused = true;
    }
}
