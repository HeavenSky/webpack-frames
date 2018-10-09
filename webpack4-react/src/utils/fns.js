export const lower = v => String(v).toLowerCase();
export const upper = v => String(v).toUpperCase();
export const getType = v => ({}).toString.call(v).slice(8, -1);
export const isMap = v => getType(v) === "Map";
export const isSet = v => getType(v) === "Set";
export const isDate = v => getType(v) === "Date";
export const isError = v => getType(v) === "Error";
export const isArray = v => getType(v) === "Array";
export const isObject = v => getType(v) === "Object";
export const isRegExp = v => getType(v) === "RegExp";
export const isPromise = v => getType(v) === "Promise";
export const isBoolean = v => typeof v === "boolean";
export const isNumber = v => typeof v === "number";
export const isString = v => typeof v === "string";
export const isSymbol = v => typeof v === "symbol";
export const isFunction = v =>
	typeof v === "function" ||
	getType(v) === "Function" ||
	getType(v) === "GeneratorFunction";
export const isNum = v =>
	["number", "string"].includes(typeof v) &&
	/^\s*(?:\+|-)?\s*\d+(?:.\d*)?\s*$/.test(v);
export const isInt = v =>
	["number", "string"].includes(typeof v) &&
	/^\s*(?:\+|-)?\s*\d+\s*$/.test(v);
// 若存在类型转换一定要小心
// isFinite会转换类型,Number.isFinite不会转换类型;
// true+true=={toString:v=>2}=={valueOf:v=>2};
export const logger = (key, msg, err) =>
	// eslint-disable-next-line no-console
	console[key](msg) || console.dir(err);
export const log = (msg, err) => logger("log", msg, err);
[
	"debug", "error", "info", "log", "warn", "dir",
	"dirxml", "table", "trace", "group", "groupCollapsed",
	"groupEnd", "clear", "count", "assert", "markTimeline",
	"profile", "profileEnd", "timeline", "timelineEnd",
	"time", "timeEnd", "timeStamp", "context",
].forEach(key => {
	log[key] = (msg, err) => logger(key, msg, err);
});
export const regCheck = (v, ok, no) => {
	let fail, check;
	isArray(ok) || (ok = [ok]);
	fail = ok.find(x => isRegExp(x) && !(check = x.test(v)));
	if (!fail) {
		isArray(no) || (no = [no]);
		fail = no.find(x => isRegExp(x) && !(check = !x.test(v)));
	}
	return !fail && !!check;
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
// http://www.miit.gov.cn/n1146285/n1146352/n3054355/n3057709/n3057714/c5622616/content.html 工信部电信网编号
export const mobileCheck = v => /^1([3589]\d|4[5-9]|6[124-7]|7[0-8])\d{8}$/.test(v);
export const calcText = v => {
	let text = v;
	const type = typeof v;
	if (type === "number" || type === "boolean") {
		text = String(v);
	} else if (type !== "string") {
		return 0;
	}
	// ascii字符 算半个字符
	// eslint-disable-next-line no-control-regex
	const ascii = text.match(/[\x00-\xff]/g) || [];
	// surrogate pair 代理字符对 两个字符算一个字符
	const pair = text.match(/[\ud800-\udbff][\udc00-\udfff]/g) || [];
	return text.length - ascii.length / 2 - pair.length;
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
export const tryJSON = str => {
	let res;
	try {
		res = JSON.parse(str);
	} catch (e) {
		log.error("Function tryJSON", e);
	}
	return res;
};
export const tryEVAL = str => {
	let res;
	try {
		// eslint-disable-next-line no-eval
		res = eval("(" + str + ")");
	} catch (e) {
		log.error("Function tryEVAL", e);
	}
	return res;
};
export const verIE = () => {
	// 返回值{ver:IE版本,mod:文档模式版本}, 只能获取11以下的版本信息
	const isIE = tryEVAL("/*@cc_on !@*/false");
	if (isIE) {
		const ver = tryEVAL("/*@cc_on @_jscript_version@*/-0");
		const mod = document.documentMode;
		return { ver, mod };
	}
	return {};
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
export const urlArgs = (v, b) => {
	// b==false,返回值{args:URL中的参数,hash:URL中的哈希,main:URL中的主体}
	// b==true,逆向操作
	if (b) {
		const { main = "", args = {}, hash = "" } = v || {};
		let str = "";
		for (let x in args) {
			const key = encodeURIComponent(x || "");
			const value = encodeURIComponent(args[key] || "");
			if (key || value) {
				str += "&" + key + "=" + value;
			}
		}
		if (str) {
			str = "?" + str.slice(1);
		}
		if (hash) {
			str += "#" + encodeURIComponent(hash || "");
		}
		return main + str;
	} else {
		const obj = { main: "", args: {}, hash: "" };
		String(v || "").replace(
			/^([^?#]*)(\?[^#]*)?(#.*)?$/,
			(match, main, args, hash) => {
				obj.main = decodeURIComponent(main || "");
				obj.hash = decodeURIComponent(
					String(hash || "").slice(1)
				);
				String(args || "").replace(
					/(\?|&)([^&=]*)(=[^&]*)?/g,
					(match, prefix, key, value) => {
						key = decodeURIComponent(key || "");
						value = decodeURIComponent(
							String(value || "").slice(1)
						);
						if (key || value) {
							obj.args[key] = value;
						}
						return "";
					}
				);
				return "";
			}
		);
		return obj;
	}
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
	// http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/ 现在已经无法直接抓取全部数据
	const MAP = {};
	const LIST = [];
	const getPid = id => id % 100 ? String(id).slice(0, -2) + "00"
		: id => id % 10000 ? String(id).slice(0, -4) + "0000" : null;
	String(division || "").replace(
		/(\d{6})\s+(\S+)/g,
		(match, code, name) => {
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