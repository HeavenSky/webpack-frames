export const attachEvt = (ele, evt, listener, capture) => {
	const target = ele || document;
	const handler = e => {
		const event = e || window.event;
		const src = event.srcElement || event.target;
		const [touch] = event.targetTouches || [];
		const proto = Object.getPrototypeOf(touch || {});
		Object.keys(proto).forEach(k => (k in event) ||
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
export const create = (tag, html, opts) => {
	/^[a-z]+[1-6]?$/i.test(tag) || (tag = "span");
	const element = document.createElement(tag);
	const { attrs, props, parent } = opts || {};
	element.innerHTML = html || "";
	Object.keys(props || {}).forEach(
		k => (element[k] = props[k]));
	Object.keys(attrs || {}).forEach(
		k => element.setAttribute(k, attrs[k]));
	parent && parent.appendChild(element);
	return element;
};
export const load = (tag, attrs) =>
	new Promise((resolve, reject) => {
		const element = create(tag, null, { attrs });
		document.body.appendChild(element);
		const done = () => resolve({ target: element });
		element.onload = done;
		element.onerror = reject;
		element.onreadystatechange = () => {
			const { readyState: s } = element;
			["complete", "loaded"].includes(s) && done();
		};
		const { src, href, complete } = element;
		const isImg = src && /^img$/i.test(tag);
		const isCss = href && /^link$/i.test(tag);
		isImg && complete && done();
		src || isCss || done();
	});
export const loadImg = src => load("img", { src });
export const loadCss = href => load("link",
	{ rel: "stylesheet", href });
export const loadJs = src => load("script",
	{ type: "text/javascript", src });
export const gcs = element => {
	const { getComputedStyle: f } = window;
	return f ? f(element) : element.currentStyle;
};
export const dmt = items => {
	const hash = {}; // [...new Set(items)]
	hash.toString.call(items) === "[object Array]" &&
		items.forEach(item => (hash[item] = true));
	return Object.getOwnPropertyNames(hash);
};
export const hasCls = (element, cls) => {
	const list = element.className.split(/\s+/);
	const has = cls.split(/\s+/);
	const result = has.filter(v => !list.includes(v));
	return !result.length;
};
export const addCls = (element, cls) => {
	const list = element.className.split(/\s+/);
	const add = cls.split(/\s+/);
	const result = list.concat(add);
	element.className = dmt(result).join(" ");
};
export const delCls = (element, cls) => {
	const list = element.className.split(/\s+/);
	const del = cls.split(/\s+/);
	const result = list.filter(v => !del.includes(v));
	element.className = dmt(result).join(" ");
};
export const ready = new Promise(resolve => attachEvt(
	document, "DOMContentLoaded", resolve, false));
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
};
export const scrollLock = cls => {
	cls || (cls = "fixed-scroll-lock");
	const offset = { top: null, left: null };
	const isLock = () => {
		const { html, body } = scrollInfo();
		return hasCls(html, cls) && hasCls(body, cls);
	};
	const openLock = () => {
		if (!isLock()) {
			const { html, body, scroll } = scrollInfo();
			offset.top = scroll.scrollTop;
			offset.left = scroll.scrollLeft;
			addCls(html, cls);
			addCls(body, cls);
			scroll.style.top = -offset.top + "px";
			scroll.style.left = -offset.left + "px";
		}
	};
	const closeLock = () => {
		if (isLock()) {
			const { html, body } = scrollInfo();
			delCls(html, cls);
			delCls(body, cls);
			html.scrollTop = offset.top;
			html.scrollLeft = offset.left;
			body.scrollTop = offset.top;
			body.scrollLeft = offset.left;
		}
	};
	return { isLock, openLock, closeLock };
};