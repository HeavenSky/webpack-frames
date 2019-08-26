export const getType = v => // 用window上toString在ie会报错
	Object.prototype.toString.call(v).slice(8, -1);
export const isMap = v => getType(v) === "Map";
export const isSet = v => getType(v) === "Set";
export const isDate = v => getType(v) === "Date";
export const isArray = v => getType(v) === "Array";
export const isError = v => getType(v) === "Error";
export const isRegExp = v => getType(v) === "RegExp";
export const isPromise = v => getType(v) === "Promise";
export const isObject = v => v && typeof v === "object";
export const isFunction = v => typeof v === "function";
export const isBoolean = v => typeof v === "boolean";
export const isBigInt = v => typeof v === "bigint";
export const isNumber = v => typeof v === "number";
export const isString = v => typeof v === "string";
export const isSymbol = v => typeof v === "symbol";
export const isGenerator = v => isFunction(v) &&
	getType(v) === "GeneratorFunction";
export const isAsync = v => isFunction(v) &&
	getType(v) === "AsyncFunction";
export const isNum = v => (isNumber(v) || isString(v)) &&
	/^\s*(?:\+|-)?\s*\d+(?:.\d*)?\s*$/.test(v);
export const isInt = v => (isNumber(v) || isString(v)) &&
	/^\s*(?:\+|-)?\s*\d+\s*$/.test(v); // isFinite有类型转换
export const lower = v => String(v || "").toLowerCase();
export const upper = v => String(v || "").toUpperCase();
export const vals = v => Object.values(v || {});
export const keys = v => Object.keys(v || {});
export const join = (base, ...args) =>
	Object.assign(base || {}, ...args);
export const delayControl = ms => {
	const dc = {}; // delay control 延时控制器
	dc.promise = new Promise((resolve, reject) => {
		dc.resolve = resolve; dc.reject = reject;
	}); dc.timer = ms > -1 && setTimeout(dc.resolve, ms);
	return dc;
}; export const delay = ms => delayControl(ms).promise;
export const fdata = (fn, ...args) => // 函数转换成promise
	Promise.resolve(isFunction(fn) ? fn(...args) : fn);
export const fmtde = (fn, ...args) => fdata(fn, ...args)
	.then(data => [data, null]).catch(err => [null, err]);
export const split = (v, divide) => // 分割字符串并且筛选非空
	String(v || "").split(divide || "/").filter(Boolean);
export const dmt = (v, divide) => { // [...new Set(list)]
	const hash = {}; divide || (divide = /\s+/);
	isArray(v) || (v = String(v || "").split(divide));
	v.forEach(k => (hash[k] = 1)); return keys(hash);
}; // eslint-disable-next-line no-global-assign
const logs = console || (console = { memory: {} });
export const logger = (k, ...args) => logs[k](...args);
export const log = (...args) => logger("log", ...args);
export const dir = (...args) => // console.dir 只打印一个参数
	logger("dir", args.length > 1 ? args : args[0]);
[ // browser console logger tools, ployfill for console
	"debug", "error", "info", "log", "warn", "dir",
	"dirxml", "table", "trace", "group", "groupCollapsed",
	"groupEnd", "clear", "count", "assert", "markTimeline",
	"profile", "profileEnd", "timeline", "timelineEnd",
	"time", "timeEnd", "timeStamp", "context",
].forEach(k => {
	if (!logs[k]) { logs[k] = () => void 0; }
	log[k] = (m, ...args) => [logger(k, m), log(...args)];
	dir[k] = (m, ...args) => [logger(k, m), dir(...args)];
}); const DICT_WAIT = {};
export const listen = key => (DICT_WAIT[key] ||
	(DICT_WAIT[key] = delayControl())).promise;
export const trigger = (key, data) => DICT_WAIT[key] &&
	[DICT_WAIT[key].resolve(data), (DICT_WAIT[key] = 0)];
const DICT_LOCK = {}; export const dolock = key =>
	DICT_LOCK[key] ? true : !(DICT_LOCK[key] = true);
export const unlock = key => (DICT_LOCK[key] = false);
const DICT_CACHE = {}; export const getCache = (key, fn) =>
	DICT_CACHE[key] || (DICT_CACHE[key] = fdata(fn));
