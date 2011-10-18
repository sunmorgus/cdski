var Game = Class
		.create({
			initialize : function() {

			},

			SetupCanvas : function(params) {
				// setup initial global variables
				_mediaPath = "/android_asset/www/";
				_chosenSkier = params.chosen;
				_obsArray = new Array();
				_obstacles = new Array();
				_isJumping = false
				_hsDB = params.db;
				_fSpeedMod = 1;
				_fButtonVisible = params.fButtonVisible;
				_tilt = params.tilt;
				_chase = 0;
				_leftKey = params.leftKey;
				_rightKey = params.rightKey;
				_fastKey = params.fastKey;
				_treeWidth = 44;

				// change when testing
				_speed = 10; // default null
				_moveX = null; // default null
				_isF = null; // default null

				var windowWidth = window.innerWidth;
				var windowHeight = window.innerHeight;

				var w = windowWidth / 1.2;
				if (windowWidth <= 320)
					w = windowWidth / 1.5;

				var h = window.innerHeight / 1.2;
				if (windowHeight <= 480)
					h = windowHeight / 1.5;

				// console.log(window.innerWidth + ':' + w + ' ' +
				// window.innerHeight + ':'
				// + h);
				var canvasString = '<canvas id="slope" width="' + w
						+ '" height="' + h + '" class="slope"></canvas>';

				$j('#contentHolder').empty();
				$j(canvasString).appendTo('#contentHolder');

				_context = $j('#slope').get(0).getContext('2d');
				_context.fillStyle = "rgb(255,255,255)";
				_canvasWidth = w;
				_canvasHeight = h;

				document.getElementById('gameFooter').style.visibility = 'visible';

				_isPaused = false;

				_divScoreBoard = document.getElementById('scoreboard');
				_score = 0;
				_increaseDiffScore = 50;
				_drawAbom = 300;

				this.SetupObstacles();
				this.SetupSkierEasy("initial");

				// set button events
				$j('#leftButton').bind('taphold', function(e) {
					this.MoveLeft();
				}.bind(this));
				$j('#rightButton').bind('taphold', function(e) {
					this.MoveRight();
				}.bind(this))

				_isJumping = false;

				this.StartMainLoop();
			},

			SetupSkierEasy : function(state) {
				var chosen = "riley"; // chosenSkier;

				switch (state) {
				case "initial":
					this.SetupSkier(150, 160, 14, 32, chosen + "_down");
					break;
				case "crash":
					var currentX = _skier.x;
					this
							.SetupSkier(currentX - 2, 20, 18, 22, chosen
									+ "_crash");
					break;
				}
			},
			SetupSkier : function(x, y, width, height, imgSrc) {
				_skier = {
					img : new Image(),
					x : x,
					y : y,
					width : width,
					height : height,
					maxX : (_canvasWidth - width - 2),
					maxY : (_canvasHeight - height - 2)
				};

				_skierImgTag = document.getElementById('skierImg');
				_skierImgTag.src = _mediaPath + "images/sprites/"
						+ _chosenSkier.substr(0, 1) + "/" + imgSrc + ".png";
				_skierImgTag.style.visibility = 'visible';

				var setupRot = $j('#skierImg').rotate({
					angle : 0,
					maxAngle : 80,
					minAngle : -80
				});

				_rotTop = 160;
				_rotLeft = 140;
				setupRot[0].context.style.position = 'absolute';
				setupRot[0].context.style.top = _rotTop + 'px';
				setupRot[0].context.style.left = _rotLeft + 'px';

				_rot = setupRot;
			},
			SetupObstacles : function() {
				_obsArray[0] = {
					name : "tree",
					imgSrc : "images/obstacles/tree.png",
					width : 30,
					height : 44
				};

				_obsArray[1] = {
					name : "stone",
					imgSrc : "images/obstacles/stone.png",
					width : 25,
					height : 10
				};

				_obsArray[2] = {
					name : "snowman",
					imgSrc : "images/obstacles/snowman.png",
					width : 20,
					height : 19
				};

				_obsArray[3] = {
					name : "ramp",
					imgSrc : "images/obstacles/ramp.png",
					width : 24,
					height : 44
				}

				this.AddObstacle(6);
			},
			GetRandomObsNum : function() {
				var num = Math.floor(Math.random() * (_obsArray.length));
				return num;
			},
			AddObstacle : function(num) {
				for (i = 0; i < num; i++) {
					_randNum1 = Math.floor(Math.random() * 100);
					if (_randNum1 <= _treeWidth) {
						_randNum1 = false;
					} else {
						_randNum1 = true;
					}

					var randomObstacle = this.GetRandomObsNum();

					var currentObstacle = _obsArray[randomObstacle];
					var startPosition = (_canvasHeight - currentObstacle.height - 2);

					var obstacle = {
						img : new Image(),
						x : Math.floor(Math.random()
								* (_canvasWidth - currentObstacle.width - 2)),
						y : startPosition + currentObstacle.height
								+ Math.floor(Math.random() * 100),
						width : currentObstacle.width,
						height : currentObstacle.height,
						vDir : _randNum1,
						maxX : (_canvasWidth - currentObstacle.width - 2),
						maxY : startPosition,
						name : currentObstacle.name
					};

					obstacle.img.src = _obsArray[randomObstacle].imgSrc;

					_obstacles.push(obstacle);
				}
			},
			GetAbom : function() {
				var obstacle = {
					img : new Image(),
					x : Math.floor(Math.random() * (_canvasWidth - 36 - 2)),
					y : (_canvasHeight - 46 - 2) + 46
							+ Math.floor(Math.random() * 100),
					width : 36,
					height : 46,
					vDir : _randNum1,
					maxX : (_canvasWidth - 36 - 2),
					maxY : (_canvasHeight - 46 - 2),
					name : 'abom_h'
				};

				obstacle.img.src = "images/obstacles/abom_h.gif";
				_obstacles.push(obstacle);
			},
			MainLoop : function() {
				try {
					_context.fillRect(0, 0, _canvasWidth, _canvasHeight);

					var l = _obstacles.length;
					var currentSpeed = _speed;
					var currentSkier = _skier;

					var skierImg = _chosenSkier;

					var skierRot = _rot;

					var currentMoveX = _moveX;
					moveMod = .8;

					var holdLeft = _rotLeft;
					_rotLeft += Math.floor(currentMoveX * moveMod);

					var maxRight = 310;
					if (jQuery(window).height() > 700)
						maxRight = 1014;

					if (_rotLeft > -1
							&& _rotLeft < (maxRight - currentSkier.width)) {
						currentSkier.x += Math.floor(currentMoveX * moveMod);
						var currentLeft = _rotLeft;
					} else {
						_rotLeft = holdLeft;
						_moveX = 0;
						currentMoveX = 0;
					}

					var currentRotTop = _rotTop - 35;

					var rotMod = 5;
					if (jQuery(window).height() > 700)
						rotMod = -5;
					if (skierRot && !_isJumping) {
						skierRot[0].rotate({
							animateTo : currentMoveX * rotMod
						})
					}

					var skierMiddleY = (currentRotTop + currentSkier.height) / 2;

					// draw obstacles
					for ( var i = 1; i < l; i++) {
						var currentObs = _obstacles[i];

						// check for obstacle collision
						var x = ((currentObs.x + 3) < currentSkier.x)
								&& ((currentObs.x + (currentObs.width - 3)) > currentSkier.x);

						if (!x) {
							x = (((currentObs.x + 3) < (currentSkier.x + currentSkier.width)) && ((currentObs.x + (currentObs.width - 3)) > (currentSkier.x + currentSkier.width)));
						}

						var y = (currentObs.y <= currentRotTop)
								&& ((currentObs.y + currentObs.height) >= currentRotTop);

						switch (currentObs.name) {
						case "ramp":
							if (!_isJumping) {
								if (x && y) {
									_isJumping = true;

									skierRot[0].rotate({
										animateTo : 0
									});
									jQuery(skierRot[0].context).animate({
										top : [ '14', 'swing' ]
									});
									skierRot[0].rotate({
										animateTo : 360
									});
									jQuery(skierRot[0].context).animate({
										top : '160'
									}, 1500);

									var unjump = setTimeout(this.StopJump.bind(this), 2000);
								} else {
									skierRot[0].context.style.left = currentLeft
											+ 'px';
								}
							} else {
								skierRot[0].context.style.left = currentLeft
										+ 'px';
							}
							break;
						case "abom_h":
							if (!_isF) {
								if (x && y && !_isJumping) {
									this.StopMainLoop();
									this.Collide(currentSkier, currentObs);
								} else {
									skierRot[0].context.style.left = currentLeft
											+ 'px';
								}
							} else {
								skierRot[0].context.style.left = currentLeft
										+ 'px';
							}
							break;

						default:
							if (x && y && !_isJumping) {
								this.StopMainLoop();
								this.Collide(currentSkier, currentObs);
							} else {
								skierRot[0].context.style.left = currentLeft
										+ 'px';
							}
						}

						_context.drawImage(currentObs.img, currentObs.x,
								currentObs.y, currentObs.width,
								currentObs.height);
						// _context.drawImage(currentObs.img, 0, 0);

						if (currentObs.vDir) {
							if (currentObs.name == "abom_h" && !_isF) {
								if (currentObs.y <= _chase) {
									_chase += .7;
									currentObs.x = currentSkier.x;
									currentObs.y = _chase;
								} else {
									currentObs.y -= currentSpeed;
								}
							} else {
								currentObs.y -= currentSpeed;
							}
						} else {
							var randomObstacle = this.GetRandomObsNum();

							var currentObstacle = _obsArray[randomObstacle];
							currentObs.img.src = currentObstacle.imgSrc;
							currentObs.height = currentObstacle.height;
							currentObs.width = currentObstacle.width;

							currentObs.y = currentObs.maxY + currentObs.height
									+ Math.floor(Math.random() * 100);
							currentObs.x = Math.floor(Math.random()
									* (_canvasWidth - currentObs.width - 2));
							currentObs.vDir = _canvasHeight;
							currentObs.name = currentObstacle.name;
						}

						if (currentObs.y <= -currentObs.height) {
							currentObs.vDir = !currentObs.vDir;
							if (currentObs.name == "abom_h") {
								_chase = 0;
							}
						}
					}

					if (currentSpeed > 0) {
						if (_isJumping) {
							_score += (_speed / 10) + 5.3;
						} else {
							_score += (_speed / 10);
						}
					}

					var printScore = Math.round(_score);
					_divScoreBoard.innerHTML = "Score: "
							+ Math.round(printScore);

					if (printScore >= _increaseDiffScore) {
						this.StopMainLoop();
						this.AddObstacle(1);
						this.StartMainLoop();

						_increaseDiffScore += 500;
					}

					if (printScore >= _drawAbom) {
						this.StopMainLoop();
						this.GetAbom();
						this.StartMainLoop();

						_drawAbom += 300;
					}
				} catch (Err) {
					StopMainLoop();
					alert('Error starting Main Loop:\n\n' + Err.description);
				}
			},
			MoveLeft : function() {
				if (_skier.x > 2)
					_moveX = -4;
			},
			MoveRight : function() {
				if (_skier.x < _skier.maxX)
					_moveX = 4;
			},
			Collide : function(currentSkier, currentObs) {
				this.StopMainLoop();
				var skierImg = _chosenSkier;

				_context.fillRect(currentSkier.x, currentSkier.y,
						currentSkier.width, currentSkier.height);
				var crashElem = document.getElementById('crash');
				if (currentObs.name == "abom_h") {
					crashElem.src = _mediaPath
							+ "images/obstacles/abom_eat.gif",
							crashElem.style.left = currentSkier.x + 'px';
					crashElem.style.top = (_rotTop) + 'px';
					crashElem.style.left = currentObs.x + 'px';
					currentObs.img.src = "";
					currentSkier.img.src = "";
					_rot[0].context.style.display = "none";
				} else {
					crashElem.src = _mediaPath + "images/sprites/"
							+ skierImg.substr(0, 1) + "/" + "riley_crash.png";
					crashElem.style.top = (_rotTop) + 'px';
					crashElem.style.left = currentSkier.x + 'px';
					currentSkier.img.src = "";
					_rot[0].context.style.display = "none";
				}

				crashElem.style.visibility = 'visible';

				// var t = setTimeout(CheckHighScore(), 1000);
			},
			StartMainLoop : function() {
				_mainLoopInterval = setInterval(this.MainLoop.bind(this), 33);
			},
			StopMainLoop : function() {
				clearInterval(_mainLoopInterval);
				_mainLoopInterval = null;
			},
			StopJump : function() {
				_isJumping = false;
			}
		});