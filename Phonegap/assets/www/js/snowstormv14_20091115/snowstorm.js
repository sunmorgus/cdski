function SnowStorm() {
	function B() {
		e.start(true)
	}
	function d(a) {
		return parseInt(c(2), 10) == 1 ? a * -1 : a
	}
	function c(a, b) {
		if (isNaN(b)) {
			b = 0
		}
		return Math.random() * a + b
	}
	this.flakesMax = 64;
	this.flakesMaxActive = 32;
	this.animationInterval = 50;
	this.flakeBottom = null;
	this.targetElement = null;
	this.followMouse = false;
	this.snowColor = "#99ccff";
	this.snowCharacter = "•";
	this.snowStick = true;
	this.useMeltEffect = false;
	this.useTwinkleEffect = false;
	this.usePositionFixed = false;
	this.flakeLeftOffset = 0;
	this.flakeRightOffset = 0;
	this.flakeWidth = 8;
	this.flakeHeight = 8;
	this.vMaxX = 5;
	this.vMaxY = 4;
	this.zIndex = 9999;
	var a = typeof window.attachEvent == "undefined" ? function(a, b, c) {
		return a.addEventListener(b, c, false)
	} : function(a, b, c) {
		return a.attachEvent("on" + b, c)
	};
	var b = typeof window.attachEvent == "undefined" ? function(a, b, c) {
		return a.removeEventListener(b, c, false)
	} : function(a, b, c) {
		return a.detachEvent("on" + b, c)
	};
	var e = this;
	var f = this;
	this.timers = [];
	this.flakes = [];
	this.disabled = false;
	this.active = false;
	var g = navigator.userAgent.match(/msie/i);
	var h = navigator.userAgent.match(/msie 6/i);
	var i = g && (h || navigator.userAgent.match(/msie 5/i));
	var j = navigator.appVersion.match(/windows 98/i);
	var k = navigator.userAgent.match(/iphone/i);
	var l = g && document.compatMode == "BackCompat";
	var m = l || h || k ? true : false;
	var n = null;
	var o = null;
	var p = null;
	var q = null;
	var r = null;
	var s = null;
	var t = 1;
	var u = 2;
	var v = 6;
	var w = false;
	var x = function() {
		try {
			document.createElement("div").style.opacity = "0.5"
		} catch (a) {
			return false
		}
		return true
	}();
	var y = document.createDocumentFragment();
	if (e.flakeLeftOffset === null) {
		e.flakeLeftOffset = 0
	}
	if (e.flakeRightOffset === null) {
		e.flakeRightOffset = 0
	}
	this.meltFrameCount = 20;
	this.meltFrames = [];
	for ( var z = 0; z < this.meltFrameCount; z++) {
		this.meltFrames.push(1 - z / this.meltFrameCount)
	}
	this.randomizeWind = function() {
		r = d(c(e.vMaxX, .2));
		s = c(e.vMaxY, .2);
		if (this.flakes) {
			for ( var a = 0; a < this.flakes.length; a++) {
				if (this.flakes[a].active) {
					this.flakes[a].setVelocities()
				}
			}
		}
	};
	this.scrollHandler = function() {
		q = e.flakeBottom ? 0 : parseInt(window.scrollY || document.documentElement.scrollTop || document.body.scrollTop, 10);
		if (isNaN(q)) {
			q = 0
		}
		if (!w && !e.flakeBottom && e.flakes) {
			for ( var a = e.flakes.length; a--;) {
				if (e.flakes[a].active === 0) {
					e.flakes[a].stick()
				}
			}
		}
	};
	this.resizeHandler = function() {
		if (window.innerWidth || window.innerHeight) {
			n = window.innerWidth - (!g ? 16 : 2) - e.flakeRightOffset;
			p = e.flakeBottom ? e.flakeBottom : window.innerHeight
		} else {
			n = (document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth) - (!g ? 8 : 0) - e.flakeRightOffset;
			p = e.flakeBottom ? e.flakeBottom : document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight
		}
		o = parseInt(n / 2, 10)
	};
	this.resizeHandlerAlt = function() {
		n = e.targetElement.offsetLeft + e.targetElement.offsetWidth - e.flakeRightOffset;
		p = e.flakeBottom ? e.flakeBottom : e.targetElement.offsetTop + e.targetElement.offsetHeight;
		o = parseInt(n / 2, 10)
	};
	this.freeze = function() {
		if (!e.disabled) {
			e.disabled = 1
		} else {
			return false
		}
		for ( var a = e.timers.length; a--;) {
			clearInterval(e.timers[a])
		}
	};
	this.resume = function() {
		if (e.disabled) {
			e.disabled = 0
		} else {
			return false
		}
		e.timerInit()
	};
	this.toggleSnow = function() {
		if (!e.flakes.length) {
			e.start()
		} else {
			e.active = !e.active;
			if (e.active) {
				e.show();
				e.resume()
			} else {
				e.stop();
				e.freeze()
			}
		}
	};
	this.stop = function() {
		this.freeze();
		for ( var a = this.flakes.length; a--;) {
			this.flakes[a].o.style.display = "none"
		}
		b(window, "scroll", e.scrollHandler);
		b(window, "resize", e.resizeHandler);
		if (!i) {
			b(window, "blur", e.freeze);
			b(window, "focus", e.resume)
		}
	};
	this.show = function() {
		for ( var a = this.flakes.length; a--;) {
			this.flakes[a].o.style.display = "block"
		}
	};
	this.SnowFlake = function(a, b, d, e) {
		var f = this;
		var g = a;
		this.type = b;
		this.x = d || parseInt(c(n - 20), 10);
		this.y = !isNaN(e) ? e : -c(p) - 12;
		this.vX = null;
		this.vY = null;
		this.vAmpTypes = [ 1, 1.2, 1.4, 1.6, 1.8 ];
		this.vAmp = this.vAmpTypes[this.type];
		this.melting = false;
		this.meltFrameCount = g.meltFrameCount;
		this.meltFrames = g.meltFrames;
		this.meltFrame = 0;
		this.twinkleFrame = 0;
		this.active = 1;
		this.fontSize = 10 + this.type / 5 * 10;
		this.o = document.createElement("div");
		this.o.innerHTML = g.snowCharacter;
		this.o.style.color = g.snowColor;
		this.o.style.position = w ? "fixed" : "absolute";
		this.o.style.width = g.flakeWidth + "px";
		this.o.style.height = g.flakeHeight + "px";
		this.o.style.fontFamily = "arial,verdana";
		this.o.style.overflow = "hidden";
		this.o.style.fontWeight = "normal";
		this.o.style.zIndex = g.zIndex;
		y.appendChild(this.o);
		this.refresh = function() {
			if (isNaN(f.x) || isNaN(f.y)) {
				return false
			}
			f.o.style.left = f.x + "px";
			f.o.style.top = f.y + "px"
		};
		this.stick = function() {
			if (m || g.targetElement != document.documentElement && g.targetElement != document.body) {
				f.o.style.top = p + q - g.flakeHeight + "px"
			} else if (g.flakeBottom) {
				f.o.style.top = g.flakeBottom + "px"
			} else {
				f.o.style.display = "none";
				f.o.style.top = "auto";
				f.o.style.bottom = "0px";
				f.o.style.position = "fixed";
				f.o.style.display = "block"
			}
		};
		this.vCheck = function() {
			if (f.vX >= 0 && f.vX < .2) {
				f.vX = .2
			} else if (f.vX < 0 && f.vX > -.2) {
				f.vX = -.2
			}
			if (f.vY >= 0 && f.vY < .2) {
				f.vY = .2
			}
		};
		this.move = function() {
			var a = f.vX * t;
			f.x += a;
			f.y += f.vY * f.vAmp;
			if (f.x >= n || n - f.x < g.flakeWidth) {
				f.x = 0
			} else if (a < 0 && f.x - g.flakeLeftOffset < 0 - g.flakeWidth) {
				f.x = n - g.flakeWidth - 1
			}
			f.refresh();
			var b = p + q - f.y;
			if (b < g.flakeHeight) {
				f.active = 0;
				if (g.snowStick) {
					f.stick()
				} else {
					f.recycle()
				}
			} else {
				if (g.useMeltEffect && f.active && f.type < 3 && !f.melting && Math
						.random() > .998) {
					f.melting = true;
					f.melt()
				}
				if (g.useTwinkleEffect) {
					if (!f.twinkleFrame) {
						if (Math.random() > .9) {
							f.twinkleFrame = parseInt(Math.random() * 20, 10)
						}
					} else {
						f.twinkleFrame--;
						f.o.style.visibility = f.twinkleFrame && f.twinkleFrame % 2 === 0 ? "hidden" : "visible"
					}
				}
			}
		};
		this.animate = function() {
			f.move()
		};
		this.setVelocities = function() {
			f.vX = r + c(g.vMaxX * .12, .1);
			f.vY = s + c(g.vMaxY * .12, .1)
		};
		this.setOpacity = function(a, b) {
			if (!x) {
				return false
			}
			a.style.opacity = b
		};
		this.melt = function() {
			if (!g.useMeltEffect || !f.melting) {
				f.recycle()
			} else {
				if (f.meltFrame < f.meltFrameCount) {
					f.meltFrame++;
					f.setOpacity(f.o, f.meltFrames[f.meltFrame]);
					f.o.style.fontSize = f.fontSize - f.fontSize * (f.meltFrame / f.meltFrameCount) + "px";
					f.o.style.lineHeight = g.flakeHeight + 2 + g.flakeHeight * .75 * (f.meltFrame / f.meltFrameCount) + "px"
				} else {
					f.recycle()
				}
			}
		};
		this.recycle = function() {
			f.o.style.display = "none";
			f.o.style.position = w ? "fixed" : "absolute";
			f.o.style.bottom = "auto";
			f.setVelocities();
			f.vCheck();
			f.meltFrame = 0;
			f.melting = false;
			f.setOpacity(f.o, 1);
			f.o.style.padding = "0px";
			f.o.style.margin = "0px";
			f.o.style.fontSize = f.fontSize + "px";
			f.o.style.lineHeight = g.flakeHeight + 2 + "px";
			f.o.style.textAlign = "center";
			f.o.style.verticalAlign = "baseline";
			f.x = parseInt(c(n - g.flakeWidth - 20), 10);
			f.y = parseInt(c(p) * -1, 10) - g.flakeHeight;
			f.refresh();
			f.o.style.display = "block";
			f.active = 1
		};
		this.recycle();
		this.refresh()
	};
	this.snow = function() {
		var a = 0;
		var b = 0;
		var d = 0;
		var f = null;
		for ( var g = e.flakes.length; g--;) {
			if (e.flakes[g].active == 1) {
				e.flakes[g].move();
				a++
			} else if (e.flakes[g].active === 0) {
				b++
			} else {
				d++
			}
			if (e.flakes[g].melting) {
				e.flakes[g].melt()
			}
		}
		if (a < e.flakesMaxActive) {
			f = e.flakes[parseInt(c(e.flakes.length), 10)];
			if (f.active === 0) {
				f.melting = true
			}
		}
	};
	this.mouseMove = function(a) {
		if (!e.followMouse) {
			return true
		}
		var b = parseInt(a.clientX, 10);
		if (b < o) {
			t = -u + b / o * u
		} else {
			b -= o;
			t = b / o * u
		}
	};
	this.createSnow = function(a, b) {
		for ( var d = 0; d < a; d++) {
			e.flakes[e.flakes.length] = new e.SnowFlake(e, parseInt(c(v), 10));
			if (b || d > e.flakesMaxActive) {
				e.flakes[e.flakes.length - 1].active = -1
			}
		}
		f.targetElement.appendChild(y)
	};
	this.timerInit = function() {
		e.timers = !j ? [ setInterval(e.snow, e.animationInterval) ] : [ setInterval(e.snow, e.animationInterval * 3), setInterval(e.snow, e.animationInterval) ]
	};
	this.init = function() {
		e.randomizeWind();
		e.createSnow(e.flakesMax);
		a(window, "resize", e.resizeHandler);
		a(window, "scroll", e.scrollHandler);
		if (!i) {
			a(window, "blur", e.freeze);
			a(window, "focus", e.resume)
		}
		e.resizeHandler();
		e.scrollHandler();
		if (e.followMouse) {
			a(document, "mousemove", e.mouseMove)
		}
		e.animationInterval = Math.max(20, e.animationInterval);
		e.timerInit()
	};
	var A = false;
	this.start = function(a) {
		if (!A) {
			A = true
		} else if (a) {
			return true
		}
		if (typeof e.targetElement == "string") {
			var b = e.targetElement;
			e.targetElement = document.getElementById(b);
			if (!e.targetElement) {
				throw new Error('Snowstorm: Unable to get targetElement "' + b + '"')
			}
		}
		if (!e.targetElement) {
			e.targetElement = !g ? document.documentElement ? document.documentElement : document.body : document.body
		}
		if (e.targetElement != document.documentElement && e.targetElement != document.body) {
			e.resizeHandler = e.resizeHandlerAlt
		}
		e.resizeHandler();
		e.usePositionFixed = e.usePositionFixed && !m;
		w = e.usePositionFixed;
		if (n && p && !e.disabled) {
			e.init();
			e.active = true
		}
	};
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", B, false);
		window.addEventListener("load", B, false)
	} else {
		a(window, "load", B)
	}
}
var snowStorm = null;
snowStorm = new SnowStorm