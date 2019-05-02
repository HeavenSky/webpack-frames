const webpack = require("webpack");
const ErrFmt = require("friendly-errors-webpack-plugin");
const { httpMock } = require("./browser");
const iniConfig = require("./webpack.ini");
const { dir, staticFolder } = iniConfig;

const developmentConfig = {
	devtool: "eval-source-map",
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
		inline: !iniConfig.ie,
		// ie11以下不支持inline,热重载inline必须为true
		https: false,
		quiet: false,
		open: false,
		hot: true,
		port: 8888,
		host: "0.0.0.0",
		publicPath: "/",
		clientLogLevel: "error",
		proxy: iniConfig.html.proxy,
		contentBase: dir(staticFolder),
		// webpack1使用setup,webpack3使用before
		before: app => httpMock(app, "src/mock"),
	},
};

module.exports = developmentConfig;