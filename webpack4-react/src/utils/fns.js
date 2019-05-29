export const lower = v => String(v).toLowerCase();
export const upper = v => String(v).toUpperCase();
export const merge = (...v) => Object.assign({}, ...v);
export const getType = v => toString.call(v).slice(8, -1);
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
export const isNumber = v => typeof v === "number";
export const isString = v => typeof v === "string";
export const isSymbol = v => typeof v === "symbol";
export const isNum = v => (isNumber(v) || isString(v)) &&
	/^\s*(?:\+|-)?\s*\d+(?:.\d*)?\s*$/.test(v);
export const isInt = v => (isNumber(v) || isString(v)) &&
	/^\s*(?:\+|-)?\s*\d+\s*$/.test(v);
// 若存在类型转换一定要小心: isFinite会,Number.isFinite不会
// true+true=={toString:v=>2}=={valueOf:v=>2};
export const delay = ms =>
	new Promise(resolve => setTimeout(resolve, ms));
export const fmtde = v => Promise.resolve(isFunction(v)
	? v() : v).then(d => [d, null]).catch(e => [null, e]);
export const split = (v, slash) => String(v || "")
	.split(slash || "/").filter(Boolean);
export const dmt = list => { // 字符串数组去重
	const obj = {}; // 更优秀的数组去重 [...new Set(list)]
	isArray(list) && list.forEach(k => (obj[k] = null));
	return Object.getOwnPropertyNames(obj);
}; // Browser console logger tools
export const logger = (key, msg, data) =>
	// eslint-disable-next-line no-console
	[console[key](msg), console.dir(data)];
export const log = (m, ...d) => logger("log", m, d);
[
	"debug", "error", "info", "log", "warn", "dir",
	"dirxml", "table", "trace", "group", "groupCollapsed",
	"groupEnd", "clear", "count", "assert", "markTimeline",
	"profile", "profileEnd", "timeline", "timelineEnd",
	"time", "timeEnd", "timeStamp", "context",
].forEach(k => (log[k] = (m, ...d) => logger(k, m, d)));
// async lock method
const ASYNC_LOCKS = {};
export const dolock = key => {
	if (key != null && String(key)) {
		if (ASYNC_LOCKS[key]) { return true; }
		ASYNC_LOCKS[key] = true;
	}
};
export const unlock = key => {
	if (key != null && String(key)) {
		ASYNC_LOCKS[key] = false;
	}
};
// async listener method
const ASYNC_LISTENER = { promises: {}, resolves: {} };
export const listener = key => {
	const { promises, resolves } = ASYNC_LISTENER;
	if (!promises[key] || !resolves[key]) {
		promises[key] = new Promise(
			resolve => (resolves[key] = resolve)
		);
	}
	return promises[key];
};
export const trigger = (key, result) => {
	if (!key) { return; }
	const { promises, resolves } = ASYNC_LISTENER;
	const ps = promises[key];
	const rs = resolves[key];
	// 清除旧resolve函数,并结束promise等待
	delete resolves[key];
	ps && isFunction(rs) && rs(result);
};
// async cache method
const ASYNC_CACHE = { async: {}, cache: {} };
export const getCache = (key, fn) => {
	const { async, cache } = ASYNC_CACHE;
	if (key in cache) {
		return Promise.resolve(cache[key]);
	} else if (!async[key]) {
		async[key] = Promise.resolve(
			isFunction(fn) ? fn() : fn);
	}
	async[key].then(v => (cache[key] = v))
		.then(() => delete async[key])
		.catch(() => delete async[key]);
	return async[key];
};
export const delCache = key => {
	const { async, cache } = ASYNC_CACHE;
	if (key) {
		delete async[key];
		delete cache[key];
	} else {
		ASYNC_CACHE.async = {};
		ASYNC_CACHE.cache = {};
	}
};
// string verify tools by RegExp
export const regCheck = (v, ok, no) => {
	let check;
	isArray(ok) || (ok = [ok]);
	isArray(no) || (no = [no]);
	const fail = ok.find(x => isRegExp(x) && !(check = x.test(v))) ||
		no.find(x => isRegExp(x) && !(check = !x.test(v)));
	return check && !fail;
};
// 邮箱 name@domain name规则:最多64个字符 domain规则:必须为顶级域名,域名后缀2-6个字符
// http://faqs.org/rfcs/rfc1035.html 域名限制
// labels:63 octets or less;names:255 octets or less
const EMAIL_OK = [/^[a-z\d._-]+@[a-z\d.-]+\.[a-z]{2,6}$/i];
const EMAIL_NO = [/^[^@]{65}/, /^[._-]|[@._-]{2}/, /@.*[a-z\d-]{64}/i, /@.{256}/];
export const emailCheck = v => regCheck(v, EMAIL_OK, EMAIL_NO);
const URL_EXP =
	"^(?:(?:(?:bgp|dhcp|dns|ftp|gopher|gtp|http|https|imap4|irc|mime|mms|nntp|ntp|pop3|rip|rpc|rsvp|rtcp|rtmfp|rtmp|rtmpe|rtmps|rtmpt|rtp|rtsp|sdp|sip|smtp|snmp|soap|ssdp|ssh|stun|telnet|xmpp):|file:/)?//)?" + // 流媒体协议+应用层协议
	"(?:(?:[^/@:\\s]+:)?[^/@:\\s]+@)?" + // 支持user:pass@的形式
	"(?:(?:\\d{1,3}\\.){3}\\d{1,3}|[a-z\\d.-]{0,251}[a-z\\d]\\.[a-z]{2,6})" + // 支持ip和domain的形式
	"(?:\\:\\d{1,4})?" + // 支持端口
	"(?:/.*)?$"; // 支持url后含其他字符
