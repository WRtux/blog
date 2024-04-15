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
		var doc = parseDOM(res.content);
		var eles = doc.queryTagName("li"), lis = [];
		for (var i = 0; i < eles.length; i++) {
			var f = eles[i].firstElementChild.textContent;
			if (f.slice(-3) == ".md")
				lis.push(f);
		}
		return { status: res.status, list: lis };
	} else
		return res;
}

async function fetchText(url) {
	let resp = await fetch(url, {method: 'GET'});
	if (!resp.ok)
		throw new Error(`Request responded with status ${resp.status}`);
	return await resp.text();
}

async function fetchArticleList(url) {
	let resp = await fetch(url, {method: 'GET'});
	if (!resp.ok)
		throw new Error(`Article list responded with status ${resp.status}`);
	let doc = new DOMParser().parseFromString(await resp.text(), "text/xml");
	let cont = doc.getElementsByTagName('article-list')[0];
	if (cont == null)
		throw new Error('No article lists found.');
	let li = new Array();
	for (let el of cont.getElementsByTagName('article')) {
		let en = {
			fileName: el.getAttribute('file'),
			archive: el.getElementsByTagName('archive')[0]?.textContent,
			category: el.getElementsByTagName('category')[0]?.textContent,
			keywords: Array.from(el.getElementsByTagName('keyword')).map((el) => el.textContent)
		};
		li.push(en);
	}
	return li;
}

function sortList(lis) {
	return lis;
}

function render(cont, md) {
	cont = document.getElement(cont);
	marked.setOptions({ nested: false });
	return cont.innerHTML = marked(md);
}
function renderAbstract(cont, md, lns) {
	cont = document.getElement(cont);
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
	cont = document.getElement(cont);
	var res = fetchContent(url);
	if (res.content) {
		marked.setOptions({ nested: false });
		return cont.innerHTML = marked(res.content);
	} else {
		cont.removeChildren();
		cont.appendChild(document.buildElement("h2", "Failed: " + res.status));
		return null;
	}
}

function buildArticle(md, opt = {}) {
	let tmpl = document.createElement('template');
	marked.setOptions({nested: false});
	tmpl.innerHTML = marked(md);
	let frg = tmpl.content;
	if (opt.abstract == true) {
		while (frg.childElementCount > 4) {
			frg.lastChild.remove();
		}
	}
	return frg;
}

function buildFailure(err) {
	let frg = document.createDocumentFragment();
	frg.appendChild(document.buildElement('h2', 'Failed to render article'));
	frg.appendChild(document.buildElement('span', err?.toString() ?? 'Unknown error.'));
	return frg;
}

async function renderURL(cont, url, opt = {}) {
	cont = document.getElement(cont);
	let art;
	try {
		let md = await fetchText(url);
		art = buildArticle(md, opt);
	} catch (err) {
		art = buildFailure(err);
	}
	cont.removeChildren();
	cont.appendChild(art);
}

var dark;
function createDark() {
	if (dark)
		return null;
	var ele = document.createElement("style");
	var stys = document.queryTagName("link")[0].sheet;
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
	if (!dark || dark instanceof HTMLStyleElement) {
		document.head.appendChild(dark || createDark());
		return dark = true;
	} else {
		dark = document.removeElement("dark");
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
