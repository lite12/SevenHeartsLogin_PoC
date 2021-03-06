//////
// array
if (!Array.prototype.pop)
{
	Array.prototype.pop = function()
	{
		if (!this.length) return null;
		var last = this[this.length - 1];
		--this.length;
		return last;
	}
}
if (!Array.prototype.push)
{
	Array.prototype.push = function()
	{
		for (var i=0,n=arguments.length;i<n;i++)
			this[this.length] = arguments[i];
		return this.length;
	}
}
if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(value,idx)
	{
		if (typeof(idx) != 'number') idx = 0;
		else if (idx < 0) idx = this.length + idx;
		for (var i=idx,n=this.length;i<n;i++)
			if (this[i] === value) return i;
		return -1;
	}
}
// browser
function Browser()
{
	this.name = navigator.userAgent;
	this.isWinIE = this.isMacIE = false;
	this.isGecko  = this.name.match(/Gecko\//);
	this.isSafari = this.name.match(/AppleWebKit/);
	this.isKHTML  = this.isSafari || navigator.appVersion.match(/Konqueror|KHTML/);
	this.isOpera  = window.opera;
	if (document.all && !this.isGecko && !this.isSafari && !this.isOpera)
	{
		this.isWinIE = this.name.match(/Win/);
		this.isMacIE = this.name.match(/Mac/);
	}
}
var Browser = new Browser();
// event 
if (!window.Event) var Event = new Object;
Event = {
	cache : false,
	getEvent : function(evnt)
	{
		return (evnt) ? evnt : ((window.event) ? window.event : null);
	},
	getKey : function(evnt)
	{
		evnt = this.getEvent(evnt);
		return (evnt.which) ? evnt.which : evnt.keyCode;
	},
	stop : function(evnt)
	{
		try{ evnt.stopPropagation() } catch(err){};
		evnt.cancelBubble = true;
		try{ evnt.preventDefault() } catch(err){};
		return (evnt.returnValue = false);
	},
	register : function(object, type, handler)
	{
		if (type == 'keypress' && (Browser.isKHTML || object.attachEvent)) type = 'keydown';
		if (type == 'mousewheel' && Browser.isGecko) type = 'DOMMouseScroll';
		if (!this.cache) this.cache = [];
		if (object.addEventListener)
		{
			this.cache.push([object,type,handler]);
			object.addEventListener(type, handler, false);
		}
		else if (object.attachEvent)
		{
			this.cache.push([object,type,handler]);
			object.attachEvent(['on',type].join(''),handler);
		}
		else
		{
			object[['on',type].join('')] = handler;
		}
	},
	deregister : function(object, type, handler)
	{
		if (type == 'keypress' && (Browser.isKHTML || object.attachEvent)) type = 'keydown';
		if (type == 'mousewheel' && Browser.isGecko) type = 'DOMMouseScroll';
		if (object.removeEventListener)
			object.removeEventListener(type, handler, false);
		else if (object.detachEvent)
			object.detachEvent(['on',type].join(''), handler);
		else
			object[['on',type].join('')] = null;
	},
	deregisterAll : function()
	{
		if (!Event.cache) return
		for (var i=0,n=Event.cache.length;i<n;i++)
		{
			Event.deregister(Event.cache[i]);
			Event.cache[i][0] = null;
		}
		Event.cache = false;
	}
};
Event.register(window, 'unload', Event.deregisterAll);
// dom 
document.getElemetsByClassName = function(name,target)
{
	var result = [];
	var object  = null;
	var search = new RegExp(['(^|\\s)',name,'(\\s|$)'].join(''));
	if (target && target.getElementsByTagName)
		object = target.getElementsByTagName('*');
	if (!object)
		object = document.getElementsByTagName ? document.getElementsByTagName('*') : document.all;
	for (var i=0,n=object.length;i<n;i++)
	{
		var check = object[i].getAttribute('class') || object[i].className;
		if (check.match(search)) result.push(object[i]);
	}
	return result;
}
// library
function Library()
{
	this._path = '';
	this._cache = [];
	this.lang = '';
	this.base = '';
	return this._init();
}
Library.prototype = {
	_init : function()
	{
		var rs_path = document.getElementsByName('X-Resource-Dir')[0];
		var js_path = document.getElementsByName('X-Script-Dir')[0];
		if (rs_path)
		{
			this.base = this._check_path(rs_path.getAttribute('content'));
			if (!js_path) this._path = [this.base,'js/'].join('');
		}
		if (js_path)
			this._path = this._check_path(js_path.getAttribute('content'));
		return this;
	},
	_initLang : function()
	{
		var html = document.getElementsByTagName('html')[0];
		if (!html) return;
		this.lang = html.getAttribute('xml:lang') || html.getAttribute('lang');
	},
	_check_path : function(path)
	{
		if (!path) return '';
		if (!path.match(/\/$/)) path = [path,'/'].join('');
		return path;
	},
	require : function(libs)
	{
		var pre  = '\n<script type="text/javascript" src="';
		var post = '.js"></script>';
		for (var i=0,n=libs.length;i<n;i++)
		{
			if (this._cache.indexOf(libs[i]) > -1) continue;
			document.write([pre,this._path,libs[i],post].join(''));
			this._cache.push(libs[i]);
		}
	},
	path : function(path)
	{
		this._path = this._check_path(path);
	}
}
var Library = new Library();
Event.register(window,'load',function() { Library._initLang() });

function WindowSize()
{ // window size object
	this.w = 0;
	this.h = 0;
	return this.update();
}
WindowSize.prototype.update = function()
{
	var d = document;
	this.w = 
	  (window.innerWidth) ? window.innerWidth
	: (d.documentElement && d.documentElement.clientWidth) ? d.documentElement.clientWidth
	: d.body.clientWidth;
	this.h = 
	  (window.innerHeight) ? window.innerHeight
	: (d.documentElement && d.documentElement.clientHeight) ? d.documentElement.clientHeight
	: d.body.clientHeight;
	return this;
};
function PageSize()
{ // page size object
	this.win = new WindowSize();
	this.w = 0;
	this.h = 0;
	return this.update();
}
PageSize.prototype.update = function()
{
	var d = document;
	this.w = 
	  (window.innerWidth && window.scrollMaxX) ? window.innerWidth + window.scrollMaxX
	: (d.body.scrollWidth > d.body.offsetWidth) ? d.body.scrollWidth
	: d.body.offsetWidt;
	this.h = 
	  (window.innerHeight && window.scrollMaxY) ? window.innerHeight + window.scrollMaxY
	: (d.body.scrollHeight > d.body.offsetHeight) ? d.body.scrollHeight
	: d.body.offsetHeight;
	this.win.update();
	if (this.w < this.win.w) this.w = this.win.w;
	if (this.h < this.win.h) this.h = this.win.h;
	return this;
};
function PagePos()
{ // page position object
	this.x = 0;
	this.y = 0;
	return this.update();
}
PagePos.prototype.update = function()
{
	var d = document;
	this.x =
	  (window.pageXOffset) ? window.pageXOffset
	: (d.documentElement && d.documentElement.scrollLeft) ? d.documentElement.scrollLeft
	: (d.body) ? d.body.scrollLeft
	: 0;
	this.y =
	  (window.pageYOffset) ? window.pageYOffset
	: (d.documentElement && d.documentElement.scrollTop) ? d.documentElement.scrollTop
	: (d.body) ? d.body.scrollTop
	: 0;
	return this;
};
function LightBox(option)
{
	var self = this;
	self._imgs = new Array();
	self._sets = new Array();
	self._wrap = null;
	self._box  = null;
	self._img  = null;
	self._open = -1;
	self._page = new PageSize();
	self._pos  = new PagePos();
	self._zoomimg = null;
	self._expandable = false;
	self._expanded = false;
	self._funcs = {'move':null,'up':null,'drag':null,'wheel':null,'dbl':null};
	self._level = 1;
	self._curpos = {x:0,y:0};
	self._imgpos = {x:0,y:0};
	self._minpos = {x:0,y:0};
	self._expand = option.expandimg;
	self._shrink = option.shrinkimg;
	self._resizable = option.resizable;
	self._timer = null;
	self._indicator = null;
	self._overall = null;
	self._openedset = null;
	self._prev = null;
	self._next = null;
	self._hiding = [];
	self._first = false;
	return self._init(option);
}
LightBox.prototype = {
	_init : function(option)
	{
		var self = this;
		var d = document;
		if (!d.getElementsByTagName) return;
		if (Browser.isMacIE) return self;
		var links = d.getElementsByTagName("a");
		for (var i=0;i<links.length;i++)
		{
			var anchor = links[i];
			var num = self._imgs.length;
			var rel = String(anchor.getAttribute("rel")).toLowerCase();
			if (!anchor.getAttribute("href") || !rel.match('lightbox')) continue;
			// initialize item
			self._imgs[num] = {
				src:anchor.getAttribute("href"),
				w:-1,
				h:-1,
				title:'',
				cls:anchor.className,
				set:rel
			};
			if (anchor.getAttribute("title"))
				self._imgs[num].title = anchor.getAttribute("title");
			else if ( anchor.firstChild 
			       && anchor.firstChild.getAttribute 
			       && anchor.firstChild.getAttribute("title"))
				self._imgs[num].title = anchor.firstChild.getAttribute("title");
			anchor.onclick = self._genOpener(num); // set closure to onclick event
			if (rel != 'lightbox')
			{
				if (!self._sets[rel]) self._sets[rel] = new Array();
				self._sets[rel].push(num);
			}
		}
		var body = d.getElementsByTagName("body")[0];
		self._wrap = self._createWrapOn(body,option.loadingimg);
		self._box  = self._createBoxOn(body,option);
		self._img  = self._box.firstChild;
		self._zoomimg = d.getElementById('actionImage');
		return self;
	},
	_genOpener : function(num)
	{
		var self = this;
		return function() { self._show(num); return false; }
	},
	_createWrapOn : function(obj,imagePath)
	{
		var self = this;
		if (!obj) return null;
		// create wrapper object, translucent background
		var wrap = document.createElement('div');
		obj.appendChild(wrap);
		wrap.id = 'overlay';
		wrap.style.display = 'none';
		wrap.style.position = 'fixed';
		wrap.style.top = '0px';
		wrap.style.left = '0px';
		wrap.style.zIndex = '50';
		wrap.style.width = '100%';
		wrap.style.height = '100%';
		if (Browser.isWinIE) wrap.style.position = 'absolute';
		Event.register(wrap,"click",function(evt) { self._close(evt); });
		// create loading image, animated image
		var imag = new Image;
		imag.onload = function() {
			var spin = document.createElement('img');
			wrap.appendChild(spin);
			spin.id = 'loadingImage';
			spin.src = imag.src;
			spin.style.position = 'relative';
			self._set_cursor(spin);
			Event.register(spin,'click',function(evt) { self._close(evt); });
			imag.onload = function(){};
		};
		if (imagePath != '') imag.src = imagePath;
		return wrap;
	},
	_createBoxOn : function(obj,option)
	{
		var self = this;
		if (!obj) return null;
		// create lightbox object, frame rectangle
		var box = document.createElement('div');
		obj.appendChild(box);
		box.id = 'lightbox';
		box.style.display = 'none';
		box.style.position = 'absolute';
		box.style.zIndex = '60';
		// create image object to display a target image
		var img = document.createElement('img');
		box.appendChild(img);
		img.id = 'lightboxImage';
		self._set_cursor(img);
		Event.register(img,'mouseover',function() { self._show_action(); });
		Event.register(img,'mouseout',function() { self._hide_action(); });
		Event.register(img,'click',function(evt) { self._close(evt); });
		// create hover navi - prev
		if (option.previmg)
		{
			var prevLink = document.createElement('img');
			box.appendChild(prevLink);
			prevLink.id = 'prevLink';
			prevLink.style.display = 'none';
			prevLink.style.position = 'absolute';
			prevLink.style.left = '9px';
			prevLink.style.zIndex = '70';
			prevLink.src = option.previmg;
			self._prev = prevLink;
			Event.register(prevLink,'mouseover',function() { self._show_action(); });
			Event.register(prevLink,'click',function() { self._show_next(-1); });
		}
		// create hover navi - next
		if (option.nextimg)
		{
			var nextLink = document.createElement('img');
			box.appendChild(nextLink);
			nextLink.id = 'nextLink';
			nextLink.style.display = 'none';
			nextLink.style.position = 'absolute';
			nextLink.style.right = '9px';
			nextLink.style.zIndex = '70';
			nextLink.src = option.nextimg;
			self._next = nextLink;
			Event.register(nextLink,'mouseover',function() { self._show_action(); });
			Event.register(nextLink,'click',function() { self._show_next(+1); });
		}
		// create zoom indicator
		var zoom = document.createElement('img');
		box.appendChild(zoom);
		zoom.id = 'actionImage';
		zoom.style.display = 'none';
		zoom.style.position = 'absolute';
		zoom.style.top = '15px';
		zoom.style.left = '15px';
		zoom.style.zIndex = '70';
		self._set_cursor(zoom);
		zoom.src = self._expand;
		Event.register(zoom,'mouseover',function() { self._show_action(); });
		Event.register(zoom,'click', function() { self._zoom(); });
		Event.register(window,'resize',function() { self._set_size(true); });
		// create close button
		if (option.closeimg)
		{
			var btn = document.createElement('img');
			box.appendChild(btn);
			btn.id = 'closeButton';
			btn.style.display = 'inline';
			btn.style.position = 'absolute';
			btn.style.right = '9px';
			btn.style.top = '10px';
			btn.style.zIndex = '80';
			btn.src = option.closeimg;
			self._set_cursor(btn);
			Event.register(btn,'click',function(evt) { self._close(evt); });
		}
		// caption text
		var caption = document.createElement('span');
		box.appendChild(caption);
		caption.id = 'lightboxCaption';
		caption.style.display = 'none';
		caption.style.position = 'absolute';
		caption.style.zIndex = '80';
		// create effect image
		if (!option.effectpos)
			option.effectpos = {x:0,y:0};
		else
		{
			if (option.effectpos.x == '') option.effectpos.x = 0;
			if (option.effectpos.y == '') option.effectpos.y = 0;
		}
		var effect = new Image;
		effect.onload = function()
		{
			var effectImg = document.createElement('img');
			box.appendChild(effectImg);
			effectImg.id = 'effectImage';
			effectImg.src = effect.src;
			if (option.effectclass) effectImg.className = option.effectclass;
			effectImg.style.position = 'absolute';
			effectImg.style.display = 'none';
			effectImg.style.left = [option.effectpos.x,'px'].join('');;
			effectImg.style.top = [option.effectpos.y,'px'].join('');
			effectImg.style.zIndex = '90';
			self._set_cursor(effectImg);
			Event.register(effectImg,'click',function() { effectImg.style.display = 'none'; });
		};
		if (option.effectimg != '') effect.src = option.effectimg;
		if (self._resizable)
		{
			var overall = document.createElement('div');
			obj.appendChild(overall);
			overall.id = 'lightboxOverallView';
			overall.style.display = 'none';
			overall.style.position = 'absolute';
			overall.style.zIndex = '70';
			self._overall = overall;
			var indicator = document.createElement('div');
			obj.appendChild(indicator);
			indicator.id = 'lightboxIndicator';
			indicator.style.display = 'none';
			indicator.style.position = 'absolute';
			indicator.style.zIndex = '80';
			self._indicator = indicator;
		}
		return box;
	},
	_set_photo_size : function()
	{
		var self = this;
		if (self._open == -1) return;
		var targ = { w:self._page.win.w - 30, h:self._page.win.h - 30 };
		var zoom = { x:15, y:15 };
		var navi = { p:9, n:9, y:0 };
		if (!self._expanded)
		{ // shrink image with the same aspect
			var orig = { w:self._imgs[self._open].w, h:self._imgs[self._open].h };
			var ratio = 1.0;
			if ((orig.w >= targ.w || orig.h >= targ.h) && orig.h && orig.w)
				ratio = ((targ.w / orig.w) < (targ.h / orig.h)) ? targ.w / orig.w : targ.h / orig.h;
			self._img.width  = Math.floor(orig.w * ratio);
			self._img.height = Math.floor(orig.h * ratio);
			self._expandable = (ratio < 1.0) ? true : false;
			if (self._resizable) self._expandable = true;
			if (Browser.isWinIE) self._box.style.display = "block";
			self._imgpos.x = self._pos.x + (targ.w - self._img.width) / 2;
			self._imgpos.y = self._pos.y + (targ.h - self._img.height) / 2;
			navi.y = Math.floor(self._img.height / 2) - 10;
			self._show_caption(true);
			self._show_overall(false);
		}
		else
		{ // zoomed or actual sized image
			var width  = parseInt(self._imgs[self._open].w * self._level);
			var height = parseInt(self._imgs[self._open].h * self._level);
			self._minpos.x = self._pos.x + targ.w - width;
			self._minpos.y = self._pos.y + targ.h - height;
			if (width <= targ.w)
				self._imgpos.x = self._pos.x + (targ.w - width) / 2;
			else
			{
				if (self._imgpos.x > self._pos.x) self._imgpos.x = self._pos.x;
				else if (self._imgpos.x < self._minpos.x) self._imgpos.x = self._minpos.x;
				zoom.x = 15 + self._pos.x - self._imgpos.x;
				navi.p = self._pos.x - self._imgpos.x - 5;
				navi.n = width - self._page.win.w + self._imgpos.x + 25;
				if (Browser.isWinIE) navi.n -= 10;
			}
			if (height <= targ.h)
			{
				self._imgpos.y = self._pos.y + (targ.h - height) / 2;
				navi.y = Math.floor(self._img.height / 2) - 10;
			}
			else
			{
				if (self._imgpos.y > self._pos.y) self._imgpos.y = self._pos.y;
				else if (self._imgpos.y < self._minpos.y) self._imgpos.y = self._minpos.y;
				zoom.y = 15 + self._pos.y - self._imgpos.y;
				navi.y = Math.floor(targ.h / 2) - 10 + self._pos.y - self._imgpos.y;
			}
			self._img.width  = width;
			self._img.height = height;
			self._show_caption(false);
			self._show_overall(true);
		}
		self._box.style.left = [self._imgpos.x,'px'].join('');
		self._box.style.top  = [self._imgpos.y,'px'].join('');
		self._zoomimg.style.left = [zoom.x,'px'].join('');
		self._zoomimg.style.top  = [zoom.y,'px'].join('');
		self._wrap.style.left = self._pos.x;
		if (self._prev && self._next)
		{
			self._prev.style.left  = [navi.p,'px'].join('');
			self._next.style.right = [navi.n,'px'].join('');
			self._prev.style.top = self._next.style.top = [navi.y,'px'].join('');
		}
	},
	_show_overall : function(visible)
	{
		var self = this;
		if (self._overall == null) return;
		if (visible)
		{
			if (self._open == -1) return;
			var base = 100;
			var outer = { w:0, h:0, x:0, y:0 };
			var inner = { w:0, h:0, x:0, y:0 };
			var orig = { w:self._img.width , h:self._img.height };
			var targ = { w:self._page.win.w - 30, h:self._page.win.h - 30 };
			var max = orig.w;
			if (max < orig.h) max = orig.h;
			if (max < targ.w) max = targ.w;
			if (max < targ.h) max = targ.h;
			if (max < 1) return;
			outer.w = parseInt(orig.w / max * base);
			outer.h = parseInt(orig.h / max * base);
			inner.w = parseInt(targ.w / max * base);
			inner.h = parseInt(targ.h / max * base);
			outer.x = self._pos.x + targ.w - base - 20;
			outer.y = self._pos.y + targ.h - base - 20;
			inner.x = outer.x - parseInt((self._imgpos.x - self._pos.x) / max * base);
			inner.y = outer.y - parseInt((self._imgpos.y - self._pos.y) / max * base);
			self._overall.style.left = [outer.x,'px'].join('');
			self._overall.style.top  = [outer.y,'px'].join('');
			self._overall.style.width  = [outer.w,'px'].join('');
			self._overall.style.height = [outer.h,'px'].join('');
			self._indicator.style.left = [inner.x,'px'].join('');
			self._indicator.style.top  = [inner.y,'px'].join('');
			self._indicator.style.width  = [inner.w,'px'].join('');
			self._indicator.style.height = [inner.h,'px'].join('');
			self._overall.style.display = 'block'
			self._indicator.style.display = 'block';
		}
		else
		{
			self._overall.style.display = 'none';
			self._indicator.style.display = 'none';
		}
	},
	_set_size : function(onResize)
	{
		var self = this;
		if (self._open == -1) return;
		self._page.update();
		self._pos.update();
		var spin = self._wrap.firstChild;
		if (spin)
		{
			var top = (self._page.win.h - spin.height) / 2;
			if (self._wrap.style.position == 'absolute') top += self._pos.y;
			spin.style.top  = [top,'px'].join('');
			spin.style.left = [(self._page.win.w - spin.width - 30) / 2,'px'].join('');
		}
		if (Browser.isWinIE)
		{
			self._wrap.style.width  = [self._page.win.w,'px'].join('');
			self._wrap.style.height = [self._page.win.h,'px'].join('');
			self._wrap.style.top = [self._pos.y,'px'].join('');
		}
		if (onResize) self._set_photo_size();
	},
	_set_cursor : function(obj)
	{
		var self = this;
		if (Browser.isWinIE && !Browser.isNewIE) return;
		obj.style.cursor = 'pointer';
	},
	_current_setindex : function()
	{
		var self = this;
		if (!self._openedset) return -1;
		var list = self._sets[self._openedset];
		for (var i=0,n=list.length;i<n;i++)
		{
			if (list[i] == self._open) return i;
		}
		return -1;
	},
	_get_setlength : function()
	{
		var self = this;
		if (!self._openedset) return -1;
		return self._sets[self._openedset].length;
	},
	_show_action : function()
	{
		var self = this;
		if (self._open == -1 || !self._expandable) return;
		if (!self._zoomimg) return;
		self._zoomimg.src = (self._expanded) ? self._shrink : self._expand;
		self._zoomimg.style.display = 'inline';
		var check = self._current_setindex();
		if (check > -1)
		{
			if (check > 0) self._prev.style.display = 'inline';
			if (check < self._get_setlength() - 1) self._next.style.display = 'inline';
		}
	},
	_hide_action : function()
	{
		var self = this;
		if (self._zoomimg) self._zoomimg.style.display = 'none';
		if (self._open > -1 && self._expanded) self._dragstop(null);
		if (self._prev) self._prev.style.display = 'none';
		if (self._next) self._next.style.display = 'none';
	},
	_zoom : function()
	{
		var self = this;
		var closeBtn = document.getElementById('closeButton');
		if (self._expanded)
		{
			self._reset_func();
			self._expanded = false;
			if (closeBtn) closeBtn.style.display = 'inline';
		}
		else if (self._open > -1)
		{
			self._level = 1;
			self._imgpos.x = self._pos.x;
			self._imgpos.y = self._pos.y;
			self._expanded = true;
			self._funcs.drag  = function(evt) { self._dragstart(evt) };
			self._funcs.dbl   = function(evt) { self._close(null) };
			if (self._resizable)
			{
				self._funcs.wheel = function(evt) { self._onwheel(evt) };
				Event.register(self._box,'mousewheel',self._funcs.wheel);
			}
			Event.register(self._img,'mousedown',self._funcs.drag);
			Event.register(self._img,'dblclick',self._funcs.dbl);
			if (closeBtn) closeBtn.style.display = 'none';
		}
		self._set_photo_size();
		self._show_action();
	},
	_reset_func : function()
	{
		var self = this;
		if (self._funcs.wheel != null) Event.deregister(self._box,'mousewheel',self._funcs.wheel);
		if (self._funcs.move  != null) Event.deregister(self._img,'mousemove',self._funcs.move);
		if (self._funcs.up    != null) Event.deregister(self._img,'mouseup',self._funcs.up);
		if (self._funcs.drag  != null) Event.deregister(self._img,'mousedown',self._funcs.drag);
		if (self._funcs.dbl   != null) Event.deregister(self._img,'dblclick',self._funcs.dbl);
		self._funcs = {'move':null,'up':null,'drag':null,'wheel':null,'dbl':null};
	},
	_onwheel : function(evt)
	{
		var self = this;
		var delta = 0;
		evt = Event.getEvent(evt);
		if (evt.wheelDelta)  delta = event.wheelDelta/-120;
		else if (evt.detail) delta = evt.detail/3;
		if (Browser.isOpera) delta = - delta;
		var step =
			  (self._level < 1) ? 0.1
			: (self._level < 2) ? 0.25
			: (self._level < 4) ? 0.5
			: 1;
		self._level = (delta > 0) ? self._level + step : self._level - step;
		if (self._level > 8) self._level = 8;
		else if (self._level < 0.5) self._level = 0.5;
		self._set_photo_size();
		return Event.stop(evt);
	},
	_dragstart : function(evt)
	{
		var self = this;
		evt = Event.getEvent(evt);
		self._curpos.x = evt.screenX;
		self._curpos.y = evt.screenY;
		self._funcs.move = function(evnt) { self._dragging(evnt); };
		self._funcs.up   = function(evnt) { self._dragstop(evnt); };
		Event.register(self._img,'mousemove',self._funcs.move);
		Event.register(self._img,'mouseup',self._funcs.up);
		return Event.stop(evt);
	},
	_dragging : function(evt)
	{
		var self = this;
		evt = Event.getEvent(evt);
		self._imgpos.x += evt.screenX - self._curpos.x;
		self._imgpos.y += evt.screenY - self._curpos.y;
		self._curpos.x = evt.screenX;
		self._curpos.y = evt.screenY;
		self._set_photo_size();
		return Event.stop(evt);
	},
	_dragstop : function(evt)
	{
		var self = this;
		evt = Event.getEvent(evt);
		if (self._funcs.move  != null) Event.deregister(self._img,'mousemove',self._funcs.move);
		if (self._funcs.up    != null) Event.deregister(self._img,'mouseup',self._funcs.up);
		self._funcs.move = null;
		self._funcs.up   = null;
		self._set_photo_size();
		return (evt) ? Event.stop(evt) : false;
	},
	_show_caption : function(enable)
	{
		var self = this;
		var caption = document.getElementById('lightboxCaption');
		if (!caption) return;
		if (caption.innerHTML.length == 0 || !enable)
		{
			caption.style.display = 'none';
		}
		else
		{ // now display caption
			caption.style.top = [self._img.height + 10,'px'].join(''); // 10 is top margin of lightbox
			caption.style.left = '0px';
			caption.style.width = [self._img.width + 20,'px'].join(''); // 20 is total side margin of lightbox
			caption.style.display = 'block';
		}
	},
	_toggle_wrap : function(flag)
	{
		var self = this;
		self._wrap.style.display = flag ? "block" : "none";
		if (self._hiding.length == 0 && !self._first)
		{ // some objects may overlap on overlay, so we hide them temporarily.
			var tags = ['select','embed','object'];
			for (var i=0,n=tags.length;i<n;i++)
			{
				var elem = document.getElementsByTagName(tags[i]);
				for (var j=0,m=elem.length;j<m;j++)
				{ // check the original value at first. when alredy hidden, dont touch them
					var check = elem[j].style.visibility;
					if (!check)
					{
						if (elem[j].currentStyle)
							check = elem[j].currentStyle['visibility'];
						else if (document.defaultView)
							check = document.defaultView.getComputedStyle(elem[j],'').getPropertyValue('visibility');
					}
					if (check == 'hidden') continue;
					self._hiding.push(elem[j]);
				}
			}
			self._first = true;
		}
		for (var i=0,n=self._hiding.length;i<n;i++)
			self._hiding[i].style.visibility = flag ? "hidden" : "visible";
	},
	_show : function(num)
	{
		var self = this;
		var imag = new Image;
		if (num < 0 || num >= self._imgs.length) return;
		var loading = document.getElementById('loadingImage');
		var caption = document.getElementById('lightboxCaption');
		var effect = document.getElementById('effectImage');
		self._open = num; // set opened image number
		self._set_size(false); // calc and set wrapper size
		self._toggle_wrap(true);
		if (loading) loading.style.display = 'inline';
		imag.onload = function() {
			if (self._imgs[self._open].w == -1)
			{ // store original image width and height
				self._imgs[self._open].w = imag.width;
				self._imgs[self._open].h = imag.height;
			}
			if (effect)
			{
				effect.style.display = (!effect.className || self._imgs[self._open].cls == effect.className)
					? 'block' : 'none';
			}
			if (caption)
				try { caption.innerHTML = self._imgs[self._open].title; } catch(e) {}
			self._set_photo_size(); // calc and set lightbox size
			self._hide_action();
			self._box.style.display = "block";
			self._img.src = imag.src;
			self._img.setAttribute('title',self._imgs[self._open].title);
			self._timer = window.setInterval( function() { self._set_size(true) } , 100);
			if (loading) loading.style.display = 'none';
			if (self._imgs[self._open].set != 'lightbox')
			{
				var set = self._imgs[self._open].set;
				if (self._sets[set].length > 1) self._openedset = set;
				if (!self._prev || !self._next) self._openedset = null;
			}
		};
		self._expandable = false;
		self._expanded = false;
		imag.src = self._imgs[self._open].src;
	},
	_close_box : function()
	{
		var self = this;
		self._open = -1;
		self._openedset = null;
		self._hide_action();
		self._hide_action();
		self._reset_func();
		self._show_overall(false);
		self._box.style.display  = "none";
		if (self._timer != null)
		{
 			window.clearInterval(self._timer);
 			self._timer = null;
		}
	},
	_show_next : function(direction)
	{
		var self = this;
		if (!self._openedset) return self._close(null);
		var index = self._current_setindex() + direction;
		var targ = self._sets[self._openedset][index];
		self._close_box();
		self._show(targ);
	},
	_close : function(evt)
	{
		var self = this;
		if (evt != null)
		{
			evt = Event.getEvent(evt);
			var targ = evt.target || evt.srcElement;
			if (targ && targ.getAttribute('id') == 'lightboxImage' && self._expanded) return;
		}
		self._close_box();
		self._toggle_wrap(false);
	}
};
Event.register(window,"load",function() {
	var lightbox = new LightBox({
		loadingimg:'loading.gif',
		expandimg:'expand.gif',
		shrinkimg:'shrink.gif',
		previmg:'prev.gif',
		nextimg:'next.gif',
		effectimg:'zzoop.gif',
		effectpos:{x:-40,y:-20},
		effectclass:'effectable',
		closeimg:'close.gif',
		resizable:true
	});
});

//////
function addEvent(element, eventType, lamdaFunction, useCapture) {
    if (element.addEventListener) {
        element.addEventListener(eventType, lamdaFunction, useCapture);
        return true;
    } else if (element.attachEvent) {
        var r = element.attachEvent('on' + eventType, lamdaFunction);
        return r;
    } else {
        return false;
    }
}

/* 
 * Kills an event's propagation and default action
 */
function knackerEvent(eventObject) {
    if (eventObject && eventObject.stopPropagation) {
        eventObject.stopPropagation();
    }
    if (window.event && window.event.cancelBubble ) {
        window.event.cancelBubble = true;
    }
    
    if (eventObject && eventObject.preventDefault) {
        eventObject.preventDefault();
    }
    if (window.event) {
        window.event.returnValue = false;
    }
}

/* 
 * Safari doesn't support canceling events in the standard way, so we must
 * hard-code a return of false for it to work.
 */
function cancelEventSafari() {
    return false;        
}

/* 
 * Cross-browser style extraction, from the JavaScript & DHTML Cookbook
 * <http://www.oreillynet.com/pub/a/javascript/excerpt/JSDHTMLCkbk_chap5/index5.html>
 */
function getElementStyle(elementID, CssStyleProperty) {
    var element = document.getElementById(elementID);
    if (element.currentStyle) {
        return element.currentStyle[toCamelCase(CssStyleProperty)];
    } else if (window.getComputedStyle) {
        var compStyle = window.getComputedStyle(element, '');
        return compStyle.getPropertyValue(CssStyleProperty);
    } else {
        return '';
    }
}

/* 
 * CamelCases CSS property names. Useful in conjunction with 'getElementStyle()'
 * From <http://dhtmlkitchen.com/learn/js/setstyle/index4.jsp>
 */
function toCamelCase(CssProperty) {
    var stringArray = CssProperty.toLowerCase().split('-');
    if (stringArray.length == 1) {
        return stringArray[0];
    }
    var ret = (CssProperty.indexOf("-") == 0)
              ? stringArray[0].charAt(0).toUpperCase() + stringArray[0].substring(1)
              : stringArray[0];
    for (var i = 1; i < stringArray.length; i++) {
        var s = stringArray[i];
        ret += s.charAt(0).toUpperCase() + s.substring(1);
    }
    return ret;
}

/*
 * Disables all 'test' links, that point to the href '#', by Ross Shannon
 */
function disableTestLinks() {
  var pageLinks = document.getElementsByTagName('a');
  for (var i=0; i<pageLinks.length; i++) {
    if (pageLinks[i].href.match(/[^#]#$/)) {
      addEvent(pageLinks[i], 'click', knackerEvent, false);
    }
  }
}

/* 
 * Cookie functions
 */
function createCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        var expires = '; expires=' + date.toGMTString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}

function readCookie(name) {
    var cookieCrumbs = document.cookie.split(';');
    var nameToFind = name + '=';
    for (var i = 0; i < cookieCrumbs.length; i++) {
        var crumb = cookieCrumbs[i];
        while (crumb.charAt(0) == ' ') {
            crumb = crumb.substring(1, crumb.length); /* delete spaces */
        }
        if (crumb.indexOf(nameToFind) == 0) {
            return crumb.substring(nameToFind.length, crumb.length);
        }
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, '', -1);
}


/*
 * Clear Default Text: functions for clearing and replacing default text in
 * <input> elements.
 */
addEvent(window, 'load', init, false);

function init() {
    var formInputs = document.getElementsByTagName('input');
    for (var i = 0; i < formInputs.length; i++) {
        var theInput = formInputs[i];
        
        if ((theInput.type == 'text' || theInput.type == 'password' ) && theInput.className.match(/\bcleardefault\b/)) {  
            /* Add event handlers */          
            addEvent(theInput, 'focus', clearDefaultText, false);
            addEvent(theInput, 'blur', replaceDefaultText, false);
            
            /* Save the current value */
            if (theInput.value != '') {
                theInput.defaultText = theInput.value;
            }
        }
    }
}

function clearDefaultText(e) {
    var target = window.event ? window.event.srcElement : e ? e.target : null;
    if (!target) return;
    
    if (target.value == target.defaultText) {
        target.value = '';
    }
}

function replaceDefaultText(e) {
    var target = window.event ? window.event.srcElement : e ? e.target : null;
    if (!target) return;
    
    if (target.value == '' && target.defaultText) {
        target.value = target.defaultText;
    }
}


////
function getStyleObject(objectId) {
    // cross-browser function to get an object's style object given its id
    if(document.getElementById && document.getElementById(objectId)) {
	// W3C DOM
	return document.getElementById(objectId).style;
    } else if (document.all && document.all(objectId)) {
	// MSIE 4 DOM
	return document.all(objectId).style;
    } else if (document.layers && document.layers[objectId]) {
	// NN 4 DOM.. note: this won't find nested layers
	return document.layers[objectId];
    } else {
	return false;
    }
} // getStyleObject

function changeObjectVisibility(objectId, newVisibility) {
    // get a reference to the cross-browser style object and make sure the object exists
    var styleObject = getStyleObject(objectId);
    if(styleObject) {
	styleObject.visibility = newVisibility;
	return true;
    } else {
	// we couldn't find the object, so we can't change its visibility
	return false;
    }
} // changeObjectVisibility

function moveObject(objectId, newXCoordinate, newYCoordinate) {
    // get a reference to the cross-browser style object and make sure the object exists
    var styleObject = getStyleObject(objectId);
    if(styleObject) {
	styleObject.left = newXCoordinate;
	styleObject.top = newYCoordinate;
	return true;
    } else {
	// we couldn't find the object, so we can't move it
	return false;
    }
} // moveObject

function popUp(URL) {
day = new Date();
id = day.getTime();
eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=500,height=250');");
}
function popUpSm(URL) {
day = new Date();
id = day.getTime();
eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=500,height=130');");
}
function popUpL(URL) {
day = new Date();
id = day.getTime();
eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=600,height=430');");
}
function popUpLG(URL) {
day = new Date();
id = day.getTime();
eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=700,height=480');");
}

// application-specific functions *

function showMenu(menuNumber, eventObj) {
    //    alert(eventObj);
    hideAllMenus();
    var menuId = 'menu' + menuNumber;
    if(changeObjectVisibility(menuId, 'visible')) {
	var menuTitle = getStyleObject('menuTitle' + menuNumber);
	menuTitle.backgroundColor = '#ff9900';
	eventObj.cancelBubble = true;
	return true;
    } else {
	return false;
    }
}

var numMenus = 60;
var counter = 0;

function hideAllMenus() {
    for(counter = 1; counter <= numMenus; counter++) {
	changeObjectVisibility('menu' + counter, 'hidden');
	var menuTitle = getStyleObject('menuTitle' + counter);
	menuTitle.backgroundColor = '#000000';
    }
    for(counter = 1; counter <= numMenus; counter++) {
	changeObjectVisibility('blist' + counter, 'hidden');
	var menuTitle = getStyleObject('menuTitle' + counter);
	menuTitle.backgroundColor = '#000000';
    }
}

document.onclick = hideAllMenus;
////
/*
     FILE ARCHIVED ON 16:45:49 Oct 13, 2007 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 04:05:41 Jan 04, 2018.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/