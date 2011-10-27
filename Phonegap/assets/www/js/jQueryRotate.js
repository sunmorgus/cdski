$j.fn.extend({
		ImageRotate : function(a) {
			if (this.Wilq32 && this.Wilq32.PhotoEffect)
				return;
			return (new Wilq32.PhotoEffect(this.get(0), a))._temp
		},
		rotate : function(a) {
			if (this.length === 0)
				return;
			if (typeof a == "undefined")
				return;
			if (typeof a == "number")
				a = {
					angle : a
				};
			var b = [];
			for ( var c = 0, d = this.length; c < d; c++) {
				var e = this.get(c);
				b.push($j($j(e).ImageRotate(a)))
			}
			return b
		},
		rotateAnimation : function(a) {
			if (this.length === 0)
				return;
			if (typeof a == "undefined")
				return;
			if (typeof a == "number")
				a = {
					angle : a
				};
			var b = [];
			for ( var c = 0, d = this.length; c < d; c++) {
				var e = this.get(c);
				if (typeof e.Wilq32 == "undefined")
					b.push($j($j(e).ImageRotate(a)));
				else {
					e.Wilq32.PhotoEffect._parameters.animateAngle = a.angle;
					e.Wilq32.PhotoEffect._parameters.callback = a.callback || function() {
					};
					e.Wilq32.PhotoEffect._animateStart()
				}
			}
			return b
		}
});
Wilq32 = {};
Wilq32.PhotoEffect = function(a, b) {
	this._IEfix = a;
	this._parameters = b;
	this._parameters.className = a.className;
	this._parameters.id = a.getAttribute("id");
	this._parameters.animateAngle = 0;
	if (!b)
		this._parameters = {};
	this._angle = 0;
	if (!b.angle)
		this._parameters.angle = 0;
	this._temp = document.createElement("span");
	this._temp.Wilq32 = {
		PhotoEffect : this
	};
	var c = a.src;
	a.parentNode.insertBefore(this._temp, a);
	this._img = new Image;
	this._img.src = c;
	this._img._ref = this;
	$j(this._img).bind("load", function() {
		this._ref._Loader.call(this._ref)
	});
	if ($j.browser.msie)
		if (this._img.complete)
			this._Loader()
};
Wilq32.PhotoEffect.prototype._Loader = function() {
	if ($j.browser.msie)
		return function() {
			var a = this._IEfix.src;
			this._IEfix.parentNode.removeChild(this._IEfix);
			this._temp.setAttribute("id", this._parameters.id);
			this._temp.className = this._parameters.className;
			var b = this._img.width;
			var c = this._img.height;
			this._img._widthMax = this._img._heightMax = Math.sqrt(c * c + b * b);
			this._img._heightMax = Math.sqrt(c * c + b * b);
			this._vimage = document.createElement("v:image");
			this._vimage._ref = this;
			this._vimage.style.height = c;
			this._vimage.style.width = b;
			this._vimage.style.position = "relative";
			this._temp.style.display = "inline-block";
			this._temp.style.width = this._temp.style.height = this._img._heightMax;
			this._vimage.src = a;
			this._temp.appendChild(this._vimage);
			var d = this;
			if (this._parameters.bind) {
				for ( var e in this._parameters.bind)
					if (this._parameters.bind.hasOwnProperty(e))
						for ( var f in this._parameters.bind[e])
							if (this._parameters.bind[e].hasOwnProperty(f))
								$j(this._temp).bind(f, this._parameters.bind[e][f])
			}
			this._rotate(this._parameters.angle)
		};
	else
		return function() {
			this._IEfix.parentNode.removeChild(this._IEfix);
			this._temp.setAttribute("id", this._parameters.id);
			this._temp.className = this._parameters.className;
			var a = this._img.width;
			var b = this._img.height;
			this._img._widthMax = this._img._heightMax = Math.sqrt(b * b + a * a);
			this._canvas = document.createElement("canvas");
			this._canvas._ref = this;
			this._canvas.height = b;
			this._canvas.width = a;
			this._canvas.id = "skierCanvas";
			this._canvas.setAttribute("width", a);
			this._temp.appendChild(this._canvas);
			var c = this;
			if (this._parameters.bind) {
				for ( var d in this._parameters.bind)
					if (this._parameters.bind.hasOwnProperty(d))
						for ( var e in this._parameters.bind[d])
							if (this._parameters.bind[d].hasOwnProperty(e))
								$j(this._canvas).bind(e, this._parameters.bind[d][e])
			}
			this._cnv = this._canvas.getContext("2d");
			this._rotate(this._parameters.angle)
		}
}();
Wilq32.PhotoEffect.prototype._animateStart = function() {
	if (this._timer)
		clearTimeout(this._timer);
	this._animate()
};
Wilq32.PhotoEffect.prototype._animate = function() {
	if (this._canvas || this._vimage)
		this._angle -= (this._angle - this._parameters.animateAngle) * .1;
	if (typeof this._parameters.minAngle != "undefined")
		if (this._angle < this._parameters.minAngle)
			this._angle = this._parameters.minAngle;
	if (typeof this._parameters.maxAngle != "undefined")
		if (this._angle > this._parameters.maxAngle)
			this._angle = this._parameters.maxAngle;
	if (Math.round(this._angle * 100 - this._parameters.animateAngle * 100) == 0 && this._timer) {
		clearTimeout(this._timer);
		if (this._parameters.callback)
			this._parameters.callback()
	} else {
		if (this._canvas || this._vimage)
			this._rotate(this._angle);
		var a = this;
		this._timer = setTimeout(function() {
			a._animate.call(a)
		}, 2)
	}
};
Wilq32.PhotoEffect.prototype._rotate = function() {
	if ($j.browser.msie)
		return function(a) {
			this._vimage.style.rotation = a;
			var b = a * Math.PI / 180;
			this._vimage.style.top = (this._img._heightMax - this._img.height) / 2 - (this._vimage.offsetHeight - this._img.height) / 2 + "px";
			this._vimage.style.left = (this._img._widthMax - this._img.width) / 2 - (this._vimage.offsetWidth - this._img.width) / 2 + "px"
		};
	else
		return function(a) {
			if (!this._img.width)
				return;
			if (typeof a != "number")
				return;
			a = a % 360 * Math.PI / 180;
			var b = this._img.width;
			var c = this._img.height;
			var d = this._img._widthMax - b;
			var e = this._img._heightMax - c;
			this._canvas.width = b + d;
			this._canvas.height = c + e;
			this._cnv.save();
			this._cnv.translate(d / 2, e / 2);
			this._cnv.translate(b / 2, c / 2);
			this._cnv.rotate(a);
			this._cnv.translate(-b / 2, -c / 2);
			this._cnv.drawImage(this._img, 0, 0, b, c);
			this._cnv.restore()
		}
}()