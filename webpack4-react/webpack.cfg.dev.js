
const webpack = require("webpack");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const iniConfig = require("./webpack.ini");
const { staticFolder, dir, ver } = iniConfig;

const developmentConfig = {
	// devtool: "cheap-eval-source-map",
	devtool: "cheap-module-eval-source-map",
	output: {
		filename: `js/[name]${ver}[hash:5].js`,
		chunkFilename: `js/[name]${ver}[hash:5].js`,
		/* 这里本来应该是[chunkhash]的，但是由于[chunkhash]和webpack-dev-server --hot不兼容。只能妥协*/
	},
	plugins: [
		new FriendlyErrorsPlugin(),
		// new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	],
	devServer: {
		contentBase: dir(staticFolder),
		historyApiFallback: true,
		watchContentBase: true,
		compress: true,
		hotOnly: true,
		inline: false, // ie11以下不支持inline
		noInfo: true,
		https: false,
		quiet: false,
		open: false,
		hot: true,
		clientLogLevel: "error",
		publicPath: "/",
		host: "0.0.0.0",
		port: 8888,
		proxy: iniConfig.html.proxy,
	},
};

module.exports = developmentConfig;