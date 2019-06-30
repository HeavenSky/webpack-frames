const example = {
	NO_MOCK: false, // 是否直接禁用 mock
	"ALL /api": {
		name: "api",
		fork: "github",
	},
	"GET /api": "api name fork github",
	"PUT /user/:id"(req, res) {
		const { body, query, params, cookies } = req;
		res.cookie("testName", "testValue");
		res.json({ body, query, cookies, ...params });
	},
	"POST /api": () => ({
		target: "https://proxy.io",
		changeOrigin: true,
		secure: true,
		pathRewrite: { "^/api": "/mock" },
		bypass: (req, _res, _proxyOptions) =>
			/\.html/.test(req.url) && req.originalUrl,
		onProxyReq: (proxyReq, _req, _res) =>
			proxyReq.setHeader("x-auth-token", "forever"),
		onProxyRes: (proxyRes, _req, _res) =>
			proxyRes.setHeader("location", "/login.html"),
	}), // 设计一种配置支持全局延迟和独自延迟,牺牲自由度
}; // 做一个自动根据文件路径来映射的请求,牺牲自由度
const status = {
	100: "Continue",
	101: "Switching Protocols",
	102: "Processing",
	103: "Early Hints",
	200: "OK",
	201: "Created",
	202: "Accepted",
	203: "Non Authoritative Information",
	204: "No Content",
	205: "Reset Content",
	206: "Partial Content",
	207: "Multi-Status",
	208: "Already Reported",
	226: "IM Used",
	300: "Multiple Choices",
	301: "Moved Permanently",
	302: "Moved Temporarily",
	303: "See Other",
	304: "Not Modified",
	305: "Use Proxy",
	307: "Temporary Redirect",
	308: "Permanent Redirect",
	400: "Bad Request",
	401: "Unauthorized",
	402: "Payment Required",
	403: "Forbidden",
	404: "Not Found",
	405: "Method Not Allowed",
	406: "Not Acceptable",
	407: "Proxy Authentication Required",
	408: "Request Timeout",
	409: "Conflict",
	410: "Gone",
	411: "Length Required",
	412: "Precondition Failed",
	413: "Request Entity Too Large",
	414: "Request URI Too Long",
	415: "Unsupported Media Type",
	416: "Requested Range Not Satisfiable",
	417: "Expectation Failed",
	418: "I am a Teapot",
	419: "Insufficient Space on Resource",
	420: "Method Failure",
	421: "Misdirected Request",
	422: "Unprocessable Entity",
	423: "Locked",
	424: "Failed Dependency",
	425: "Unordered Collection",
	426: "Upgrade Required",
	428: "Precondition Required",
	429: "Too Many Requests",
	431: "Request Header Fields Too Large",
	451: "Unavailable For Legal Reasons",
	500: "Internal Server Error",
	501: "Not Implemented",
	502: "Bad Gateway",
	503: "Service Unavailable",
	504: "Gateway Timeout",
	505: "HTTP Version Not Supported",
	506: "Variant Also Negotiates",
	507: "Insufficient Storage",
	508: "Loop Detected",
	509: "Bandwidth Limit Exceeded",
	510: "Not Extended",
	511: "Network Authentication Required",
};
/* require在webpack和nodejs中差异很大
resolve返回的是模块id,cache里键也是模块id
https://webpack.js.org/guides/dependency-management/
https://webpack.docschina.org/guides/dependency-management/
*/
const multer = require("multer");
const chokidar = require("chokidar");
const bodyParser = require("body-parser");
const debounce = require("lodash/debounce");
const cookieParser = require("cookie-parser");
const pathToRegExp = require("path-to-regexp");
const requireEsModule = require("esm")(module);
const proxy = require("http-proxy-middleware");

