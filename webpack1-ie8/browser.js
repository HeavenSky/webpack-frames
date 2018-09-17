const status = {
	"100": "Continue",
	"101": "Switching Protocols",
	"102": "Processing",
	"103": "Early Hints",
	"200": "OK",
	"201": "Created",
	"202": "Accepted",
	"203": "Non-Authoritative Information",
	"204": "No Content",
	"205": "Reset Content",
	"206": "Partial Content",
	"207": "Multi-Status",
	"208": "Already Reported",
	"226": "IM Used",
	"300": "Multiple Choices",
	"301": "Moved Permanently",
	"302": "Found",
	"303": "See Other",
	"304": "Not Modified",
	"305": "Use Proxy",
	"307": "Temporary Redirect",
	"308": "Permanent Redirect",
	"400": "Bad Request",
	"401": "Unauthorized",
	"402": "Payment Required",
	"403": "Forbidden",
	"404": "Not Found",
	"405": "Method Not Allowed",
	"406": "Not Acceptable",
	"407": "Proxy Authentication Required",
	"408": "Request Timeout",
	"409": "Conflict",
	"410": "Gone",
	"411": "Length Required",
	"412": "Precondition Failed",
	"413": "Payload Too Large",
	"414": "URI Too Long",
	"415": "Unsupported Media Type",
	"416": "Range Not Satisfiable",
	"417": "Expectation Failed",
	"418": "I am a Teapot",
	"421": "Misdirected Request",
	"422": "Unprocessable Entity",
	"423": "Locked",
	"424": "Failed Dependency",
	"425": "Unordered Collection",
	"426": "Upgrade Required",
	"428": "Precondition Required",
	"429": "Too Many Requests",
	"431": "Request Header Fields Too Large",
	"451": "Unavailable For Legal Reasons",
	"500": "Internal Server Error",
	"501": "Not Implemented",
	"502": "Bad Gateway",
	"503": "Service Unavailable",
	"504": "Gateway Timeout",
	"505": "HTTP Version Not Supported",
	"506": "Variant Also Negotiates",
	"507": "Insufficient Storage",
	"508": "Loop Detected",
	"509": "Bandwidth Limit Exceeded",
	"510": "Not Extended",
	"511": "Network Authentication Required",
};

const path = require("path");
const chokidar = require("chokidar");
const bodyParser = require("body-parser");
const pathToRegExp = require("path-to-regexp");
const requireEsModule = require("esm")(module);
const dir = path.join.bind(path, __dirname);
/**
 * routeMatch
 * 路由路径 和 pathname 进行匹配
 * @param {String} route 路由路径 如/user/:id
 * @param {String} pathname 浏览器 pathname 如/user/12
 * @param {Object,other} config 可选 路径匹配规则配置
 * @returns {Object,false} 不匹配时返回false
 */
const routeMatch = (route, pathname, config) => {
	config = Object.assign({
		sensitive: true,
		strict: false,
		end: true,
		start: true,
	}, config);
	const keys = [];
	const reg = pathToRegExp(route, keys, config);
	const vals = reg.exec(pathname);
	if (!vals) {
		return false;
	}
	const res = {};
	keys.forEach(
		({ name }, idx) => (res[name] = vals[idx + 1])
	);
	return res;
};

const clearRequireCache = file => {
	const data = require.cache[file] || {};
	const list = data.parent && data.parent.children;
	list && list.splice(list.indexOf(data), 1);
	delete require.cache[file];
};
const clearRequireEsModule = mo => {
	let file, data;
	try {
		file = require.resolve(mo);
	} catch (e) {
		console.log(e); // eslint-disable-line
	}
	clearRequireCache(file || mo);
	try {
		data = file && requireEsModule(file);
	} catch (e) {
		console.log(e); // eslint-disable-line
	}
	return data;
};

const moduleMap = {};
const addModule = file => {
	const esm = clearRequireEsModule(file);
	moduleMap[file] = (esm && esm.default) || esm || {};
};
const delModule = file => (delete moduleMap[file]);
const moduleToRoute = () => {
	const routeMap = {};
	const routes = Object.assign({},
		...Object.values(moduleMap));
	Object.keys(routes).forEach(k => {
		if (k === "NO_MOCK") {
			return (routeMap[k] = routes[k]);
		}
		let [, method = "all", route = ""] =
			k.match(/^(\S+)\s+(\W.*)$/) || [];
		if (route) {
			method = method.toLowerCase();
			route = route.replace(/\s+/g, "");
			method === "method" && (method = "all");
			routeMap[route] = Object.assign({},
				routeMap[route], { [method]: routes[k] });
		}
	});
	return routeMap;
};

const webpackMock = (app, folder = "mock") => {
	// app.use(require("multer")().none()); // 支持FormData
	app.use(bodyParser.json());
	app.use(bodyParser.text({ type: "text/xml" }));
	app.use(bodyParser.text({ type: "text/html" }));
	app.use(bodyParser.raw({ type: "text/plain" }));
	app.use(bodyParser.urlencoded({ extended: false }));

	let timer;
	let routeMap = {};
	const calc = () => (routeMap = moduleToRoute());

	app.all("*", (req, res, next) => {
		if (routeMap.NO_MOCK) {
			return next();
		}
		const method = req.method.toLowerCase();
		const pathname = req.path;
		let params;
		const route = Object.keys(routeMap).find(k => {
			params = routeMatch(k, pathname);
			return Boolean(params);
		});
		const handler = routeMap[route] || {};
		const callback = method in handler
			? handler[method] : handler.all;
		if (callback) {
			req.params = params || {};
			typeof callback === "function"
				? callback(req, res, next)
				: res.json(callback);
		} else {
			// res.json 和 next 不能同时使用
			next();
		}
	});
	const mock = dir(folder);
	// https://www.npmjs.com/package/chokidar
	chokidar.watch(mock).on("all", (event, info) => {
		switch (event) {
			case "add": addModule(info); break;
			case "unlink": delModule(info); break;
			case "change": addModule(info); break;
			case "error": break;
			default: break;
		}
		// 防抖 频繁触发只有500ms内无触发才会执行
		timer && clearTimeout(timer);
		timer = setTimeout(calc, 500);
	});
};

module.exports = { status, webpackMock };