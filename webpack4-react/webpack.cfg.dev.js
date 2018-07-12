
const webpack = require("webpack");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const iniConfig = require("./webpack.ini");
const { dir, staticFolder } = iniConfig;

const developmentConfig = {
	// devtool: "cheap-eval-source-map",
	devtool: "cheap-module-eval-source-map",
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