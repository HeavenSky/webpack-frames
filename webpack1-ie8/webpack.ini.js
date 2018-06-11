const isProd = process.env.NODE_ENV === "production";
const pkg = require("./package.json");
const ver = "." || `-${pkg.version}-`;
const min = isProd ? ".min" : "";
const ts = new Date().getTime();
const path = require("path");
const dir = path.join.bind(path, __dirname);
const distinct = v => v ? [...new Set(v)] : [];
const format = (f, app) => "" + f === f ? f : f(app);

const bootcdn = "https://cdn.bootcss.com/";
const elecdn = "https://npm.elemecdn.com/";
// 路径常量请尽可能以`/`结尾
const publicPath = "";
const prefixPath = "";
const buildFolder = "build";
const outputFolder = "dist";
const staticFolder = "src/static";
const templateFolder = "src/views";
// https://github.com/webpack-contrib/style-loader#options
// https://github.com/vuejs/vue-style-loader
const styleLoader = "style-loader?sourceMap=true";
// https://github.com/webpack-contrib/css-loader#options
const cssStyleLoader = "css-loader?modules=false&minimize=false&sourceMap=true";
const cssModuleLoader = "css-loader?localIdentName=[name]_[local]_[hash:base64:5]&modules=true&minimize=false&sourceMap=true";
// https://github.com/postcss/postcss-loader#options
const postStyleLoader = "postcss-loader?minimize=false&sourceMap=true";
// https://github.com/webpack-contrib/less-loader
const lessStyleLoader = "less-loader?javascriptEnabled=true&minimize=false&sourceMap=true";
// webpack1对于非字符串形式的loader报莫名其妙错误

const entry = {
	page: [""],
	distinct, format, dir,
	publicPath, prefixPath,
	buildFolder, outputFolder,
	staticFolder, templateFolder,
	cssStyleLoader, cssModuleLoader,
	postStyleLoader, lessStyleLoader,
	isProd, ver, min, ts, styleLoader,
	lib: {
		/* jquery: [
			`jquery/dist/jquery${min}`,
			`jquery-ui-dist/jquery-ui${min}`,
		],*/
	},
	ipt: {
		shim: [
			"es5-shim", // 支持 IE8 所必须,且顺序在babel-polyfill前
			"es5-shim/es5-sham",
			"console-polyfill",
			"babel-polyfill",
			"media-match", // 支持 antd 所必须
		],
		public: dir("src/utils/public.js"),
	},
	cdn: {
		jquery: "$",
	},
	html: {
		title: "",
		ico: `${prefixPath}favicon.ico`,
		js: [
			`${bootcdn}pace/1.0.2/pace.min.js`,
			`${bootcdn}jquery/1.12.4/jquery.min.js`,
			`${bootcdn}jqueryui/1.12.1/jquery-ui.min.js`,
			`${bootcdn}fastclick/1.0.6/fastclick.min.js`,
		],
		css: [
			`${bootcdn}normalize/7.0.0/normalize.min.css`,
			`${bootcdn}font-awesome/4.7.0/css/font-awesome.min.css`,
			`${elecdn}vant@1.1.7/lib/vant-css/index.css`,
			`antd/antd-1.x.min.css`,
		],
		proxy: {
			"/abc": {
				target: "http://abc.com",
				secure: false,
				changeOrigin: true,
			},
			"/xyz": {
				target: "https://xyz.com",
				secure: true,
				changeOrigin: true,
				pathRewrite: { "^/xyz": "/abc" },
				bypass: (req, res, next) => {
					if (req.method === "GET") {
						const url = req.url.slice(4);
						const isHTML = /^(\/[^/]+)?\/[^/]+\.html/i.test(url);
						const isFILE = /^\/(static|data|css|img|js)\//.test(url);
						if (isHTML || isFILE) {
							return req.originalUrl;
						}
					}
				},
				onProxyRes: (proxyRes, req, res) => {
					const url = req.url.slice(4);
					if (/logout/i.test(url) && req.method === "GET") {
						proxyRes.headers.location = "/xyz/login.html";
					} else if (/login/i.test(url) && req.method === "POST") {
						proxyRes.headers.location = "/xyz/index.html";
					}
				},
			},
		},
	},
};
entry.html.chunks = Object.keys(entry.ipt);
module.exports = entry;

const css = [];
if (css.length) {
	delete entry.page;
	delete entry.dll;
	delete entry.ipt;
	const map = {};
	css.forEach(v => v && (map[v] = "@/styles/" + v));
	entry.ipt = map;
}