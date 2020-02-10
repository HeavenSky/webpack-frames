export const getType = v => Object.prototype.toString
	.call(v).slice(8, -1); // window.toString在ie报错
export const isArray = v => getType(v) === "Array";
export const isRegExp = v => getType(v) === "RegExp";
export const isObject = v => v && typeof v === "object";
export const isFunction = v => typeof v === "function";
export const isBoolean = v => typeof v === "boolean";
export const isNumber = v => typeof v === "number";
export const isString = v => typeof v === "string";
export const isSymbol = v => typeof v === "symbol";
export const isNum = v => Number(v) === parseFloat(v);
export const isInt = v => Number(v) === parseInt(v, 10);
export const lower = v => `${v}`.toLowerCase();
export const upper = v => `${v}`.toUpperCase();
export const keys = v => Object.keys(v || {});
export const vals = v => Object.values(v || {});
export const join = (v, ...args) => Object.assign(v || {},
	...args); export const delay = ms => new Promise(
	resolve => setTimeout(resolve, ms)); // ms<2^31
export const dc = ms => { // delay control 延时控制
	const ob = { ms }; ob.promise = new Promise(
		(resolve, reject) => join(ob, { resolve, reject }));
	ob.timer = setTimeout(ob.resolve, ms); return ob;
}; // window.isFinite 类型转换, Number.isFinite 无转换
export const fdata = async (fn, ...args) =>
	await isFunction(fn) ? fn(...args) : fn;
export const fmtde = (...args) => fdata(...args)
	.then(d => [d, null]).catch(e => [null, e]);
export const dmt = (v, sep) => { // 使用Set快速去重
	const list = isString(v) ? v.split(sep || /\s+/) : v;
	return [...new Set(isArray(list) ? list : [])];
}; // eslint-disable-next-line no-global-assign
const clog = console || (console = { memory: {} });
export const logger = (k, ...args) => clog[k](...args);
export const log = (...args) => logger("log", ...args);
export const dir = (...args) => // console.dir 仅支持单参数
	logger("dir", args.length > 1 ? args : args[0]);
[ // browser console logger tools, ployfill for console
	"trace", "time", "timeEnd", "timeLog", "timeStamp",
	"clear", "timeline", "timelineEnd", "markTimeline",
	"group", "groupCollapsed", "groupEnd", "exception",
	"profile", "profileEnd", "profiles", "show", "log",
	"dir", "dirxml", "assert", "info", "warn", "error",
	"count", "countReset", "context", "table", "debug",
].forEach(k => {
	if (!clog[k]) { clog[k] = () => void 0; }
	log[k] = (m, ...args) => [logger(k, m), log(...args)];
	dir[k] = (m, ...args) => [logger(k, m), dir(...args)];
}); const LOCK_MAP = {}; export const initLock = // 阻塞+解锁
	k => k && LOCK_MAP[k] ? true : !(LOCK_MAP[k] = true);
export const undoLock = k => delete LOCK_MAP[k];
const EVENT_MAP = {}; export const listen = k => // 监听+触发
	(EVENT_MAP[k] || (EVENT_MAP[k] = dc())).promise;
export const trigger = (k, data) => EVENT_MAP[k] &&
	[EVENT_MAP[k].resolve(data), delete EVENT_MAP[k]];
const CACHE_MAP = {}; export const getCache = // 缓存+删除
	(k, fn) => CACHE_MAP[k] || (CACHE_MAP[k] = fdata(fn));
export const delCache = k => delete CACHE_MAP[k];
export const lockAsync = (fn, key) => {
	const LOCK = key || Math.random();
	return async () => initLock(LOCK) ||
		[await fmtde(fn), undoLock(LOCK)];
}; export const calcText = text => {
	text = text == null ? "" : `${text}`;
	// eslint-disable-next-line no-control-regex
	const ascii = text.match(/[\x00-\xff]/g) || [];
	// surrogate pair代理字符对算1个; ascii字符算1/2个
	const reg = /[\ud800-\udbff][\udc00-\udfff]/g;
	const pair = text.match(reg) || [];
	return text.length - (ascii.length / 2) - pair.length;
}; export const regCheck = (v, ok, no) => {
	let good = false; // 至少执行过一次检查且检查正确
	const err = (re, bo) => (isArray(re) ? re : [re]).find(
		x => isRegExp(x) && !(good = x.test(v) === bo));
	return !err(ok, true) && !err(no, false) && good;
}; // string verify tools by RegExp
/** 邮箱格式name@domain name规则:最多64个字符
 * domain规则:必须为顶级域名,域名后缀2-6个字符
 * http://faqs.org/rfcs/rfc1035.html 域名限制
 * labels:63 octets or less;names:255 octets or less */
