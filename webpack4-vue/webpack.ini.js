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
// https://github.com/webpack-contrib/sass-loader
const scssStyleLoader = {
	loader: "sass-loader",
	options: {
		minimize: isProd,
		sourceMap: !isProd,
	},
};
// npm i -D node-sass sass-loader 易出错可配镜像后卸载再试
// loader 在调用的时候才会去执行,因此不安装不调用是不会出错的
// https://github.com/webpack-contrib/less-loader
const lessStyleLoader = {
	loader: "less-loader",
	options: {
		minimize: isProd,
		sourceMap: !isProd,
		relativeUrls: false,
		javascriptEnabled: true,
		modifyVars: {
			"@icon-url": JSON.stringify("../antd/antd"),
			"@primary-color": "#409eff",
			"@menu-dark-bg": "#404040",
			"@menu-highlight-color": "#39c6cd",
			"@menu-dark-item-active-bg": "#39c6cd",
			"@menu-dark-item-selected-bg": "#39c6cd",
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
	scssStyleLoader, lessStyleLoader,
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
	/* lib: {
		jquery: ["jquery", "jquery-ui"]
			.map(v => `./js/${v}.min`),
		ie8: ["es5-shim", "es5-sham", "html5shiv",
			"selectivizr", "nwmatcher", "respond"]
			.map(v => `./ie8/${v}.min`),
	}, */
	ipt: {
		public: [
			"babel-polyfill", // ie8 必须提前引入 es5-shim
			dir("src/utils/public.js"),
		].slice(isProd - 1), // 加快开发环境编译速度
	},
	cdn: {
		jquery: "$",
		wangeditor: "wangEditor",
	},
	html: {
		title: "",
		ico: `favicon.ico`,
		js: [
			`js/jquery.min.js`,
			`js/jquery-ui.min.js`,
			`editor/wangeditor.min.js`,
			!`js/pace.min.js`,
			!`js/fastclick.min.js`,
			!`js/wangeditor.min.js`,
		],
		css: [
			`css/normalize-ie8.min.css`,
			`editor/wangeditor.min.css`,
			`css/fa-4.x.min.css`,
			`${bootcdn}element-ui/2.4.0/theme-chalk/index.css`,
			// highlight.js
			!`${bootcdn}highlight.js/9.12.0/styles/atom-one-light.min.css`,
			!`${bootcdn}highlight.js/9.12.0/styles/atom-one-dark.min.css`,
			!`${bootcdn}highlight.js/9.12.0/highlight.min.js`,
			// vant
			!`${elecdn}vant@1.1.15/lib/vant-css/index.css`,
			!`${elecdn}vant@1.1.15/lib/vant.min.js`,
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

if (isProd) {
	const style = []; // 需要编译的样式 css less
	if (style.length) {
		const map = {};
		style.forEach(v => v && (map[v] = "@/static/" + v));
		entry.ipt = map;
		delete entry.dll;
		delete entry.page;
	}
} else {
	const serve = 0; // 是否做纯静态服务器
	if (serve) {
		delete entry.ipt;
		delete entry.dll;
		delete entry.page;
	}
}
entry.html.chunks = Object.keys(entry.ipt || {});
module.exports = entry;