const print = console.log; // eslint-disable-line no-console
const isSt = v => typeof v === "string";
const isFn = v => typeof v === "function";
const keys = v => Object.keys(v || {});
const vals = v => Object.values(v || {});
const merge = (...v) => Object.assign({}, ...v);
const tryEXEC = (func, ...args) => {
	try {
		return isFn(func) ? func(...args) : func;
	} catch (error) {
		print("tryEXEC error:", { func, args, error });
	}
};
const clearRequireCache = file => {
	const data = require.cache[file] || {};
	const list = data.parent && data.parent.children;
	list && list.splice(list.indexOf(data), 1);
	delete require.cache[file];
};
const clearRequireEsModule = mo => tryEXEC(() => {
	const file = require.resolve(mo);
	clearRequireCache(file || mo);
	return requireEsModule(file);
});
/* 参考文档 https://npmjs.com/package/path-to-regexp#usage
route: 路由路径,如/user/:id
pathname: 页面路径,如/user/12
config: 路径匹配规则设置[可选]
路由路径 和 页面路径 进行匹配 返回匹配结果或undefined */
const routeMatch = (route, pathname, config) => {
	config = merge({ sensitive: true }, config);
	const args = [];
	const reg = pathToRegExp(route, args, config);
	const match = reg.exec(pathname);
	if (!match) { return; }
	const result = {};
	args.forEach((k, i) => (result[k.name] = match[++i]));
	return result;
};
// 对express的application实例进行路由拦截,做mock处理
const httpMock = (app, mockFolder) => {
	const moduleMap = {};
	const addModule = file => {
		const esm = clearRequireEsModule(file);
		moduleMap[file] = (esm && esm.default) || esm || {};
	};
	const delModule = file => (delete moduleMap[file]);

	let routeMap = {}; // 防抖 500ms 内无触发才会执行
	const calc = debounce(() => {
		const routes = merge(...vals(moduleMap));
		const { NO_MOCK } = routes;
		routeMap = { NO_MOCK }; // 重置路由
		NO_MOCK || keys(routes).forEach(k => {
			let [, method, route] = // 请求方式,路由地址
				/^\s*(\S+)\s+(\S.*)$/.exec(k) || [];
			route = (route || "").replace(/\s+/g, "");
			method = (method || "all").toLowerCase();
			method === "method" && (method = "all");
			route && (routeMap[route] = merge( // 增量更新
				routeMap[route], { [method]: routes[k] }));
		});
	}, 500);
	// 查找路由对应的回调函数
	const findCallBack = (req, res, next) => {
		if (routeMap.NO_MOCK) { return; }
		let params; // 计算路由参数使用
		const route = keys(routeMap).find(routePath =>
			(params = routeMatch(routePath, req.path)));
		const handler = routeMap[route] || {};
		const method = req.method.toLowerCase();
		const f = method in handler
			? handler[method] : handler.all;
		const isProxy = isFn(f) && f.length === 0;
		/* 将字符串认定为设定响应的字符串
		将对象认定为设定响应的JSON字符串
		将带参函数认定为自定义处理请求或响应
		将无参函数认定为返回一个代理配置 */
		return isProxy ? tryEXEC(proxy, f) : f ? () => {
			req.params = params || {};
			isFn(f) ? tryEXEC(f, req, res, next)
				: res[isSt(f) ? "send" : "json"](f);
		} : null; // send json next 不要同时使用
	};
	const parser = [
		cookieParser(), // 解析请求中的 cookie
		multer().none(), // 支持 FormData 文本
		bodyParser.json(), // 支持 json 请求体
		bodyParser.text({ type: "text/xml" }),
		bodyParser.text({ type: "text/html" }),
		bodyParser.raw({ type: "text/plain" }),
		bodyParser.urlencoded({ extended: false }),
	];
	app.all("*", (req, res, next) => {
		const f = findCallBack(req, res, next);
		f && print(new Date(), req.method, req.path);
		!f ? next() : f.length > 2 ? f(req, res, next)
			: Promise.all(parser.map(h => new Promise(
				resolve => h(req, res, resolve)))).then(f);
	});
	chokidar.watch(mockFolder).on("all", (event, info) => {
		switch (event) {
			case "add": addModule(info); calc(); break;
			case "unlink": delModule(info); calc(); break;
			case "change": addModule(info); calc(); break;
			case "error": break;
			default: break;
		} // 具体文档查看npm包chokidar
	});
};
module.exports = { example, status, httpMock };