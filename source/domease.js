"use strict";

(function () {
	var proto = Document.prototype;
	
	proto.queryId = proto.getElement = function (id) {
		return this.getElementById(id);
	};
	
	HTMLDocument.prototype.getStyle = function (ele) {
		if (typeof ele == "string")
			return this.getElement(ele).style;
		else if (ele instanceof HTMLElement)
			return ele.style;
		else
			throw new TypeError();
	};
	
	proto.getInner = function (ele) {
		if (typeof ele == "string")
			return this.getElement(ele).innerHTML;
		else if (ele instanceof Element)
			return ele.innerHTML;
		else
			throw new TypeError();
	};
	
	proto.queryTagName = function (n) {
		return this.getElementsByTagName(n);
	};
	
	proto.queryClassName = function (n) {
		return this.getElementsByClassName(n);
	};
	
	var classPattern = /(?:^|\s)class(?=$|\s+)/g.source;
	var getClassExp = function (cls) {
		return new RegExp(classPattern.replace("class", cls), "g");
	};
	
	proto.testClass = function (ele, cls) {
		if (typeof ele == "string")
			ele = this.getElement(ele);
		return ele.className.search(getClassExp(cls)) != -1;
	};
	
	proto.setClass = function (ele, cls) {
		if (typeof ele == "string")
			ele = this.getElement(ele);
		if (!this.testClass(ele, cls)) {
			ele.className += " " + cls;
			return true;
		} else
			return false;
	};
	
	proto.removeClass = function (ele, cls) {
		if (typeof ele == "string")
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
		if (typeof ele == "string")
			ele = this.getElement(ele);
		return ele.parentNode.removeChild(ele);
	};
	
	proto.removeChildren = function (ele) {
		if (typeof ele == "string")
			ele = this.getElement(ele);
		var len = ele.childNodes.length;
		while (ele.hasChildNodes())
			ele.removeChild(ele.lastChild);
		return len;
	};
	
	var eleproto = Element.prototype;
	eleproto.queryTagName = proto.queryTagName;
	eleproto.queryClassName = proto.queryClassName;
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
