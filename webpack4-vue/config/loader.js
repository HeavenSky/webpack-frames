const { PROD, WK, dpv, keys, calc } = require("./basic");
// https://github.com/vuejs/vue-style-loader#options
// https://github.com/webpack-contrib/style-loader#options
// https://github.com/webpack-contrib/css-loader#options
// https://github.com/webpack-contrib/sass-loader#options
// https://github.com/webpack-contrib/less-loader 找options
const parseUrl = false; // 是否使用样式的相对路径解析
const styleLoader = {
	loader: "style-loader", options: { sourceMap: !PROD },
};
const cssStyleLoader = {
	loader: "css-loader",
	options: {
		import: parseUrl, url: parseUrl,
		sourceMap: !PROD, modules: false,
	},
};
const localIdentName = "[name]_[local]_[hash:base64:5]";
const cssModuleLoader = {
	loader: "css-loader",
	options: {
		import: parseUrl, url: parseUrl,
		sourceMap: !PROD, modules: { localIdentName },
	},
};
const scssStyleLoader = {
	loader: "sass-loader", options: { sourceMap: !PROD },
}; // loader 在调用的时候才会去执行,不安装不调用时不会出错的
const lessStyleLoader = {
	loader: "less-loader",
	options: { // 默认 antd/lib/style/themes/default.less
		javascriptEnabled: true,
		sourceMap: !PROD, relativeUrls: parseUrl,
		globalVars: { "@up": "red" }, // 变量写入文件顶部
		modifyVars: { "@to": "tan" }, // 变量写入文件底部
	}, // "@hack": `true; @import "${dir("src/mixin")}"`,
}; // https://github.com/less/less.js/blob/master/bin/lessc
const cfg = { cacheDirectory: true };
const loaders = {
	styleLoader, cssStyleLoader, cssModuleLoader,
	scssStyleLoader, lessStyleLoader, cfg,
};
if (WK < 2) { // webpack1压缩样式:less成功,css失败
	lessStyleLoader.options.ieCompat = true;
	keys(loaders).forEach(k => {
		const { loader, options } = loaders[k] || {};
		if (!loader || !options) { return; }
		loaders[k] = loader + "?" + JSON.stringify(options);
	}); // webpack1仅支持字符串形式的loader
} else {
	calc("sass-loader") < 8 || delete scssStyleLoader.options.sourceMap;
	calc("style-loader") < 1 || delete styleLoader.options.sourceMap;
	dpv("vue-loader") && (styleLoader.loader = "vue-style-loader");
	const isVue = dpv("@vue/babel-preset-app"); // https://babeljs.io/docs/en/babel-preset-env
	const opt = { corejs: { version: 3, proposals: true }, modules: false, useBuiltIns: "entry" };
	cfg.presets = isVue ? [["@vue/app", opt]] : [["@babel/env", opt], "@babel/react"];
	cfg.plugins = [ // https://github.com/babel/babel/blob/master/packages/babel-preset-stage-0
		"@babel/proposal-function-bind", // Stage 0
		"@babel/proposal-do-expressions", // Stage 1
		"@babel/proposal-export-default-from",
		"@babel/proposal-logical-assignment-operators",
		["@babel/proposal-optional-chaining", { loose: false }],
		["@babel/proposal-pipeline-operator", { proposal: "minimal" }],
		["@babel/proposal-nullish-coalescing-operator", { loose: false }],
		"@babel/proposal-function-sent", // Stage 2
		"@babel/proposal-numeric-separator",
		"@babel/proposal-throw-expressions",
		"@babel/proposal-export-namespace-from",
		["@babel/proposal-decorators", { legacy: true }],
		"@babel/syntax-import-meta", // Stage 3
		"@babel/syntax-dynamic-import",
		"@babel/proposal-json-strings",
		["@babel/proposal-class-properties", { loose: true }],
		// https://babeljs.io/docs/en/babel-plugin-transform-runtime
		["@babel/transform-runtime", { corejs: 3 }],
	].concat(["antd", "antd-mobile", "vant"].map(k => ["import", { libraryName: k, style: false }, k]));
}
module.exports = loaders;