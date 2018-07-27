const DATA_MAP = {};
const DATA_AJAX = {};
export const clearData = key => {
	delete DATA_MAP[key];
	delete DATA_AJAX[key];
};
export const cacheData = (key, fn) => {
	if (key in DATA_MAP) {
		return Promise.resolve(DATA_MAP[key]);
	} else {
		(key in DATA_AJAX) || (DATA_AJAX[key] = fn());
		const ajax = Promise.resolve(DATA_AJAX[key]);
		const f = v => delete DATA_AJAX[key];
		ajax.then(f, f); // eslint-disable-line
		return ajax.then(v => (DATA_MAP[key] = v));
	}
};

export const loadDom = (tag, attr, target) =>
	new Promise((resolve, reject) => {
		const dom = document.createElement(tag);
		dom.onload = resolve;
		dom.onerror = reject;
		dom.style.display = "none";
		Object.assign(dom, attr);
		(target || document.body).appendChild(dom);
		const { src, href } = attr || {};
		const isSrc = src && "onload" in dom;
		const isCss = href && /^link$/i.test(tag);
		(isSrc || isCss) || resolve({ target: dom });
	});
export const loadImg = src => loadDom("img", { src });
export const loadCss = href => loadDom("link",
	{ rel: "stylesheet", href });
export const loadJs = src => loadDom("script",
	{ type: "text/javascript", src });

// 获取dom的计算后样式属性
export const domStyle = target => {
	const { getComputedStyle: gc } = window;
	return gc ? gc(target, null) : target.currentStyle;
};
// 单行文字自适应大小
export const fitText = (target, text, rate = 2) => {
	const span = document.createElement("span");
	span.style.cssText = "border:0;margin:0;padding:0;width:auto;min-width:auto;max-width:none;overflow:visible;position:absolute;visibility:hidden;white-space:nowrap;font:inherit;columns:inherit;transform:inherit;text-indent:inherit;word-spacing:inherit;letter-spacing:inherit;text-transform:inherit;";
	span.innerText = text;
	target.appendChild(span);
	let limit = domStyle(target).width;
	limit = parseFloat(limit) || 0;
	if (limit === 0) {
		return;
	}
	let { fontSize, width } = domStyle(span);
	fontSize = parseFloat(fontSize) || 0;
	width = parseFloat(width) || 0;
	target.innerText = text;
	if (width && fontSize) {
		rate = rate >> 0;
		const p = Math.pow(10, rate);
		let fs = fontSize * limit / width;
		fs = (Math.floor(fs * p) / p).toFixed(p);
		target.style.fontSize = fs + "px";
	}
};
// 布局自适应填满
export const fitView = (_w = 10, _h) => {
	// 计算方法 _w/_h = 节点的 scrollHeight/scrollWidth
	// 临界高度 h = w*_w/_h = w*scrollHeight/scrollWidth
	// 临界高度必须稍大或精准,否则会有滚动条,则_h取值应近似取小
	const root = document.documentElement;
	const { clientWidth: w, clientHeight: h } = root;
	root.style.fontSize = _w * w > _h * h
		? `${_h}vh` : `${_w}vw`;
};

// 用来手动加载导出excel的js依赖
export const xlsxOk = v => cacheData("XLSX", x =>
	Promise.all([
		"https://cdn.bootcss.com/FileSaver.js/2014-11-29/FileSaver.min.js",
		"https://cdn.bootcss.com/xlsx/0.12.13/xlsx.full.min.js",
	].map(loadJs))
);

export const rows2list = (rows, keys) => {
	// rows 数据库返回列表数组 keys 列顺序数组
	keys || (keys = Object.keys(rows[0]));
	return rows.map(v => keys.map(k => v[k]));
};
export const list2html = (list, id, editable) => {
	// list 二维数组 [[1,2],[2,4]] 返回 html table 字符串
	const u = window.XLSX.utils;
	const sheet = u.aoa_to_sheet(list);
	return u.sheet_to_html(sheet, { id, editable });
};
export const html2file = (html, opts) => {
	// bookType 和 name 后缀对应关系
	const type2name = {
		biff8: ".xls",
		xlsx: ".xlsx",
		xlsb: ".xlsb",
		fods: ".fods",
		ods: ".ods",
		csv: ".csv",
	};
	const u = window.XLSX.utils;
	const { writeFile, write } = window.XLSX;
	const { onlydata, sheet = "sheet", bookType = "xlsx",
		name = sheet + type2name[bookType] } = opts || {};
	const book = u.table_to_book(html, { sheet });
	return onlydata ? write(book, {
		bookType, bookSST: true, type: "base64",
	}) : writeFile(book, name);
};
export const download = (html, opts, btn) => {
	// 监测当前低版本浏览器, 做一些UI的变化
	opts = Object.assign(opts, { onlydata: true });
	window.Downloadify.create(btn, {
		width: 80,
		height: 20,
		append: false,
		transparent: false,
		dataType: "base64",
		filename: opts.name,
		swf: "downloadify.swf",
		downloadImage: "download.png",
		data: v => html2file(html, opts),
		onComplete: e => "文件保存成功!",
		onCancel: e => "文件保存取消!",
		onError: e => "文件保存错误!",
	});
};