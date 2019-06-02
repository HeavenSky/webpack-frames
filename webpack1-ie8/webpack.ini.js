const { NODE_ENV, PKG_CSS, DIR_SVC, IE_SHIM } = process.env;
const path = require("path");
const pkg = require("./package.json");
const isProd = NODE_ENV === "production";
const ver = isProd ? ".[hash:5]" : "-" + pkg.version;
const min = isProd ? ".min" : "";
const ts = Date.now();
const rel = path.relative.bind(path);
const dir = path.join.bind(path, __dirname);
const dst = v => Array.isArray(v) ? [...new Set(v)] : [];
const fmt = (f, app) => f instanceof Function ? f(app) : f;

// https://unpkg.com/pkg/ https://jsdelivr.com/package/npm/
const bootcdn = "https://cdn.bootcss.com/";
const sfile = "https://cdn.staticfile.org/";
const cdnjs = "https://cdnjs.cloudflare.com/ajax/libs/";
const pkgcdn = "https://cdn.jsdelivr.net/npm/";
const ghcdn = "https://cdn.jsdelivr.net/gh/";
const wpcdn = "https://cdn.jsdelivr.net/wp/";
const elecdn = "https://npm.elemecdn.com/";
dst([cdnjs, sfile, bootcdn, elecdn, wpcdn, ghcdn, pkgcdn]);
// 路径常量请尽可能以`/`结尾 webpackConfig.output.publicPath
const publicPath = undefined;
const prefixAjax = undefined;
const buildFolder = "build";
const outputFolder = "dist";
const staticFolder = "static";
const templateFolder = "src/views";

const cssUrl = false;
// https://github.com/webpack-contrib/style-loader#options
const styleLoader = {
	loader: "style-loader",
	options: { sourceMap: !isProd },
};
// https://github.com/webpack-contrib/css-loader#options
const cssStyleLoader = {
	loader: "css-loader",
	options: {
		url: cssUrl,
		modules: false,
		sourceMap: !isProd,
	},
};
const cssModuleLoader = {
	loader: "css-loader",
	options: {
		url: cssUrl,
		modules: true,
		sourceMap: !isProd,
		localIdentName: "[name]_[local]_[hash:base64:5]",
	},
};
// https://github.com/webpack-contrib/sass-loader
const scssStyleLoader = {
	loader: "sass-loader",
	options: { sourceMap: !isProd },
};
// npm i -D node-sass sass-loader 易出错可配镜像后卸载再试
// loader 在调用的时候才会去执行,因此不安装不调用是不会出错的
// https://github.com/webpack-contrib/less-loader
const lessStyleLoader = {
	loader: "less-loader",
	options: {
		sourceMap: !isProd,
		relativeUrls: cssUrl,
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
if ("vue-loader" in dps) {
	// https://github.com/vuejs/vue-style-loader
	styleLoader.loader = "vue-style-loader";
}
const calc = key => parseFloat((dps[key] || "")
	.replace(/[^.\d]+/g, ""));
const pair = (key, gap) => (gap ? key + gap : "") +
	(dps[key] || "").replace(/[^.\d]+/g, "");

// ie8 在引入 babel-polyfill 前必须先引入 es5-shim
const polyfill = calc("babel-loader") ? ["babel-polyfill"]
	: calc("@babel/polyfill") ? ["@babel/polyfill"] : [];
// ie9 支持 react16 必须引入 raf/polyfill
calc("react") >= 16 && polyfill.push("raf/polyfill");
// ie9 支持 antd 必须引入 media-match
calc("antd") && polyfill.push("media-match");
const entry = {
	page: [""],
	calc, pair,
	rel, dir, dst, fmt,
	publicPath, prefixAjax,
	buildFolder, outputFolder,
	staticFolder, templateFolder,
	cssStyleLoader, cssModuleLoader,
	scssStyleLoader, lessStyleLoader,
	isProd, ver, min, ts, styleLoader,
	/* lib: {
		jquery: ["jquery", "jquery-ui"]
			.map(v => `./js/${v}.min`),
		ie8: ["es5-shim", "es5-sham", "html5shiv",
			"selectivizr", "nwmatcher", "respond"]
			.map(v => `./ie8/${v}.min`),
	}, */
	ipt: {
		public: [...polyfill, dir("src/utils/public.js")]
			.slice(isProd || IE_SHIM ? 0 : -1),
	},
	cdn: {
		jquery: "$",
		wangeditor: "wangEditor",
	},
	html: {
		title: "",
		ico: "favicon.ico",
		js: [
			"js/jquery.min.js",
			"js/jquery-ui.min.js",
			"editor/wangeditor.min.js",
			!"js/pace.min.js",
			!"js/fastclick.min.js",
			!"js/wangeditor.min.js",
		],
		css: [
			"css/normalize-ie8.min.css",
			"editor/wangeditor.min.css",
			"antd/antd-1.11.6.css",
			!"fa/fa-4.x.min.css",
			// highlight.js
			!`${bootcdn}highlight.js/9.15.6/styles/atom-one-light.min.css`,
			!`${bootcdn}highlight.js/9.15.6/styles/atom-one-dark.min.css`,
			!`${bootcdn}highlight.js/9.15.6/highlight.min.js`,
			// antd-mobile
			!`${pkgcdn + pair("antd-mobile", "@")}/dist/antd-mobile.min.css`,
			!`${pkgcdn + pair("antd-mobile", "@")}/dist/antd-mobile.min.js`,
			// antd
			!`${pkgcdn + pair("antd", "@")}/dist/antd.min.css`,
			!`${pkgcdn + pair("antd", "@")}/dist/antd.min.js`,
		],
		// https://webpack.docschina.org/configuration/dev-server
		// https://github.com/chimurai/http-proxy-middleware#options
		proxy: {},
	},
};

// webpack1对于非字符串形式的loader报莫名其妙错误
// webpack1打包样式css压缩对于less文件有效,但是css文件莫名失败
const shimLoader = key => {
	const { loader, options } = entry[key] || {};
	loader && (entry[key] = loader);
	options && (entry[key] += "?" +
		JSON.stringify(options));
};
if (calc("webpack") < 2) {
	shimLoader("styleLoader");
	shimLoader("cssStyleLoader");
	shimLoader("cssModuleLoader");
	shimLoader("scssStyleLoader");
	shimLoader("lessStyleLoader");
}

if (isProd) { // PKG_CSS=star.css,ruler.less npm run dst
	if (PKG_CSS/* 纯打包编译样式文件 */) {
		const styles = PKG_CSS.split(",");
		entry.ipt = { ...styles.map(v => "@/" + v) };
		delete entry.page;
		delete entry.dll;
	}
} else if (DIR_SVC/* 使用静态文件服务器 */) {
	// 生产包做静态服务器 DIR_SVC=dist npm start
	+DIR_SVC || (entry.staticFolder = DIR_SVC);
	entry.ipt = { u: "@/utils/fns" };
	delete entry.page;
	delete entry.dll;
} else if (IE_SHIM/* 兼容 IE 浏览器 */) {
	entry.ie = true;
}
entry.html.chunks = Object.keys(entry.ipt || {});
module.exports = entry;