const eOK = [/^[a-z\d._-]+@[a-z\d.-]+\.[a-z]{2,6}$/i];
const eNO = [/^[^@]{65}/, /^[._-]|[@._-]{2}/,
	/@.*[a-z\d-]{64}/i, /@.{256}/];
export const emailCheck = v => regCheck(v, eOK, eNO);
/* 号码校验规则: (转换正则对象为字符串并拷贝)
copy(JSON.stringify(X.toString().replace(/^\/|\/\w*$/g,"")))
http://miit.gov.cn/n1146290/n4388791/c5623706/content.html
1. 手机和固话都支持前缀加 86,+86,86-,+86-
2. 手机号支持,在工信部网站搜索:电信网编号计划
3. 固话支持加区号和不加区号 021,021-,0712,0712-
4. 固话第一个号码不是0和1 */
const pEXP = "^([+0]?[1-9]\\d{1,2}-?)?(1([3589]\\d|" +
	"4[5-9]|6[124-7]|7[0-8])\\d{8}|(0[1-9]\\d{1,2}-?)?" +
	"[2-9]\\d{6,7}(-\\d{3,})?)$";
export const phoneCheck = v => new RegExp(pEXP).test(v);
export const validator = (rule, value, callback) => {
	const { label, type, must, reg, msg, pre,
		int, min, max, _min, _max } = rule || {};
	isFunction(pre) && (value = pre(value));
	const empty = value == null || /^\s*$/.test(value);
	const vType = typeof value; let err;
	if (vType !== type) {
		err = `${label}类型错误, 要求${type}类型`;
	} else if (must && empty) {
		err = `${label}不能为空或全由空白字符组成`;
	} else if (isRegExp(reg) && !reg.test(value)) {
		err = label + (msg || "");
	} else if (type === "number") {
		if (!Number.isFinite(value)) {
			err = `${label}必须为数值!`;
		} else if (int && !isInt(value)) {
			err = `${label}必须为整数!`;
		} else if (min != null && value < min) {
			err = `${label}最小值为${min}!`;
		} else if (max != null && value > max) {
			err = `${label}最大值为${max}!`;
		} else if (_min != null && value <= _min) {
			err = `${label}必须大于${_min}!`;
		} else if (_max != null && value >= _max) {
			err = `${label}必须小于${_max}!`;
		}
	} else if (type === "string") {
		const len = calcText(value);
		if (min != null && len < min) {
			err = `${label}最少由${min}个中文` +
				`或${min * 2}个英文字符组成!`;
		} else if (max != null && len > max) {
			err = `${label}最多由${max}个中文` +
				`或${max * 2}个英文字符组成!`;
		}
	} callback(err);
}; export const tryEXEC = (fn, ...args) => {
	try { // eslint-disable-next-line no-new-func
		return isString(fn) ? Function(`return(${fn})`)()
			: isFunction(fn) ? fn(...args) : fn;
	} catch (e) { dir.error("tryEXEC:", { fn, args, e }); }
}; export const tryJSON = v => tryEXEC(JSON.parse, v);
export const verIE = () => tryEXEC("/*@cc_on !@*/false") ? {
	ver: tryEXEC("/*@cc_on @_jscript_version@*/-0"),
	mod: document.documentMode, // 低于11版本或模式{ver,mod}
} : {}; export const parse = url => { // 链接解析成对象
	if (!isString(url)) { return url; }
	if (/^(\[.*]|{.*})$/.test(url.trim())) {
		const json = tryJSON(url);
		if (isObject(json)) { return { json }; }
	} const ob = {}; const [, main, query, hash] =
		/^([^?#]*)(\?[^#]*)?(#.*)?$/.exec(url.trim());
	ob.main = decodeURI(main || ""); // 参数以外少转义
	ob.hash = decodeURI(hash || "").slice(1) || void 0;
	query && query.replace(/(\?|&)([^&=]*)(=[^&]*)?/g,
		(_match, _prefix, key, val) => { // 参数完整转义
			key = key && decodeURIComponent(key);
			val = val && decodeURIComponent(val).slice(1);
			if (!key && !val) { return; }
			ob.args || (ob.args = {});
			ob.args[key] = parse(val);
		} // 正则(xx)?匹配可能未定义,其他一定是字符串
	); return ob.args || ob.hash ? ob : ob.main;
}; export const stringify = obj => { // 对象还原成链接
	if (!isObject(obj)) { return obj; }
	if (obj.json) { return JSON.stringify(obj.json); }
	let { main, args, hash } = parse(obj.main) || {};
	main == null && (main = obj.main);
	hash == null && (hash = obj.hash);
	args = join(null, args, obj.args);
	let url = ""; keys(args).forEach(k => { // 参数完整转义
		url += "&" + encodeURIComponent(k) + "=" +
			encodeURIComponent(stringify(args[k]));
	}); if (url) { url = "?" + url.slice(1); }
	url += hash ? "#" + encodeURI(hash) : "";
	return encodeURI(main || "") + url; // 参数以外少转义
}; export const loop = (source, circle) => {
	const list = []; // 记录循环结果,最多256条数据
	let db = { value: source, next: true };
	let idx = 0; // circle(old,idx,list)=>{value,next}
	while (db.next) { // 根据返回值判断是否继续循环
		db = circle(db.value, idx, list.slice()) || {};
		list.push(db.value); idx++; // 记录结果和增加索引
		list.splice(0, list.length - 256); // 限制长度256
	} // 使用时先将source标准化与循环结果value格式一致
	return db.value; // 数组循环建议用[].reduce
}; export const tree = (source, circle) => {
	const render = (data, key) => {
		if (isArray(data)) { return data.map(render); }
		if (data == null) { return null; }
		const { children, ...args } = data || {};
		return circle(args, render(children, key), key);
	}; // circle(args,children,key)=>element
	return render(source); // 可以用来渲染嵌套类组件
}; export const formatUrl = link => loop({ link }, old => {
	let { http, link } = old || {};
	const [prefix = ""] = /^https?:\/\//i.exec(link) || [];
	prefix && (http = prefix.toLowerCase());
	link = link.slice(prefix.length);
	const next = /^https?:\/\//i.test(link);
	return { value: { http, link }, next };
}); const getFt = k => (val, rec) => rec[k] === val;
const getSt = k => (a, b) => a[k] > b[k] || -(a[k] < b[k]);
/* const filterMap = { type: [{ text: "", value: "" }] };
const sorterMap = { name: (a, b) => a > b || -(a < b) };
function onChange(pagination, filters, sorter, extra) {} */
export const formatCols = (cols, filterMap, sorterMap) =>
	!isArray(cols) ? [] : cols.filter(col => {
		const { dataIndex, _filter, _sorter } = col || {};
		// _filter和_sorter为false启用服务端模式
		if (!dataIndex) { return false; } // 有效列必需
		const fKey = col.filterKey || dataIndex;
		const { [fKey]: filter } = filterMap || {};
		if (filter) { col.filters = filter; }
		// onFilter本地模式(函数),服务端模式(false或空)
		if (_filter === false) { delete col.onFilter; }
		_filter && (col.onFilter = getFt(fKey));
		const sKey = col.sorterKey || dataIndex;
		const { [sKey]: sorter } = sorterMap || {};
		if (sorter) { col.sorter = sorter; }
		// sorter本地模式(函数),服务端模式(true)
		if (_sorter === false) { col.sorter = true; }
		_sorter && (col.sorter = getSt(sKey));
		return true;
	});