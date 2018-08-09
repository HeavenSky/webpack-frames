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

// webpack1对于非字符串形式的loader报莫名其妙错误
// webpack1打包样式css压缩对于less文件有效,但是css文件莫名失败
let opts = { sourceMap: !isProd };
// https://github.com/webpack-contrib/style-loader#options
const styleLoader = "style-loader?" + JSON.stringify(opts);
opts = {
	url: false,
	modules: false,
	minimize: isProd,
	sourceMap: !isProd,
};
// https://github.com/webpack-contrib/css-loader#options
const cssStyleLoader = "css-loader?" + JSON.stringify(opts);
opts = {
	url: false,
	modules: true,
	minimize: isProd,
	sourceMap: !isProd,
	localIdentName: "[name]_[local]_[hash:base64:5]",
};
const cssModuleLoader = "css-loader?" + JSON.stringify(opts);
// https://github.com/postcss/postcss-loader#options
const postStyleLoader = "postcss-loader";
// 若使用 postcss.config.js 则 postcss-loader 不能携带 options
opts = {
	minimize: isProd,
	sourceMap: !isProd,
	relativeUrls: false,
	javascriptEnabled: true,
	modifyVars: {
		"@primary-color": "#409eff",
		"@icon-url": JSON.stringify("../antd/antd"),
	},
};
// https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
// https://github.com/webpack-contrib/less-loader
const lessStyleLoader = "less-loader?" + JSON.stringify(opts);

const entry = {
	page: [""],
	rel, dir, dst, fmt,
	publicPath, prefixAjax,
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
		public: [
			"babel-polyfill", // ie8 必须提前引入es5-shim
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
			`editor/wangeditor.min.js`,
			!`${bootcdn}wangEditor/3.1.1/wangEditor.min.js`,
			!`${bootcdn}fastclick/1.0.6/fastclick.min.js`,
			!`${bootcdn}pace/1.0.2/pace.min.js`,
		],
		css: [
			`${bootcdn}normalize/7.0.0/normalize.min.css`,
			`${bootcdn}font-awesome/4.7.0/css/font-awesome.min.css`,
			`editor/wangeditor.min.css`,
			`antd/antd-1.x.min.css`,
			// highlight.js
			!`${bootcdn}highlight.js/9.12.0/styles/atom-one-light.min.css`,
			!`${bootcdn}highlight.js/9.12.0/highlight.min.js`,
			// vant
			!`${elecdn}vant@1.1.15/lib/vant-css/index.css`,
			!`${elecdn}vant@1.1.15/lib/vant.min.js`,
			// antd
			!`${bootcdn}antd/1.11.6/antd.min.css`,
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