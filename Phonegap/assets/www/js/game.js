function SetupCanvas() {
	alert('setup canvas');
	this.canvas = $('#slope');
	this.context = this.canvas.getContext("2d");
	this.context.fillStyle = "rgb(255,255,255)";
	this.canvasWidth = this.canvas.getAttribute("width");
	this.canvasHeight = this.canvas.getAttribute("height");

	this.isPaused = false;

	this.divScoreBoard = $('#scoreboard');
	this.score = 0;
	this.increasDiffScore = 50;
	this.drawAbom = 300;

	SetupObstacles();
	SetupSkierEasy("initial");

	this.isJumping = false;

	// StartMainLoop();
}

function SetupSkierEasy(state) {
	alert('setup skier easy: ' + state);
	var chosen = "riley"; // this.chosenSkier;

	switch (state) {
	case "initial":
		SetupSkier(150, 160, 14, 32, chosen + "_down");
		break;
	case "crash":
		var currentX = this.skier.x;
		SetupSkier(currentX - 2, 20, 18, 22, chosen + "_crash");
		break;
	}
}

function SetupSkier(x, y, width, height, imgSrc){
	this.skier = {
			img: new Image(),
			x: x,
			y: y,
			width: width,
			height: height,
			maxX: (this.canvasWidth - width - 2),
			maxY: (this.canvasHeight - height - 2)
	};
	
	alert(this.skier.x);
	
	this.skierImgTag = $('#skierImg');
	this.skierImgTag.src = "/android_asset/www/images/sprites/" + this.chosenSkier.substr(0, 1) + "/" + imgSrc + ".png";
	this.skierImgTag.style.visibility = 'visible';
}

function SetupObstacles(){
	
}