import { keys, join } from "./fns";
export const attachEvt = (ele, evt, listener, capture) => {
	const target = ele || document;
	const handler = e => {
		const event = e || window.event;
		const src = event.srcElement || event.target;
		const [touch] = event.targetTouches || [];
		const proto = Object.getPrototypeOf(touch || {});
		keys(proto).forEach(k => (k in event) ||
			(event[k] = touch[k])); // touch属性赋予事件上
		listener(event, src);
	};
	if (target.addEventListener) {
		target.addEventListener(evt, handler, capture);
	} else if (target.attachEvent) {
		target.attachEvent("on" + evt, handler);
	} else {
		target["on" + evt] = handler;
	}
	return handler;
};
export const detachEvt = (ele, evt, listener, capture) => {
	const target = ele || document;
	if (target.removeEventListener) {
		target.removeEventListener(evt, listener, capture);
	} else if (target.detachEvent) {
		target.detachEvent("on" + evt, listener);
	} else {
		target["on" + evt] = undefined;
	}
};
export const stopEvt = e => {
	e.stopPropagation && e.stopPropagation();
	e.cancelBubble = true;
};
export const prevent = e => {
	e.preventDefault && e.preventDefault();
	e.returnValue = false;
};
/*
mousedown  -->  touchstart
mousemove  -->  touchmove
mouseup    -->  touchend
<-- click dblclick -->
mouseover  -->  touchstart
mouseout   -->  touchend
<-- touchcancel -->
querySelector querySelectorAll
elementFromPoint elementsFromPoint
*/
export const query = k => (s, e = document) => e[k](s);
export const q = query("querySelector");
export const qId = query("getElementById");
export const qs = query("querySelectorAll");
export const qsTag = query("getElementsByTagName");
export const qsClass = query("getElementsByClassName");
export const create = (tag, html, opts) => {
	/^[a-z]+[1-6]?$/i.test(tag) || (tag = "span");
	const element = document.createElement(tag);
	element.innerHTML = html || "";
	const { attrs, props, parent } = opts || {};
	join(element, props);
	keys(attrs || {}).forEach(
		k => element.setAttribute(k, attrs[k]));
	parent && parent.appendChild(element);
	return element;
};
export const load = (tag, attrs) =>
	new Promise((resolve, reject) => {
		const element = create(tag, null, { attrs });
		const done = () => resolve({ target: element });
		element.onload = done;
		element.onerror = reject;
		element.onreadystatechange = () => "complete,loaded"
			.indexOf(element.readyState) > -1 && done();
		document.body.appendChild(element);
		const { src, href, data, complete } = element;
		const isImg = src && /^img$/i.test(tag);
		const isCss = href && /^link$/i.test(tag);
		const isData = data && /^object$/i.test(tag);
		isImg && complete && done();
		src || isCss || isData || done();
	});
export const loadImg = src => load("img", { src });
export const loadCss = href => load("link",
	{ rel: "stylesheet", href });
export const loadJs = src => load("script",
	{ type: "text/javascript", src });
export const gcs = element => {
	const { getComputedStyle: calc } = window;
	return calc ? calc(element) : element.currentStyle;
};
export const hd = (baseFontSize, sketchWidth) => {
	baseFontSize = baseFontSize > 0 ? baseFontSize : 100;
	const { document, navigator } = window;
	const { documentElement: html, head, body } = document;
	const dpr = window.devicePixelRatio || 1;
	const ua = navigator.userAgent;
	const android = ua.match(/android/i);
	const webkit = ua.match(/applewebkit\/(\d{3})/i);
	// webkit[1]>534代表安卓4.4以上的系统
	const isNew = android && webkit && webkit[1] > 534;
	const uchd = ua.match(/u3\/([.\d]{5,})/i);
	const isUCHD = uchd && uchd[1].split(".") > [0, 8, 0];
	const ios = ua.match(/(iphone|ipad|ipod)/i);
	const scale = ios || isNew || isUCHD ? 1 / dpr : 1;
	let rate = 1;
	if (isNew || isUCHD) {
		html.style.fontSize = baseFontSize + "px";
		const div = create("div", null, { parent: body });
		div.style.width = "1rem";
		rate = baseFontSize / parseFloat(gcs(div).width);
		div.remove();
	} // 清除当前meta配置
	[...qs("meta[name=viewport]")].forEach(d => d.remove());
	let content = "width=device-width,";
	if (isNew && !uchd) { // UC内核不能设置target-densitydpi
		content += "target-densitydpi=device-dpi,";
	} // 安卓4.4以上webview支持dpi和scale,但不会同时支持,都写上
	const hd = `-scale=${(scale * rate).toFixed(3)},`;
	content += `initial${hd}maximum${hd}minimum${hd}`;
	content += "user-scalable=no,viewport-fit=cover";
	const attrs = { name: "viewport", content };
	create("meta", null, { attrs, parent: head });
	const resize = window.requestAnimationFrame(() => {
		const zoom = rate * (sketchWidth > 0
			? html.clientWidth / sketchWidth : 1);
		html.style.fontSize = (baseFontSize * zoom) + "px";
	}); // 移动端组件大多不支持rem,需要自己写组件
	return [resize(), attachEvt(window, "resize", resize)];
};
export const dmt = cls => {
	const list = cls && cls.forEach ? cls
		: String(cls || "").split(/\s+/);
	const hash = {}; // [...new Set(items)]
	list.forEach(k => k && (hash[k] = true));
	return keys(hash);
};
export const hasCls = (element, cls) => {
	const list = dmt(element.className);
	const has = dmt(cls);
	const result = has.filter(v => !list.includes(v));
	return !result.length;
};
export const addCls = (element, cls) => {
	const list = dmt(element.className);
	const add = dmt(cls);
	const result = list.concat(add);
	element.className = dmt(result).join(" ");
};
export const delCls = (element, cls) => {
	const list = dmt(element.className);
	const del = dmt(cls);
	const result = list.filter(v => !del.includes(v));
	element.className = dmt(result).join(" ");
};
export const ready = f => new Promise(resolve => attachEvt(
	document, "DOMContentLoaded", resolve, false)).then(f);
export const clientInfo = () => {
	const { documentElement: html, head, body } = document;
	const { clientWidth: vw, clientHeight: vh } = html;
	const { FastClick: fc, devicePixelRatio: dpr,
		navigator: { userAgent: ua } } = window;
	return { html, head, body, vw, vh, fc, dpr, ua };
};
export const scrollInfo = () => {
	const { documentElement: html, head, body,
		scrollingElement: element } = document;
	const wrap = html.scrollHeight > body.scrollHeight ||
		html.scrollWidth > body.scrollWidth ? html : body;
	return { html, head, body, scroll: element || wrap };
}; // scrollingElement标准模式是html,挂怪异模式是body
export const scrollLock = (cls = "fixed-scroll-lock") => {
	const db = { top: null, left: null, ele: null };
	const isLock = () => db.ele && hasCls(db.ele, cls);
	const openLock = () => {
		if (!isLock()) {
			db.ele = scrollInfo().scroll;
			db.top = db.ele.scrollTop || 0;
			db.left = db.ele.scrollLeft || 0;
			addCls(db.ele, cls);
			db.ele.style.top = -db.top + "px";
			db.ele.style.left = -db.left + "px";
		}
	};
	const closeLock = () => {
		if (isLock()) {
			delCls(db.ele, cls);
			db.ele.style.top = "";
			db.ele.style.left = "";
			db.ele.scrollTop = db.top;
			db.ele.scrollLeft = db.left;
		}
	};
	return { isLock, openLock, closeLock };
};