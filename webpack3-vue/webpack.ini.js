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
// 路径常量请尽可能以`/`结尾 webpackConfig.output.publicPath
const publicPath = "";
const prefixAjax = "";
const buildFolder = "build";
const outputFolder = "dist";
const staticFolder = "src/static";
const templateFolder = "src/views";
// https://github.com/webpack-contrib/style-loader#options
// https://github.com/vuejs/vue-style-loader
const styleLoader = {
	loader: "vue-style-loader",
	options: {
		sourceMap: true,
	},
};
// https://github.com/webpack-contrib/css-loader#options
const cssStyleLoader = {
	loader: "css-loader",
	options: {
		modules: false,
		minimize: true,
		sourceMap: true,
	},
};
const cssModuleLoader = {
	loader: "css-loader",
	options: {
		modules: true,
		minimize: true,
		sourceMap: true,
		localIdentName: "[name]_[local]_[hash:base64:5]",
	},
};
// https://github.com/postcss/postcss-loader#options
const postStyleLoader = "postcss-loader";
// 若使用 postcss.config.js 则 postcss-loader 需删除 options
// https://github.com/webpack-contrib/less-loader
const lessStyleLoader = {
	loader: "less-loader",
	options: {
		javascriptEnabled: true,
		minimize: true,
		sourceMap: true,
		modifyVars: {
			"@primary-color": "#39c6cd",
			"@icon-url": JSON.stringify("/antd/antd"),
		},
	},
};
// https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less

const entry = {
	page: [""],
	distinct, format, dir,
	publicPath, prefixAjax,
	buildFolder, outputFolder,
	staticFolder, templateFolder,
	cssStyleLoader, cssModuleLoader,
	postStyleLoader, lessStyleLoader,
	isProd, ver, min, ts, styleLoader,
	dll: {
		shim: [
			"babel-polyfill",
		],
		common: [
			"axios",
			"moment",
			"numeral",
			"signals",
			"js-cookie",
			"nprogress",
			"pubsub-js",
			"moment/locale/zh-cn",
		],
		vendor: [
			"vue",
			"vuex",
			"vue-router",
		],
	},
	lib: {
		/* jquery: [
			`jquery/dist/jquery${min}`,
			`jquery-ui-dist/jquery-ui${min}`,
		],*/
	},
	ipt: {
		public: [
			"babel-polyfill",
			dir("src/utils/public.js"),
		],
	},
	cdn: {
		jquery: "$",
	},
	html: {
		title: "",
		ico: `favicon.ico`,
		js: [
			`${bootcdn}pace/1.0.2/pace.min.js`,
			`${bootcdn}jquery/1.12.4/jquery.min.js`,
			`${bootcdn}jqueryui/1.12.1/jquery-ui.min.js`,
			`${bootcdn}fastclick/1.0.6/fastclick.min.js`,
		],
		css: [
			`${bootcdn}normalize/7.0.0/normalize.min.css`,
			`${bootcdn}element-ui/2.4.0/theme-chalk/index.css`,
			`${bootcdn}font-awesome/4.7.0/css/font-awesome.min.css`,
			`${elecdn}vant@1.1.7/lib/vant-css/index.css`,
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
	if (cssStyleLoader.options) {
		cssStyleLoader.options.url = false;
	} else {
		entry.cssStyleLoader = cssStyleLoader + "&url=false";
	}
	const map = {};
	css.forEach(v => v && (map[v] = "@/styles/" + v));
	entry.ipt = map;
	delete entry.dll;
	delete entry.page;
}