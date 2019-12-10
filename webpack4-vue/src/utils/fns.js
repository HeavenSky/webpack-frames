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
export const delay = ms => new Promise(resolve =>
	setTimeout(resolve, ms)); export const join =
		(x, ...v) => Object.assign(x || {}, ...v);
export const vals = v => Object.values(v || {});
export const keys = v => Object.keys(v || {});
export const lower = v => `${v}`.toLowerCase();
export const upper = v => `${v}`.toUpperCase();
export const dc = ms => {
	let resolve, reject; // delay control 延时控制器
	const cb = (x, y) => { resolve = x; reject = y; };
	const promise = new Promise(cb);
	const timer = ms > -1 && setTimeout(resolve, ms);
	return { promise, resolve, reject, timer, ms };
}; // isFinite会做类型转换;Number.isFinite不做类型转换
export const fdata = (fn, ...args) => // 函数转换成promise
	Promise.resolve(isFunction(fn) ? fn(...args) : fn);
export const fmtde = (fn, ...args) => fdata(fn, ...args)
	.then(d => [d, void 0]).catch(e => [void 0, e]);
export const dmt = (items, divide) => {
	const list = isArray(items) ? items : isString(items)
		? items.split(divide || /\s+/) : [];
	return [...new Set(list)]; // 去重
}; // eslint-disable-next-line no-global-assign
const clog = console || (console = { memory: {} });
export const logger = (k, ...args) => clog[k](...args);
export const log = (...args) => logger("log", ...args);
export const dir = (...args) => // console.dir 只打印一个参数
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
}); const MAP_IU = {}; export const initLock = // 阻塞解锁
	k => k && MAP_IU[k] ? true : !(MAP_IU[k] = true);
export const undoLock = k => delete MAP_IU[k];
const MAP_LT = {}; export const listen = k => // 监听触发
	(MAP_LT[k] || (MAP_LT[k] = dc())).promise;
export const trigger = (k, data) => MAP_LT[k] &&
	[MAP_LT[k].resolve(data), delete MAP_LT[k]];
const MAP_GD = {}; export const getCache = // 缓存删除
	(k, fn) => MAP_GD[k] || (MAP_GD[k] = fdata(fn));
export const delCache = k => delete MAP_GD[k];
export const lockAsync = (fn, key) => {
	const LOCK = key == null ? Math.random() : key;
	return async () => initLock(LOCK) ||
		[await fmtde(fn), undoLock(LOCK)];
}; export const calcText = text => {
	text = `${text || ""}`;
	// eslint-disable-next-line no-control-regex
	const ascii = text.match(/[\x00-\xff]/g) || [];
	// surrogate pair 代理字符对2个算1个; ascii字符 算半个字符
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
	const { label, type, reg, msg, must, required,
		int, min, max, _min, _max } = rule;
	const isNull = value == null || /^\s*$/.test(value);
	const need = must || required; let err;
	if (isNull && need) {
		err = `${label}不能为空!`;
	} else if (isRegExp(reg) && !reg.test(value)) {
		err = msg;
	} else if (type === "number") {
		if (!isNum(value)) {
			err = `${label}必须为数字!`;
		} else if (int && !isInt(value)) {
			err = `${label}必须为整数!`;
		} else if (min != null && value < min) {
			err = `${label}最小值为${min}!`;
		} else if (max != null && value > max) {
			err = `${label}最大值为${max}!`;
		} else if (_min != null && value <= _min) {
			err = `${label}需要大于${_min}!`;
		} else if (_max != null && value >= _max) {
			err = `${label}需要小于${_max}!`;
		}
	} else if (min != null && calcText(value) < min) {
		err = `${label}至少${min}个中文或${min * 2}个英文!`;
	} else if (max != null && calcText(value) > max) {
		err = `${label}顶多${max}个中文或${max * 2}个英文!`;
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
		const { children, ...rest } = data || {};
		return circle(rest, render(children, key), key);
	}; // circle(rest,children,key)=>element
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