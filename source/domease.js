"use strict";

(function () {
	var proto = Document.prototype;
	
	proto.getElement = function (ele) {
		if (typeof ele == "string")
			return this.getElementById(ele);
		else if (ele instanceof Element)
			return ele;
		else if (typeof ele == "undefined")
			return this.firstElementChild;
		else
			throw new TypeError();
	};
	
	HTMLDocument.prototype.getStyle = function (ele) {
		return this.getElement(ele).style;
	};
	
	proto.getInner = function (ele) {
		return this.getElement(ele).innerHTML;
	};
	
	proto.queryId = proto.getElementById;
	
	proto.queryTagName = proto.getElementsByTagName;
	
	proto.queryClassName = proto.getElementsByClassName;
	
	var classPattern = /(?:^|\s)class(?=$|\s+)/g.source;
	var getClassExp = function (cls) {
		return new RegExp(classPattern.replace("class", cls), "g");
	};
	
	proto.testClass = function (ele, cls) {
		ele = this.getElement(ele);
		return ele.className.search(getClassExp(cls)) != -1;
	};
	
	proto.setClass = function (ele, cls) {
		ele = this.getElement(ele);
		if (!this.testClass(ele, cls)) {
			ele.className += " " + cls;
			return true;
		} else
			return false;
	};
	
	proto.removeClass = function (ele, cls) {
		ele = this.getElement(ele);
		var regex = getClassExp(cls);
		if (ele.className.search(regex) != -1) {
			ele.className = ele.className.replace(regex, "");
			return true;
		} else
			return false;
	};
	
	proto.buildElement = function (n, con) {
		var ele = this.createElement(n);
		if (typeof con == "undefined");
		else if (typeof con == "string")
			ele.textContent = con;
		else if (con instanceof Node)
			ele.appendChild(con);
		else if (con instanceof Array || con instanceof HTMLCollection || con instanceof NodeList) {
			for (var i = 0; i < con.length; i++)
				ele.appendChild(con[i]);
		} else
			throw new TypeError();
		return ele;
	};
	
	proto.removeElement = function (ele) {
		ele = this.getElement(ele);
		return ele.parentNode.removeChild(ele);
	};
	
	proto.removeChildren = function (ele) {
		ele = this.getElement(ele);
		var len = ele.childNodes.length;
		while (ele.hasChildNodes())
			ele.removeChild(ele.lastChild);
		return len;
	};
	
	var eleproto = Element.prototype;
	eleproto.getElement = function () { return this; };
	eleproto.queryTagName = eleproto.getElementsByTagName;
	eleproto.queryClassName = eleproto.getElementsByClassName;
	eleproto.testClass = function (cls) {
		return proto.testClass(this, cls);
	};
	eleproto.setClass = function (cls) {
		return proto.setClass(this, cls);
	};
	eleproto.removeClass = function (cls) {
		return proto.removeClass(this, cls);
	};
	eleproto.remove = function () {
		return proto.removeElement(this);
	};
	eleproto.removeChildren = function () {
		return proto.removeChildren(this);
	};
	
	window.parseDOM = function (str) {
		return new DOMParser().parseFromString(str, "text/xml");
	};
	
})();
