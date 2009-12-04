function GameAssistant(){
}

GameAssistant.prototype.treeWidth = 30;
GameAssistant.prototype.treeHeight = 44;
GameAssistant.prototype.stoneWidth = 25;
GameAssistant.prototype.stoneHeight = 10;
GameAssistant.prototype.obsArray = new Array(1);
GameAssistant.prototype.randNum1 = null;
GameAssistant.prototype.numObstacles = null;
GameAssistant.prototype.obstacles = new Array(1);
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

GameAssistant.prototype.setup = function(){
    if (this.canvas) {
        return;
    }
    
    this.canvas = $("slope");
    this.context = this.canvas.getContext("2d");
    this.context.fillStyle = "rgb(255,255,255)";
    this.canvasWidth = this.canvas.getAttribute("width");
    this.canvasHeight = this.canvas.getAttribute("height");
    
    this.divScoreBoard = $("scoreboard");
    this.score = 0;
	this.increaseDiffScore = 50;
	
	this.speed = 2.5;
	this.increaseSpeedScore = 1000;
    
    this.setupObstacles();
    
    //skier draw goes here
    
    this.mainLoopBind = this.mainLoop.bind(this);
}

GameAssistant.prototype.activate = function(event){
    this.startMainLoop();
}


GameAssistant.prototype.deactivate = function(event){
    this.stopMainLoop();
}

GameAssistant.prototype.setupObstacles = function(){
    this.obsArray[0] = {
        imgSrc: "images/sprites/obstacles/tree.png",
        width: this.treeWidth,
        height: this.treeHeight
    };
    
    this.obsArray[1] = {
        imgSrc: "images/sprites/obstacles/stone.png",
        width: this.stoneWidth,
        height: this.stoneHeight
    };
    
    this.addObstacle(6);
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
        
        var randomObstacle = Math.round(Math.random());
		
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
            maxY: startPosition
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
        
        this.context.drawImage(currentObs.img, currentObs.x, currentObs.y, currentObs.width, currentObs.height);
        
        if (currentObs.vDir) {
            currentObs.y = currentObs.y - currentSpeed;
        }
        else {
            currentObs.y = currentObs.maxY + currentObs.height + Math.floor(Math.random() * 100);
            currentObs.x = Math.floor(Math.random() * (this.canvasWidth - currentObs.width - 2));
            currentObs.vDir = this.canvasHeight;
        }
        
        if (currentObs.y <= -currentObs.height) {
            currentObs.vDir = !currentObs.vDir;
        }
    }
    
    //draw skier
    
    this.score += .3;
	var printScore = Math.round(this.score);
    this.divScoreBoard.innerHTML = "Score: " + Math.round(printScore);
	
	if(printScore == this.increaseDiffScore){
		this.stopMainLoop();
		this.addObstacle(1);
		this.startMainLoop();
		
		this.increaseDiffScore += 50;
	}
	
	if(printScore == this.increaseSpeedScore){
		this.speed += 2.5;
		
		this.increaseSpeedScore += 1000;
	}
}

GameAssistant.prototype.startMainLoop = function(){
    this.mainLoopInterval = setInterval(this.mainLoopBind, 33);
}

GameAssistant.prototype.stopMainLoop = function(){
    clearInterval(this.mainLoopInterval);
    this.mainLoopInterval = null;
}
