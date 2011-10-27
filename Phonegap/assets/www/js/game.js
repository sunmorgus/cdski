var Game = Class.create({
		initialize : function() {

		},

		SetupCanvas : function(params) {
			/*
			 * Setup Globals
			 */
			// constants
			this.chase = 0;
			this.fSpeedMod = 1;
			this.mediaPath = "/android_asset/www/";
			this.treeWidth = 44;
			this.crashElem = document.getElementById('crash');
			this.score = 0;
			this.increaseDiffScore = 50;
			this.drawAbom = 300;
			this.divScoreBoard = document.getElementById('scoreboard');
			// end constants

			// variables
			this.chosenSkier = params.chosen;
			this.obsArray = new Array();
			this.obstacles = new Array();
			this.isJumping = false;
			this.isPaused = false;
			this.prevX = 1.0;

			// change when testing
			this.speed = 10; // default null
			this.moveX = null; // default null
			this.isF = null; // default null
			// end variables
			/*
			 * End Setup Globals
			 */

			/*
			 * Init the canvas
			 */

			this.crashElem.style.visibility = 'hidden';
			var windowWidth = window.innerWidth;
			var windowHeight = window.innerHeight;

			var w = windowWidth - 2;
			var h = windowHeight - 38;

			var canvasString = '<canvas id="slope" width="' + w + '" height="' + h + '" class="slope"></canvas>';

			$j('#contentHolder').empty();
			$j(canvasString).appendTo('#contentHolder');

			this.context = $j('#slope').get(0).getContext('2d');
			this.context.fillStyle = "rgb(255,255,255)";
			this.canvasWidth = w;
			this.canvasHeight = h;
			this.canvasMiddle = w / 2;
			/*
			 * end canvas init
			 */

			this.SetupObstacles();
			this.SetupSkierEasy("initial");

			// set events
			if (IsTouchDevice()) {
				$j('#contentHolder').bind('touchstart', function(e) {
					var x = e.originalEvent.touches[0].pageX;
					if (x < this.canvasMiddle) {
						this.MoveLeft();
					} else {
						this.MoveRight();
					}
				}.bind(this));

				$j('#contentHolder').bind('touchend', function(e) {
					this.moveX = 0;
				}.bind(this));

				this.WatchForShake(0.5);
			}else{
				$j('#contentHolder').bind('mousedown', function(e) {
					var x = e.pageX;
					if (x < this.canvasMiddle) {
						this.MoveLeft();
					} else {
						this.MoveRight();
					}
				}.bind(this));

				$j('#contentHolder').bind('mouseup', function(e) {
					this.moveX = 0;
				}.bind(this));
			}

			this.StartMainLoop();
		},

		SetupSkierEasy : function(state) {
			var chosen = "riley"; // chosenSkier;

			switch (state) {
			case "initial":
				this.SetupSkier(this.canvasMiddle, 160, 14, 32, chosen + "_down");
				break;
			case "crash":
				var currentX = this.skier.x;
				this.SetupSkier(currentX - 2, 20, 18, 22, chosen + "_crash");
				break;
			}
		},
		SetupSkier : function(x, y, width, height, imgSrc) {
			this.skier = {
					img : new Image(),
					x : x,
					y : y,
					width : width,
					height : height,
					maxX : (this.canvasWidth - width - 2),
					maxY : (this.canvasHeight - height - 2)
			};

			this.skierImgTag = document.getElementById('skierImg');
			this.skierImgTag.src = "images/sprites/" + this.chosenSkier.substr(0, 1) + "/" + imgSrc + ".png";
			this.skierImgTag.style.visibility = 'visible';

			var setupRot = $j('#skierImg').rotate({
					angle : 0,
					maxAngle : 80,
					minAngle : -80
			});

			this.rotTop = 160;
			this.rotLeft = 140;
			try {
				setupRot[0].context.style.position = 'absolute';
				setupRot[0].context.style.top = this.rotTop + 'px';
				setupRot[0].context.style.left = this.rotLeft + 'px';
			} catch (err) {
			}

			this.rot = setupRot;
		},
		SetupObstacles : function() {
			this.obsArray[0] = {
					name : "tree",
					imgSrc : "images/obstacles/tree.png",
					width : 30,
					height : 44
			};

			this.obsArray[1] = {
					name : "stone",
					imgSrc : "images/obstacles/stone.png",
					width : 25,
					height : 10
			};

			this.obsArray[2] = {
					name : "snowman",
					imgSrc : "images/obstacles/snowman.png",
					width : 20,
					height : 19
			};

			this.obsArray[3] = {
					name : "ramp",
					imgSrc : "images/obstacles/ramp.png",
					width : 24,
					height : 44
			}

			this.AddObstacle(6);
		},
		GetRandomObsNum : function() {
			var num = Math.floor(Math.random() * (this.obsArray.length));
			return num;
		},
		AddObstacle : function(num) {
			for (i = 0; i < num; i++) {
				this.randNum1 = Math.floor(Math.random() * 100);
				if (this.randNum1 <= this.treeWidth) {
					this.randNum1 = false;
				} else {
					this.randNum1 = true;
				}

				var randomObstacle = this.GetRandomObsNum();

				var currentObstacle = this.obsArray[randomObstacle];
				var startPosition = (this.canvasHeight - currentObstacle.height - 2);

				var obstacle = {
						img : new Image(),
						x : Math.floor(Math.random() * (this.canvasWidth - currentObstacle.width - 2)),
						y : startPosition + currentObstacle.height + Math.floor(Math.random() * 100),
						width : currentObstacle.width,
						height : currentObstacle.height,
						vDir : this.randNum1,
						maxX : (this.canvasWidth - currentObstacle.width - 2),
						maxY : startPosition,
						name : currentObstacle.name
				};

				obstacle.img.src = this.obsArray[randomObstacle].imgSrc;

				this.obstacles.push(obstacle);
			}
		},
		GetAbom : function() {
			var obstacle = {
					img : new Image(),
					x : Math.floor(Math.random() * (this.canvasWidth - 36 - 2)),
					y : (this.canvasHeight - 46 - 2) + 46 + Math.floor(Math.random() * 100),
					width : 36,
					height : 46,
					vDir : this.randNum1,
					maxX : (this.canvasWidth - 36 - 2),
					maxY : (this.canvasHeight - 46 - 2),
					name : 'abom_h'
			};

			obstacle.img.src = this.mediaPath + "images/obstacles/abom_h.gif";
			this.obstacles.push(obstacle);
		},
		MainLoop : function() {
			// try {
			this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

			var l = this.obstacles.length;
			var currentSpeed = this.speed;
			var currentSkier = this.skier;

			var skierImg = this.chosenSkier;

			var skierRot = this.rot;

			var currentMoveX = this.moveX;
			moveMod = .8;

			var holdLeft = this.rotLeft;
			var xToMove = Math.floor(currentMoveX * moveMod);
			this.rotLeft += xToMove;

//			var maxRight = 310;

			if (this.rotLeft > -1 && this.rotLeft < (maxRight - currentSkier.width)) {
				currentSkier.x += xToMove;
				var currentLeft = this.rotLeft;
			} else {
				this.rotLeft = holdLeft;
				this.moveX = 0;
				currentMoveX = 0;
			}

			var currentRotTop = this.rotTop - 35;
			if (skierRot && !this.isJumping) {
				var rotMod = 20;
				if (currentMoveX > 0)
					skierRot[0].rotateAnimation(-rotMod);
				else if (currentMoveX < 0)
					skierRot[0].rotateAnimation(rotMod);
				else
					skierRot[0].rotate(0);
			}

			var skierMiddleY = (currentRotTop + currentSkier.height) / 2;

			// draw obstacles
			for ( var i = 1; i < l; i++) {
				var currentObs = this.obstacles[i];

				// check for obstacle collision
				var x = ((currentObs.x + 3) < currentSkier.x) && ((currentObs.x + (currentObs.width - 3)) > currentSkier.x);

				if (!x) {
					x = (((currentObs.x + 3) < (currentSkier.x + currentSkier.width)) && ((currentObs.x + (currentObs.width - 3)) > (currentSkier.x + currentSkier.width)));
				}

				var y = (currentObs.y <= currentRotTop) && ((currentObs.y + currentObs.height) >= currentRotTop);

				switch (currentObs.name) {
				case "ramp":
					if (!this.isJumping) {
						if (x && y) {
							this.isJumping = true;

							skierRot[0].rotate(0);
							jQuery(skierRot[0].context).animate({
								top : [ '14', 'swing' ]
							});
							skierRot[0].rotateAnimation(360);
							jQuery(skierRot[0].context).animate({
								top : '160'
							}, 1500, function() {
								skierRot[0].rotate(0);
							});

							var unjump = setTimeout(this.StopJump.bind(this), 2000);
						} else {
							skierRot[0].context.style.left = currentLeft + 'px';
						}
					} else {
						skierRot[0].context.style.left = currentLeft + 'px';
					}
					break;
				case "abom_h":
					if (!this.isF) {
						if (x && y && !this.isJumping) {
							this.StopMainLoop();
							this.Collide(currentSkier, currentObs);
						} else {
							skierRot[0].context.style.left = currentLeft + 'px';
						}
					} else {
						skierRot[0].context.style.left = currentLeft + 'px';
					}
					break;

				default:
					if (x && y && !this.isJumping) {
						this.StopMainLoop();
						this.Collide(currentSkier, currentObs);
					} else {
						skierRot[0].context.style.left = currentLeft + 'px';
					}
				}

				this.context.drawImage(currentObs.img, currentObs.x, currentObs.y, currentObs.width, currentObs.height);
				// this.context.drawImage(currentObs.img, 0, 0);

				if (currentObs.vDir) {
					if (currentObs.name == "abom_h" && !this.isF) {
						if (currentObs.y <= this.chase) {
							this.chase += .7;
							currentObs.x = currentSkier.x;
							currentObs.y = this.chase;
						} else {
							currentObs.y -= currentSpeed;
						}
					} else {
						currentObs.y -= currentSpeed;
					}
				} else {
					var randomObstacle = this.GetRandomObsNum();

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
					if (currentObs.name == "abom_h") {
						this.chase = 0;
					}
				}
			}

			if (currentSpeed > 0) {
				if (this.isJumping) {
					this.score += (this.speed / 10) + 5.3;
				} else {
					this.score += (this.speed / 10);
				}
			}

			var printScore = Math.round(this.score);
			this.divScoreBoard.innerHTML = "Score: " + Math.round(printScore);

			if (printScore >= this.increaseDiffScore) {
				this.StopMainLoop();
				this.AddObstacle(1);
				this.StartMainLoop();

				this.increaseDiffScore += 500;
			}

			if (printScore >= this.drawAbom) {
				this.StopMainLoop();
				this.GetAbom();
				this.StartMainLoop();

				this.drawAbom += 300;
			}
			// } catch (Err) {
			// this.StopMainLoop();
			// console.log('Error in Main Loop:\n\n' + printObjProps(Err));
			// }
		},
		MoveLeft : function() {
			if (this.skier.x > 2)
				this.moveX = -4;
		},
		MoveRight : function() {
			if (this.skier.x < this.skier.maxX)
				this.moveX = 4;
		},
		WatchForShake : function(threshold) {
			var axl = new Accelerometer();
			axl.watchAcceleration(function(Accel) {
				if (true === Accel.is_updating) {
					return;
				}

				var diffX = Math.abs(Accel.x) - this.prevX;

				if (diffX >= threshold) {
					// The user has shaken their device. Do something
					alert("You have made a milkshake!");
				}

				this.prevX = Math.abs(Accel.x);
			}, function() {
			}, {
				frequency : 100
			});
		},
		Collide : function(currentSkier, currentObs) {
			this.StopMainLoop();
			var skierImg = this.chosenSkier;

			this.context.fillRect(currentSkier.x, currentSkier.y, currentSkier.width, currentSkier.height);
			var crashElem = this.crashElem;
			if (currentObs.name == "abom_h") {
				crashElem.src = this.mediaPath + "images/obstacles/abom_eat.gif";
				crashElem.style.left = currentSkier.x + 'px';
				crashElem.style.top = (this.rotTop) + 'px';
				crashElem.style.left = currentObs.x + 'px';
				currentObs.img.src = "";
				currentSkier.img.src = "";
				this.rot[0].context.style.display = "none";
			} else {
				crashElem.src = this.mediaPath + "images/sprites/" + skierImg.substr(0, 1) + "/" + "riley_crash.png";
				crashElem.style.top = (this.rotTop) + 'px';
				crashElem.style.left = currentSkier.x + 'px';
				currentSkier.img.src = "";
				this.rot[0].context.style.display = "none";
			}

			crashElem.style.visibility = 'visible';

			var t = setTimeout(this.CheckHighScore.bind(this), 1000);
		},
		CheckHighScore : function() {
			_score = this.score;
			$j.mobile.changePage($j('#hs'));
		},
		StartMainLoop : function() {
			this.mainLoopInterval = setInterval(this.MainLoop.bind(this), 33);
		},
		StopMainLoop : function() {
			clearInterval(this.mainLoopInterval);
			this.mainLoopInterval = null;
		},
		StopJump : function() {
			this.isJumping = false;
		}
});