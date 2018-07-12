const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const {
	ver, outputFolder, styleLoader,
	cssStyleLoader, cssModuleLoader,
	postStyleLoader, lessStyleLoader,
} = require("./webpack.ini");

const productionConfig = {
	// devtool: "source-map",
	devtool: false,
	module: {
		rules: [
			{
				test: /\.css(\?.*)?$/i,
				oneOf: [{
					resourceQuery: /\bmodule\b/i,
					use: ExtractTextPlugin.extract({
						fallback: styleLoader,
						use: [
							cssModuleLoader,
							postStyleLoader,
						],
					}),
				}, {
					use: ExtractTextPlugin.extract({
						fallback: styleLoader,
						use: [
							cssStyleLoader,
							postStyleLoader,
						],
					}),
				}],
			},
			{
				test: /\.less(\?.*)?$/i,
				oneOf: [{
					resourceQuery: /\bmodule\b/i,
					use: ExtractTextPlugin.extract({
						fallback: styleLoader,
						use: [
							cssModuleLoader,
							postStyleLoader,
							lessStyleLoader,
						],
					}),
				}, {
					use: ExtractTextPlugin.extract({
						fallback: styleLoader,
						use: [
							cssStyleLoader,
							postStyleLoader,
							lessStyleLoader,
						],
					}),
				}],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin([outputFolder]),
		new webpack.DefinePlugin({
			"process.env": {
				"NODE_ENV": JSON.stringify("production"),
			},
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HashedModuleIdsPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new UglifyJSPlugin({
			cache: true,
			parallel: true,
			sourceMap: false,
			uglifyOptions: {
				warnings: false,
				compress: { drop_console: true },
			},
		}),
		new ExtractTextPlugin({
			allChunks: true,
			filename: `css/[name]${ver.replace(
				/(chunk|content|module)?hash/gi,
				"contenthash"
			)}.css`,
		}),
	],
};

module.exports = productionConfig;