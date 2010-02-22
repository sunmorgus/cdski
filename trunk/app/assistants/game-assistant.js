function GameAssistant(params){
    this.chosenSkier = params.chosen;
    this.hsDB = params.db;
    this.speed = null;
    this.fSpeedMod = 1;
    snowStorm.stop();
    snowStorm.freeze();
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
GameAssistant.prototype.skierImgTag = null;
GameAssistant.prototype.score = null;
GameAssistant.prototype.increaseDiffScore = null;
GameAssistant.prototype.increaseSpeedScore = null;
GameAssistant.prototype.divLives = null;
GameAssistant.prototype.lives = null;
GameAssistant.prototype.isPaused = null;
GameAssistant.prototype.hsDB = null;
GameAssistant.prototype.isJumping = null;
GameAssistant.prototype.jumpLength = null;
GameAssistant.prototype.moveX = null;
GameAssistant.prototype.drawAbom = null;
GameAssistant.prototype.abomH = null;
GameAssistant.prototype.rot = null;

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
    
    this.controller.stageController.setWindowProperties("fastAccelerometer");
    this.controller.listen(document, 'acceleration', this.handleOrientation.bindAsEventListener(this));
    
    this.unPauseHandlerBind = this.unPauseHandler.bind(this);
    this.scrim = Mojo.View.createScrim(this.controller.document, {
        onMouseDown: this.unPauseHandlerBind,
        scrimClass: 'palm-scrim'
    });
    this.controller.get("Pause").appendChild(this.scrim).appendChild($('paused'));
    
    //snowStorm.freeze();
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

GameAssistant.prototype.ready = function(){
    this.scrim.hide();
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
    this.drawAbom = 300;
    
    this.setupObstacles();
    
    //skier draw goes here
    this.setupSkierEasy("initial");
    
    this.context.drawImage(this.skier.img, this.skier.x, this.skier.y, this.skier.width, this.skier.height);
    
    this.isJumping = false;
    
    this.mainLoopBind = this.mainLoop.bind(this);
    
    this.startMainLoop();
}


GameAssistant.prototype.deactivate = function(event){
    this.stopMainLoop();
}

GameAssistant.prototype.cleanup = function(){
    this.controller.stopListening(document, 'acceleration', this.handleOrientation.bindAsEventListener(this));
    this.controller.stopListening(this.controller.document, Mojo.Event.keypress, this.keypressHandlerBind, true);
}

GameAssistant.prototype.setupSkierEasy = function(state){
    var chosen = this.chosenSkier;
    
    switch (state) {
        case "initial":
            this.setupSkier(150, 20, 14, 32, chosen + "_down");
            break;
        case "crash":
            var currentX = this.skier.x;
            this.setupSkier(currentX - 2, 20, 18, 22, chosen + "_crash");
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
    
    //this.skier.img.src = "images/sprites/" + this.chosenSkier.substr(0, 1) + "/" + imgSrc + ".png";
    
    this.skierImgTag = $('skierImg');
    this.skierImgTag.src = "images/sprites/" + this.chosenSkier.substr(0, 1) + "/" + imgSrc + ".png";
    this.skierImgTag.style.visibility = 'visible';
    
    var setupRot = jQuery('#skierImg').rotate({
        angle: 0
    });
    
    this.rotTop = 54;
    this.rotLeft = 140;
    setupRot[0].context.style.position = 'absolute';
    setupRot[0].context.style.top = this.rotTop + 'px';
    setupRot[0].context.style.left = this.rotLeft + 'px';
    
    this.rot = setupRot;
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

GameAssistant.prototype.getAbom = function(){
    var obstacle = {
        img: new Image(),
        x: Math.floor(Math.random() * (this.canvasWidth - 36 - 2)),
        y: (this.canvasHeight - 46 - 2) + 46 + Math.floor(Math.random() * 100),
        width: 36,
        height: 46,
        vDir: this.randNum1,
        maxX: (this.canvasWidth - 36 - 2),
        maxY: (this.canvasHeight - 46 - 2),
        name: 'abom_h'
    };
    
    obstacle.img.src = "images/obstacles/abom_h.gif";
    this.obstacles.push(obstacle);
}

GameAssistant.prototype.mainLoop = function(){
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    var l = this.obstacles.length;
    var currentSpeed = this.speed;
    var currentSkier = this.skier;
    var currentMoveX = this.moveX;
    var skierImg = this.chosenSkier;
    
    var skierRot = this.rot;
	
	var holdLeft = this.rotLeft;
    this.rotLeft += Math.floor(currentMoveX * 5);

    if (this.rotLeft > -1 && this.rotLeft < (310 - currentSkier.width)) {
        currentSkier.x += Math.floor(currentMoveX * 5);
        var currentLeft = this.rotLeft;
    }
    else {
		this.rotLeft = holdLeft;
        this.moveX = 0;
        currentMoveX = 0;
    }
    
    var currentRotTop = this.rotTop;
	
	if(skierRot && !this.isJumping)
		skierRot[0].rotateAnimation(currentMoveX * 100)
    
/*
    if (currentMoveX <= -.1) {
        //currentSkier.img.src = "images/sprites/" + skierImg.substr(0, 1) + "/" + skierImg + "_left.png";
        if (skierRot) 
            skierRot[0].rotateAnimation(-50);
    }
    if (currentMoveX >= .1) {
        //currentSkier.img.src = "images/sprites/" + skierImg.substr(0, 1) + "/" + skierImg + "_right.png";
        if (skierRot) 
            skierRot[0].rotateAnimation(50);
    }
    if (currentMoveX >= -.1 && currentMoveX <= .1) {
        //currentSkier.img.src = "images/sprites/" + skierImg.substr(0, 1) + "/" + skierImg + "_down.png";
        if (skierRot) 
            skierRot[0].rotateAnimation(0);
    }
*/
    
    //var skierMiddleX = (currentLeft + currentSkier.width) / 2;
    var skierMiddleY = (currentSkier.y + currentSkier.height) / 2;
    
    //draw obstacles
    for (var i = 1; i < l; i++) {
        var currentObs = this.obstacles[i];
        
        //check for obstacle collision
        var x = (currentObs.x < currentSkier.x) && ((currentObs.x + currentObs.width) > currentSkier.x);
        
        
        if (!x) {
            x = ((currentObs.x < (currentSkier.x + currentSkier.width)) && ((currentObs.x + currentObs.width) > (currentSkier.x + currentSkier.width)));
        }
        
        var y = Math.floor(currentObs.y) <= skierMiddleY;
        
        switch (currentObs.name) {
            case "ramp":
                if (!this.isJumping) {
                    if (x && y) {
                        this.isJumping = true;
                        var unjump = setTimeout(this.stopJump.bind(this), 2000);
                    }
                    else {
                        //this.context.drawImage(currentSkier.img, currentSkier.x, currentSkier.y, currentSkier.width, currentSkier.height);
						skierRot[0].context.style.left = currentLeft + 'px';
                    }
                }
                else {
                    //this.context.drawImage(currentSkier.img, currentSkier.x, currentSkier.y - 3, currentSkier.width + 3, currentSkier.height + 3);
					skierRot[0].rotate(0);
					skierRot[0].rotateAnimation({
						angle: 360,
						scaleJump: true
					});
					skierRot[0].context.style.left = currentLeft + 'px';
                }
                break;
            case "abom_h":
                if (!this.isF) {
                    if (x && y) {
                        this.collide(currentSkier, currentObs);
                    }
                    else {
                        //this.context.drawImage(currentSkier.img, currentSkier.x, currentSkier.y, currentSkier.width, currentSkier.height);
                        skierRot[0].context.style.left = currentLeft + 'px';
                    }
                }
                else {
                    //this.context.drawImage(currentSkier.img, currentSkier.x, currentSkier.y, currentSkier.width, currentSkier.height);
                    skierRot[0].context.style.left = currentLeft + 'px';
                }
                break;
                
            default:
                if (x && y) {
                    //console.log("obs: " + currentObs.name + " obsx: " + currentObs.x + ":" + (currentObs.x + currentObs.width) + " skierX: " + currentSkier.x + ":" + (currentSkier.x + currentSkier.width));
                    this.collide(currentSkier, currentObs);
                }
                else {
                    //this.context.drawImage(currentSkier.img, currentSkier.x, currentSkier.y, currentSkier.width, currentSkier.height);
                    skierRot[0].context.style.left = currentLeft + 'px';
                }
        }
        
        this.context.drawImage(currentObs.img, currentObs.x, currentObs.y, currentObs.width, currentObs.height);
        
        if (currentObs.vDir) {
            currentObs.y = currentObs.y - currentSpeed;
            if (currentObs.name == "abom_h" && !this.isF) {
                currentObs.x = currentSkier.x;
            }
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
        
        if ((currentObs.y <= -currentObs.height)) {
            currentObs.vDir = !currentObs.vDir;
        }
    }
    
    if (currentSpeed > 0) {
        if (this.isJumping) {
            this.score += (this.speed / 10) + 5.3;
        }
        else {
            this.score += (this.speed / 10);
        }
    }
    var printScore = Math.round(this.score);
    this.divScoreBoard.innerHTML = "Score: " + Math.round(printScore);
    //this.divLives.innerHTML = "Live(s): " + this.lives;
    
    if (printScore >= this.increaseDiffScore) {
        this.stopMainLoop();
        this.addObstacle(1);
        this.startMainLoop();
        
        this.increaseDiffScore += 500;
    }
    
    if (printScore >= this.drawAbom) {
        this.stopMainLoop();
        this.getAbom();
        this.startMainLoop();
        
        this.drawAbom += 300;
    }
}

GameAssistant.prototype.collide = function(currentSkier, currentObs){
    this.stopMainLoop();
    var skierImg = this.chosenSkier;
    
    this.context.fillRect(currentSkier.x, currentSkier.y, currentSkier.width, currentSkier.height);
    
    if (currentObs.name == "abom_h") {
        $('crash').src = "images/obstacles/abom_eat.gif", $('crash').style.left = currentSkier.x + 'px';
        $('crash').style.top = (currentSkier.y + 2 + currentObs.height) + 'px';
        $('crash').style.left = currentObs.x + 'px';
        currentObs.img.src = "";
        currentSkier.img.src = "";
        this.rot[0].context.style.display = "none";
    }
    else {
        $('crash').src = "images/sprites/" + skierImg.substr(0, 1) + "/" + skierImg + "_crash.png";
        $('crash').style.top = (currentSkier.y + 20 + currentObs.height) + 'px';
        $('crash').style.left = currentSkier.x + 'px';
        currentSkier.img.src = "";
        this.rot[0].context.style.display = "none";
    }
    
    $('crash').style.visibility = 'visible';
    
    var t = setTimeout(this.checkHighScore.bind(this), 1000);
}

GameAssistant.prototype.startMainLoop = function(){
    this.mainLoopInterval = setInterval(this.mainLoopBind, 30);
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
    
    this.controller.stageController.popScene();
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
            
        case Mojo.Char.f:
        case Mojo.Char.f + 32:
            this.isF = true;
            this.fSpeedMod = 2;
            if (!this.fTimeout) {
                this.fTimeout = setTimeout(this.noF.bind(this), 2000);
            }
            break;
    }
}

GameAssistant.prototype.noF = function(){
    this.isF = false;
    this.fSpeedMod = 1;
}

GameAssistant.prototype.handleOrientation = function(event){
    if (!this.isJumping) {
        //var scaleX = 1;
        var scaleY = 10;
        //var roll = (event.accelX * scaleX);
        
        //this.moveX += roll;
        this.moveX += event.accelX;
        
        this.speed = Math.floor(Math.abs(event.accelY * scaleY)) * this.fSpeedMod;
    }
}

GameAssistant.prototype.tapEvent = function(event){
    if (this.isPaused) {
        this.scrim.hide();
        this.startMainLoop();
        this.isPaused = false;
    }
    else {
        this.scrim.show();
        this.stopMainLoop();
        this.isPaused = true;
    }
}

GameAssistant.prototype.unPauseHandler = function(){
    this.scrim.hide();
    this.startMainLoop();
    this.isPaused = false;
}
