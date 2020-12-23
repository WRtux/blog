"use strict";

function fetchContent(url) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send();
	if (xhr.status >= 200 && xhr.status < 300)
		return { status: xhr.status, content: xhr.responseText };
	else
		return { status: xhr.status };
}

function fetchList(url) {
	var res = fetchContent(url);
	if (res.content) {
		var doc = $.parseDOM(res);
		var eles = doc.getElementsByTagName("li"), lis = [];
		for (var i = 0; i < eles.length; i++) {
			var f = eles[i].children[0].textContent;
			if (f.slice(-3) == ".md")
				lis.push(f);
		}
		return lis;
	} else
		return res;
}

function sortList(lis) {
	return lis.sort(function (a, b) {
		var regex = /^([0-9]{8})-([0-9]+)/;
		var resa = a.match(regex), resb = b.match(regex);
		if (resa && resb) {
			var al = a[1], bl = b[1], ar = a[2], br = b[2];
			return (al - bl) || (ar - br);
		} else if (resa)
			return 1;
		else if (resb)
			return -1;
		else
			return a.localeCompare(b);
	});
}

function render(cont, md) {
	if (typeof cont == "string")
		cont = $.getElement(cont);
	marked.setOptions({ nested: false });
	return cont.innerHTML = marked(md);
}
function renderAbstract(cont, md, lns) {
	if (typeof cont == "string")
		cont = $.getElement(cont);
	if (!lns)
		lns = 3;
	var pos = 0;
	for (var i = 0; i < lns; ) {
		var j = md.indexOf('\n', pos);
		if (j == -1) {
			pos = md.length;
			break;
		} else if (md.substring(pos, j).trim() != "")
			i++;
		pos = j + 1;
	}
	marked.setOptions({ nested: true });
	return cont.innerHTML = marked(md.substring(0, pos));
}

function renderDirect(cont, url) {
	if (typeof cont == "string")
		cont = $.getElement(cont);
	var res = fetchContent(url);
	if (res.content) {
		marked.setOptions({ nested: false });
		return cont.innerHTML = marked(res.content);
	} else {
		$.removeChildren(cont);
		cont.appendChild($.createElement("h2", "Failed: " + res.status));
		return res;
	}
}

var dark;
function createDark() {
	if (dark)
		return null;
	var ele = $.createElement("style");
	var stys = $.forTagName("link")[0].sheet;
	var ruls = stys.cssRules, txtRul = "";
	for (var i = 0; i < ruls.length; i++) {
		var rul = ruls[i];
		if (rul instanceof CSSMediaRule && rul.conditionText.indexOf("dark") != -1) {
			rul = rul.cssRules;
			for (var j = 0; j < rul.length; j++)
				txtRul += rul[j].cssText;
			stys.removeRule(i--);
		}
	}
	ele.textContent = txtRul;
	ele.id = "dark";
	return ele;
}

function switchDark() {
	if (!dark || dark.id == "dark") {
		document.body.appendChild(dark || createDark());
		return dark = true;
	} else {
		dark = $.removeElement($.getElement("dark"));
		return false;
	}
}

(function () {
	marked.use({ renderer: {
		heading: function (txt, lvl) {
			if (this.options.nested)
				return "<h" + (lvl + 1) + ">" + txt + "</h" + (lvl + 1) + ">\n";
			else
				return false;
		}
	} });
	marked.setOptions({ nested: false });
})();
