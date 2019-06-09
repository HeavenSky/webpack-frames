const { PROD, WK, dpv } = require("./basic");

const urlRel = false; // 是否使用样式的相对路径解析
// https://github.com/webpack-contrib/style-loader#options
const styleLoader = {
	loader: "style-loader",
	options: { sourceMap: !PROD },
};
// https://github.com/webpack-contrib/css-loader#options
const cssStyleLoader = {
	loader: "css-loader",
	options: {
		url: urlRel,
		modules: false,
		sourceMap: !PROD,
	},
};
const cssModuleLoader = {
	loader: "css-loader",
	options: {
		url: urlRel,
		modules: true,
		sourceMap: !PROD,
		localIdentName: "[name]_[local]_[hash:base64:5]",
	},
};
// https://github.com/webpack-contrib/sass-loader
const scssStyleLoader = {
	loader: "sass-loader",
	options: { sourceMap: !PROD },
};
// npm i -D node-sass sass-loader 易出错可配镜像后卸载再试
// loader 在调用的时候才会去执行,因此不安装不调用也不会出错的
// https://github.com/webpack-contrib/less-loader
const lessStyleLoader = {
	loader: "less-loader",
	options: {
		sourceMap: !PROD,
		relativeUrls: urlRel,
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
}; // 默认主题路径 antd/lib/style/themes/default.less
const loaders = {
	scssStyleLoader, lessStyleLoader,
	styleLoader, cssStyleLoader, cssModuleLoader,
};
// webpack1对于非字符串形式的loader报莫名其妙错误
// webpack1打包样式css压缩对于less文件有效,但是css文件莫名失败
if (WK === 1) {
	lessStyleLoader.options.ieCompat = true;
	const shimLoader = key => {
		const { loader, options } = loaders[key] || {};
		loader && (loaders[key] = loader);
		const query = "?" + JSON.stringify(options);
		options && (loaders[key] += query);
	};
	shimLoader("styleLoader");
	shimLoader("cssStyleLoader");
	shimLoader("cssModuleLoader");
	shimLoader("scssStyleLoader");
	shimLoader("lessStyleLoader");
} else if (dpv("vue-loader")) {
	styleLoader.loader = "vue-style-loader";
} // https://github.com/vuejs/vue-style-loader
module.exports = loaders;