const URL_REG = new RegExp(URL_EXP, "i");
export const urlCheck = v => URL_REG.test(v);
/* 号码校验规则:
1. 手机和固话都支持前缀加 86,+86,86-,+86-
2. 手机号支持,见工信部电信网编号
http://miit.gov.cn/n1146285/n1146352/n3054355/n3057709/n3057714/c5622616/content.html
3. 固话支持加区号和不加区号 021,021-,0712,0712-
4. 固话第一个号码不是0和1 */
export const phoneCheck = v => /^([+0]?[1-9]\d{1,2}-?)?(1([3589]\d|4[5-9]|6[124-7]|7[0-8])\d{8}|(0[1-9]\d{1,2}-?)?[2-9]\d{6,7}(-\d{3,})?)$/.test(v);
export const calcText = text => {
	const type = typeof text;
	if (type === "number" || type === "boolean") {
		text = String(text);
	} else if (type !== "string") { return 0; }
	// eslint-disable-next-line no-control-regex
	const ascii = text.match(/[\x00-\xff]/g) || [];
	// surrogate pair 代理字符对2个算1个; ascii字符 算半个字符
	const pair = text.match(/[\ud800-\udbff][\udc00-\udfff]/g) || [];
	return text.length - (ascii.length / 2) - pair.length;
};
export const validator = (rule, value, callback) => {
	let err;
	const { label, type, int, min, max, _min, _max, pattern, msg, notNull, required } = rule;
	const need = notNull || required;
	const checkNull = value == null || /^[\f\n\r\s\t\v]*$/.test(value);
	if (need && checkNull) {
		err = `${label}不能为空!`;
	} else if (pattern && !pattern.test(value)) {
		err = `${label}${msg}!`;
	} else if (type === "number") {
		if (!/^\s*-?\d+(?:.\d*)?\s*$/.test(value)) {
			err = `${label}必须为数字!`;
		} else if (int && /\./.test(value)) {
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
	} else if (min != null && calcText(value) < min) {
		err = `${label}长度最少为${min}个汉字或${min * 2}个字母!`;
	} else if (max != null && calcText(value) > max) {
		err = `${label}长度最大为${max}个汉字或${max * 2}个字母!`;
	}
	callback(err);
};
export const tryEXEC = (func, ...args) => {
	let res;
	try {
		res = isFunction(func) ? func(...args) : func;
	} catch (error) {
		log.error("tryEXEC Error:", { error, func, args });
	}
	return res;
}; // eslint-disable-next-line no-eval
export const tryEVAL = str => tryEXEC(eval, `(${str})`);
export const tryJSON = str => tryEXEC(JSON.parse, str);
export const verIE = () => {
	// 返回{ver:IE版本,mod:兼容版本}, 仅支持11以下模式版本
	const isIE = tryEVAL("/*@cc_on !@*/false");
	const ver = tryEVAL("/*@cc_on @_jscript_version@*/-0");
	const mod = document.documentMode;
	return isIE ? { ver, mod } : {};
};
export const verClient = () => {
	const ua = window.navigator.userAgent;
	const res = {
		ua, mobile: /\bmobile\b/i.test(ua),
		compatible: /\bcompatible\b/i.test(ua),
	};
	let match;
	match = ua.match(/\bmsie\W*([.\d]+)/i) ||
		ua.match(/\brv:([.\d]+)\W*like gecko\b/i);
	if (match) {
		return Object.assign(res, {
			type: "ie",
			version: match[1],
		});
	}
	match = ua.match(/\bucweb\W*([.\d]+)/i) ||
		ua.match(/\bucbrowser\W*([.\d]+)/i);
	if (match) {
		return Object.assign(res, {
			type: "uc",
			version: match[1],
		});
	}
	match = ua.match(/\bopr\W*([.\d]+)/i) ||
		ua.match(/\bopera\b.*\bversion\W*([.\d]+)/i) ||
		ua.match(/\bopera\W*([.\d]+)/i);
	if (match) {
		return Object.assign(res, {
			type: "opera",
			version: match[1],
		});
	}
	match = ua.match(/\bfirefox\W*([.\d]+)/i);
	if (match) {
		return Object.assign(res, {
			type: "firefox",
			version: match[1],
		});
	}
	match = ua.match(/\bversion\W*([.\d]+)\s.*\bsafari\b/i);
	if (match) {
		return Object.assign(res, {
			type: "safari",
			version: match[1],
		});
	}
	match = ua.match(/\bchrome\W*([.\d]+)/i);
	if (match) {
		return Object.assign(res, {
			type: "chrome",
			version: match[1],
		});
	}
	return res;
};
export const parse = url => { // 链接转换成对象
	const obj = { main: "", args: {}, hash: "" };
	String(url || "").replace(/^([^?#]*)(\?[^#]*)?(#.*)?$/,
		(_match, main, args = "", hash = "") => {
			obj.main = decodeURIComponent(main);
			obj.hash = decodeURIComponent(hash.slice(1));
			return args.replace(/(\?|&)([^&=]*)(=[^&]*)?/g,
				(_match, _prefix, key, val = "") => {
					key = decodeURIComponent(key);
					val = decodeURIComponent(val.slice(1));
					if (!key && !val) { return ""; }
					return (obj.args[key] = val);
				}
			);
		}
	);
	return obj;
};
export const stringify = obj => { // 对象转换成链接
	const { main = "", args = {}, hash = "" } = obj || {};
	let str = "";
	Object.keys(args).forEach(k => {
		const key = encodeURIComponent(k || "");
		const val = encodeURIComponent(args[key] || "");
		str += key || val ? "&" + key + "=" + val : "";
	});
	if (str) { str = "?" + str.slice(1); }
	str += hash ? "#" + encodeURIComponent(hash) : "";
	return main + str;
};
const HTTP = "http://";
const HTTPS = "https://";
export const URL_SELECT = { HTTP, HTTPS };
export const formatUrl = (url, pos) => {
	if (pos == null) {
		let http = "";
		let link = String(url || "");
		if (link.slice(0, 7) === HTTP) {
			http = HTTP;
			link = link.slice(7);
		} else if (link.slice(0, 8) === HTTPS) {
			http = HTTPS;
			link = link.slice(8);
		}
		return { http, link };
	}
	let bef = url;
	let aft = "";
	const pre = [];
	do {
		const res = formatUrl(bef);
		aft = res.link;
		[bef, aft] = [aft, bef];
		res.http && pre.push(res.http);
	} while (bef !== aft);
	const http = pre.slice(pos)[0] || pre[0] || "";
	return { http, link: bef };
};
/*
const filters = { status: [{ text, value }] };
const sorters = { status: (a, b) => a > b || -(a < b) };
const onChange = (pagination, filters, sorter) => 0;
*/
const onFilter = k => (value, record) => record[k] === value;
const onSorter = k => (a, b) => a[k] > b[k] || -(a[k] < b[k]);
export const formatCols = (columns, filters, sorters) =>
	(columns || []).filter(col => {
		const { dataIndex, filterKey, sorterKey, _filter, _sorter } = col || {};
		// columns 有效列必含dataIndex, 服务端模式_filter和_sorter小于0
		if (!dataIndex) {
			return false;
		}
		const fKey = filterKey || dataIndex;
		const filter = (filters || {})[fKey];
		if (filter) {
			col.filters = filter;
		}
		// onFilter 本地模式是一个函数, 服务端模式是false/null/undefined
		if (_filter) {
			col.onFilter = _filter < 0 ? false : onFilter(fKey);
		}
		const sKey = sorterKey || dataIndex;
		const sorter = (sorters || {})[sKey];
		if (sorter) {
			col.sorter = sorter;
		}
		// sorter 本地模式是一个函数, 服务端模式是true
		if (_sorter) {
			col.sorter = _sorter < 0 ? true : onSorter(sKey);
		}
		return true;
	});
export const getArea = division => {
	// http://stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/ 现在已经无法直接抓取全部数据
	const MAP = {};
	const LIST = [];
	const getPid = id => id % 100 ? String(id).slice(0, -2) + "00"
		: id => id % 10000 ? String(id).slice(0, -4) + "0000" : null;
	String(division || "").replace(
		/(\d{6})\s+(\S+)/g,
		(_match, code, name) => {
			const item = {
				id: code,
				pid: getPid(code),
				value: code,
				label: name,
			};
			MAP[code] = item;
			LIST.push(item);
			return "";
		}
	);
	LIST.forEach(v => {
		const { pid } = v;
		const item = MAP[pid];
		if (item) {
			const { children = [] } = item;
			children.push(v);
			item.children = children;
		} else {
			v.pid = null;
		}
	});
	return LIST.filter(v => v.pid == null);
};