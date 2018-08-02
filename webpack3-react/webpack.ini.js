const { NODE_ENV } = process.env;
const pkg = require("./package.json");
const isProd = NODE_ENV === "production";
const ver = isProd ? ".[hash:5]" : "-" + pkg.version;
const min = isProd ? ".min" : "";
const ts = new Date().getTime();
const path = require("path");
const rel = path.relative.bind(path);
const dir = path.join.bind(path, __dirname);
const dst = v => v ? [...new Set(v)] : [];
const fmt = (f, app) => "" + f === f ? f : f(app);

const bootcdn = "https://cdn.bootcss.com/";
const elecdn = "https://npm.elemecdn.com/";
// 路径常量请尽可能以`/`结尾 webpackConfig.output.publicPath
const publicPath = undefined;
const prefixAjax = undefined;
const buildFolder = "build";
const outputFolder = "dist";
const staticFolder = "src/static";
const templateFolder = "src/views";

// https://github.com/webpack-contrib/style-loader#options
const styleLoader = {
	loader: "style-loader",
	options: { sourceMap: !isProd },
};
// https://github.com/webpack-contrib/css-loader#options
const cssStyleLoader = {
	loader: "css-loader",
	options: {
		url: false,
		modules: false,
		minimize: isProd,
		sourceMap: !isProd,
	},
};
const cssModuleLoader = {
	loader: "css-loader",
	options: {
		url: false,
		modules: true,
		minimize: isProd,
		sourceMap: !isProd,
		localIdentName: "[name]_[local]_[hash:base64:5]",
	},
};
// https://github.com/postcss/postcss-loader#options
const postStyleLoader = "postcss-loader";
// 若使用 postcss.config.js 则 postcss-loader 不能携带 options
// https://github.com/webpack-contrib/less-loader
const lessStyleLoader = {
	loader: "less-loader",
	options: {
		minimize: isProd,
		sourceMap: !isProd,
		relativeUrls: false,
		javascriptEnabled: true,
		modifyVars: {
			"@primary-color": "#409eff",
			"@icon-url": JSON.stringify("../antd/antd"),
		},
	},
};
// https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
const dps = Object.assign(
	{}, pkg.dependencies,
	pkg.devDependencies
);
const verDps = key => parseFloat(
	String(dps[key]).replace(/[^.\d]+/g, "")
);
if (verDps("vue-loader")) {
	// https://github.com/vuejs/vue-style-loader
	styleLoader.loader = "vue-style-loader";
}

const entry = {
	page: [""],
	rel, dir, dst, fmt,
	publicPath, prefixAjax,
	buildFolder, outputFolder,
	staticFolder, templateFolder,
	cssStyleLoader, cssModuleLoader,
	postStyleLoader, lessStyleLoader,
	isProd, ver, min, ts, styleLoader,
	dll: {
		shim: [
			"babel-polyfill",
			"raf/polyfill",
			"media-match",
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
			"redux",
			"react",
			"react-dom",
			"react-redux",
			"react-router-dom",
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
			"raf/polyfill", // 支持 react16 所必须
			"media-match", // 支持 antd 所必须
			dir("src/utils/public.js"),
		],
	},
	cdn: {
		jquery: "$",
		wangeditor: "wangEditor",
	},
	html: {
		title: "",
		ico: `favicon.ico`,
		js: [
			`${bootcdn}jquery/1.12.4/jquery.min.js`,
			`${bootcdn}jqueryui/1.12.1/jquery-ui.min.js`,
			`${bootcdn}wangEditor/3.1.1/wangEditor.min.js`,
			`${bootcdn}fastclick/1.0.6/fastclick.min.js` > 0,
			`${bootcdn}pace/1.0.2/pace.min.js` > 0,
		],
		css: [
			`${bootcdn}normalize/7.0.0/normalize.min.css`,
			`${bootcdn}font-awesome/4.7.0/css/font-awesome.min.css`,
			// highlight.js
			`${bootcdn}highlight.js/9.12.0/styles/atom-one-light.min.css` > 0,
			`${bootcdn}highlight.js/9.12.0/highlight.min.js` > 0,
			// vant
			`${elecdn}vant@1.1.14/lib/vant-css/index.css` > 0,
			`${elecdn}vant@1.1.14/lib/vant.min.js` > 0,
			// antd
			`${bootcdn}antd/3.5.4/antd.min.css` > 0,
			`antd/antd-3.x.min.css`,
			// wangeditor 2.x
			`editor/wangeditor.min.css` > 0,
			`editor/wangeditor.min.js` > 0,
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
	const map = {};
	css.forEach(v => v && (map[v] = "@/static/" + v));
	entry.ipt = map;
	delete entry.dll;
	delete entry.page;
}