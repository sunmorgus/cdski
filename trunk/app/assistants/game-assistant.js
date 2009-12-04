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
    
    this.setupObstacles();
	this.addObstacles(6);
    
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
}

GameAssistant.prototype.addObstacles = function(numObstacles){
	var l = 0;
	if(this.obstacles.length > 0){
		l = this.obstacles.length - 1;
	}
	
	for (var i = l; i < numObstacles; i++) {
        this.randNum1 = Math.floor(Math.random() * 100);
        if (this.randNum1 <= this.treeWidth) {
            this.randNum1 = false;
        }
        else {
            this.randNum1 = true;
        }
        
        var randomObstacle = Math.round(Math.random());
        
        this.obstacles[i] = {
            img: new Image(),
            x: Math.floor(Math.random() * (this.canvasWidth - this.obsArray[randomObstacle].width - 2)),
            y: Math.floor(Math.random() * (this.canvasHeight - this.obsArray[randomObstacle].height - 2)),
            width: this.obsArray[randomObstacle].width,
            height: this.obsArray[randomObstacle].height,
            vDir: this.randNum1,
            maxX: (this.canvasWidth - this.obsArray[randomObstacle].width - 2),
            maxY: (this.canvasHeight - this.obsArray[randomObstacle].height - 2)
        };
        
        this.obstacles[i].img.src = this.obsArray[randomObstacle].imgSrc;
    }
}

GameAssistant.prototype.mainLoop = function(){
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
	var l = this.obstacles.length;
	
    //draw trees
    for (var i = 0; i < l; i++) {
		var currentObs = this.obstacles[i];
		
        this.context.drawImage(currentObs.img, currentObs.x, currentObs.y, currentObs.width, currentObs.height);
        
        if (currentObs.vDir) {
            currentObs.y = currentObs.y - 2.5;
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
    this.divScoreBoard.innerHTML = "Score: " + Math.round(this.score);
}

GameAssistant.prototype.startMainLoop = function(){
    this.mainLoopInterval = setInterval(this.mainLoopBind, 33);
}

GameAssistant.prototype.stopMainLoop = function(){
    clearInterval(this.mainLoopInterval);
    this.mainLoopInterval = null;
}
