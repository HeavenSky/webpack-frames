const webpack = require("webpack");
const ErrFmt = require("friendly-errors-webpack-plugin");
const { scssStyleLoader, lessStyleLoader, cssStyleLoader,
	cssModuleLoader, styleLoader } = require("./loader");
const { IE_SHIM, WK, dir } = require("./basic");
const { httpMock } = require("./mock");
const optSelf = require("./opt.self");
const { staticFolder, mockApiFolder, proxy } = optSelf;
const optDev = {
	devtool: "eval-source-map",
	module: {},
	plugins: [
		new ErrFmt(),
		// new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	],
	devServer: {
		historyApiFallback: true,
		watchContentBase: true,
		disableHostCheck: true,
		compress: true,
		hotOnly: true,
		noInfo: true,
		https: false,
		quiet: false,
		open: false,
		hot: true, // 热重载inline必须为true
		port: 8888,
		host: "0.0.0.0",
		publicPath: "/",
		clientLogLevel: "error",
		proxy, inline: !IE_SHIM, // ie11以下不支持inline
		contentBase: dir(staticFolder),
		before: app => httpMock(app, dir(mockApiFolder)),
	},
};
if (WK === 1) {
	optDev.plugins.push(new webpack.NamedModulesPlugin());
	optDev.devServer.setup = optDev.devServer.before;
	delete optDev.devServer.before; // WK=1用setup其他before
	optDev.module.loaders = [{
		test: /_\.css(\?.*)?$/i,
		loaders: [
			styleLoader,
			cssModuleLoader,
			"postcss-loader",
		],
	}, {
		test: /[^_]\.css(\?.*)?$/i,
		loaders: [
			styleLoader,
			cssStyleLoader,
			"postcss-loader",
		],
	}, {
		test: /_\.less(\?.*)?$/i,
		loaders: [
			styleLoader,
			cssModuleLoader,
			"postcss-loader",
			lessStyleLoader,
		],
	}, {
		test: /[^_]\.less(\?.*)?$/i,
		loaders: [
			styleLoader,
			cssStyleLoader,
			"postcss-loader",
			lessStyleLoader,
		],
	}, {
		test: /_\.scss(\?.*)?$/i,
		loaders: [
			styleLoader,
			cssModuleLoader,
			"postcss-loader",
			scssStyleLoader,
		],
	}, {
		test: /[^_]\.scss(\?.*)?$/i,
		loaders: [
			styleLoader,
			cssStyleLoader,
			"postcss-loader",
			scssStyleLoader,
		],
	}];
} else if (WK === 3) {
	optDev.plugins.push(new webpack.NamedModulesPlugin());
	optDev.module.rules = [{
		test: /\.css(\?.*)?$/i,
		oneOf: [{
			resourceQuery: /\bmodule\b/i,
			use: [
				styleLoader,
				cssModuleLoader,
				"postcss-loader",
			],
		}, {
			use: [
				styleLoader,
				cssStyleLoader,
				"postcss-loader",
			],
		}],
	}, {
		test: /\.less(\?.*)?$/i,
		oneOf: [{
			resourceQuery: /\bmodule\b/i,
			use: [
				styleLoader,
				cssModuleLoader,
				"postcss-loader",
				lessStyleLoader,
			],
		}, {
			use: [
				styleLoader,
				cssStyleLoader,
				"postcss-loader",
				lessStyleLoader,
			],
		}],
	}, {
		test: /\.scss(\?.*)?$/i,
		oneOf: [{
			resourceQuery: /\bmodule\b/i,
			use: [
				styleLoader,
				cssModuleLoader,
				"postcss-loader",
				scssStyleLoader,
			],
		}, {
			use: [
				styleLoader,
				cssStyleLoader,
				"postcss-loader",
				scssStyleLoader,
			],
		}],
	}];
}

module.exports = optDev;