export const delCache = key => delete DICT_CACHE[key];
export const regCheck = (v, ok, no) => {
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
const uEXP = "^(?:(?:(?:bgp|dhcp|dns|ftp|gopher|gtp|" +
	"http|https|imap4|irc|mime|mms|nntp|ntp|pop3|rip|" +
	"rpc|rsvp|rtcp|rtmfp|rtmp|rtmpe|rtmps|rtmpt|rtp|" +
	"rtsp|sdp|sip|smtp|snmp|soap|ssdp|ssh|stun|telnet|" +
	"xmpp):|file:/)?//)?" + /* 流媒体协议+应用层协议 */
	"(?:(?:[^/@:\\s]+:)?[^/@:\\s]+@)?" + /* user:pass@ */
	"(?:(?:\\d{1,3}\\.){3}\\d{1,3}|[a-z\\d.-]{0,251}" +
	"[a-z\\d]\\.[a-z]{2,6})" + /* ip/domain */
	"(?:\\:\\d{1,4})?" + /* :port */
	"(?:/.*)?$"; /* pathname */
export const urlCheck = v => new RegExp(uEXP, "i").test(v);
/* 号码校验规则: (转换正则对象为字符串并拷贝)
copy(JSON.stringify(X.toString().replace(/^\/|\/\w*$/g,"")))
http://miit.gov.cn/n1146290/n4388791/c5623706/content.html
1. 手机和固话都支持前缀加 86,+86,86-,+86-
2. 手机号支持,见工信部电信网编号
3. 固话支持加区号和不加区号 021,021-,0712,0712-
4. 固话第一个号码不是0和1 */
const pEXP = "^([+0]?[1-9]\\d{1,2}-?)?(1([3589]\\d|" +
	"4[5-9]|6[124-7]|7[0-8])\\d{8}|(0[1-9]\\d{1,2}-?)?" +
	"[2-9]\\d{6,7}(-\\d{3,})?)$";
export const phoneCheck = v => new RegExp(pEXP).test(v);
export const calcText = text => {
	text = String(text || "");
	// eslint-disable-next-line no-control-regex
	const ascii = text.match(/[\x00-\xff]/g) || [];
	// surrogate pair 代理字符对2个算1个; ascii字符 算半个字符
	const reg = /[\ud800-\udbff][\udc00-\udfff]/g;
	const pair = text.match(reg) || [];
	return text.length - (ascii.length / 2) - pair.length;
};
export const validator = (rule, value, callback) => {
	let err;
	const { label, type, reg, msg, must, required,
		int, min, max, _min, _max } = rule;
	const need = must || required;
	const isNull = value == null || /^\s*$/.test(value);
	if (need && isNull) {
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
	}
	callback(err);
};
export const tryEXEC = (func, ...args) => {
	try {
		return isFunction(func) ? func(...args) : func;
	} catch (error) {
		dir.error("tryEXEC error:", { func, args, error });
	}
}; // eslint-disable-next-line no-eval
export const tryEVAL = str => tryEXEC(eval, `(${str})`);
export const tryJSON = str => tryEXEC(JSON.parse, str);
export const verIE = () => {
	const isIE = tryEVAL("/*@cc_on !@*/false");
	const ver = tryEVAL("/*@cc_on @_jscript_version@*/-0");
	const mod = document.documentMode;
	return isIE ? { ver, mod } : {};
}; // 返回{ver:IE版本,mod:兼容版本}, 仅支持11以下版本或模式
// 判断浏览器 https://github.com/skillnull/Get-Device-Info
export const parse = url => { // 地址解析成对象
	const obj = { main: "", args: {}, hash: "" };
	String(url || "").replace(/^([^?#]*)(\?[^#]*)?(#.*)?$/,
		(_match, main, args = "", hash = "") => {
			obj.main = decodeURI(main); // main和hash少转义
			obj.hash = decodeURI(hash).slice(1);
			args.replace(/(\?|&)([^&=]*)(=[^&]*)?/g,
				(_match, _prefix, key, val = "") => {
					key = decodeURIComponent(key);
					val = decodeURIComponent(val.slice(1));
					key && val && (obj.args[key] = val);
				} // 正则(**)?无配对时,对应未定义
			); // 正则(**)配对什么,就对应什么,哪怕为空字符串
		}); // args的key和val是各种特殊字符都要处理
	return obj;
};
export const stringify = obj => { // 对象还原成地址
	const { main, args, hash } = obj || {};
	let str = ""; keys(args).forEach(k => {
		const key = encodeURIComponent(k || "");
		const val = encodeURIComponent(args[key] || "");
		str += key || val ? "&" + key + "=" + val : "";
	}); // args的key和val是各种特殊字符都要处理
	if (str) { str = "?" + str.slice(1); }
	str += hash ? "#" + encodeURI(hash) : "";
	return encodeURI(main || "") + str; // main和hash少转义
};
export const loop = (source, circle) => {
	const list = []; // 记录循环结果,最多256条数据
	let db = { value: source, next: true };
	let idx = 0; // circle(before,idx,list)=>{value,next}
	while (db.next) { // 根据返回值判断是否继续循环
		db = circle(db.value, idx, list.slice()) || {};
		list.push(db.value); idx++; // 记录结果和增加索引
		list.splice(0, list.length - 256); // 限制长度256
	} // 使用时先将source标准化与循环结果value格式一致
	return db.value; // 数组循环建议用[].reduce
};
export const tree = (source, circle) => {
	const render = (data, key) => {
		if (isArray(data)) { return data.map(render); }
		if (data == null) { return null; }
		const { children, ...rest } = data || {};
		return circle(rest, render(children, key), key);
	}; // circle(rest,children,key)=>element
	return render(source); // 可以用来渲染嵌套类组件
};
export const formatUrl = link => loop({ link }, before => {
	let { http, link } = before || {};
	const [prefix = ""] = /^https?:\/\//i.exec(link) || [];
	prefix && (http = prefix.toLowerCase());
	link = link.slice(prefix.length);
	const next = /^https?:\/\//i.test(link);
	return { value: { http, link }, next };
});
/* const filterMap = { type: [{ text: "", value: "" }] };
const sorterMap = { name: (a, b) => a > b || -(a < b) };
function onChange(pagination, filters, sorter, extra) {} */
const getFt = k => (val, rec) => rec[k] === val;
const getSt = k => (a, b) => a[k] > b[k] || -(a[k] < b[k]);
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