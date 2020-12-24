"use strict";

var $ = {
	
	getElement: function (id) {
		return document.getElementById(id);
	},
	
	getStyle: function (ele) {
		if (typeof ele == "string")
			return this.getElement(ele).style;
		else if (ele instanceof HTMLElement)
			return ele.style;
		else
			throw new TypeError();
	},
	
	forTagName: function (n) {
		return document.getElementsByTagName(n);
	},
	
	forClassName: function (n) {
		return document.getElementsByClassName(n);
	},
	
	classPattern: /(?<=^|\s)class(?:$|\s+)/g.source,
	getClassExp: function (cls) {
		return new RegExp(this.classPattern.replace("class", cls.trim()), "g");
	},
	
	testClass: function (ele, cls) {
		if (typeof ele == "string")
			ele = this.getElement(ele);
		return ele.className.search(this.getClassExp(cls)) != -1;
	},
	
	setClass: function (ele, cls) {
		if (typeof ele == "string")
			ele = this.getElement(ele);
		if (!this.testClass(ele, cls)) {
			ele.className += " " + cls.trim();
			return true;
		} else
			return false;
	},
	
	removeClass: function (ele, cls) {
		var regex = this.getClassExp(cls);
		if (typeof ele == "string")
			ele = this.getElement(ele);
		if (ele.className.search(regex) != -1) {
			ele.className = ele.className.replace(regex, "");
			return true;
		} else
			return false;
	},
	
	createElement: function (n, con) {
		var ele = document.createElement(n);
		if (typeof con == "undefined");
		else if (typeof con == "string")
			ele.textContent = con;
		else if (con instanceof Node)
			ele.appendChild(con);
		else if (con instanceof HTMLCollection || con instanceof NodeList) {
			for (var i = 0; i < con.length; i++)
				ele.appendChild(con[i]);
		} else
			throw new TypeError();
		return ele;
	},
	
	removeElement: function (ele) {
		if (typeof ele == "string")
			ele = this.getElement(ele);
		return ele.parentNode.removeChild(ele);
	},
	
	removeChildren: function (ele) {
		if (typeof ele == "string")
			ele = this.getElement(ele);
		if (ele.hasChildNodes()) {
			while (ele.hasChildNodes())
				ele.removeChild(ele.lastChild);
			return true;
		} else
			return false;
	},
	
	parseDOM: function (str) {
		return new DOMParser().parseFromString(str, "text/xml");
	}
	
};
