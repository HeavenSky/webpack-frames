const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const {
	ver, scssStyleLoader, lessStyleLoader,
	styleLoader, cssStyleLoader, cssModuleLoader,
} = require("./webpack.ini");

const productionConfig = {
	devtool: false, // "source-map",
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
							"postcss-loader",
						],
					}),
				}, {
					use: ExtractTextPlugin.extract({
						fallback: styleLoader,
						use: [
							cssStyleLoader,
							"postcss-loader",
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
							"postcss-loader",
							lessStyleLoader,
						],
					}),
				}, {
					use: ExtractTextPlugin.extract({
						fallback: styleLoader,
						use: [
							cssStyleLoader,
							"postcss-loader",
							lessStyleLoader,
						],
					}),
				}],
			},
			{
				test: /\.scss(\?.*)?$/i,
				oneOf: [{
					resourceQuery: /\bmodule\b/i,
					use: ExtractTextPlugin.extract({
						fallback: styleLoader,
						use: [
							cssModuleLoader,
							"postcss-loader",
							scssStyleLoader,
						],
					}),
				}, {
					use: ExtractTextPlugin.extract({
						fallback: styleLoader,
						use: [
							cssStyleLoader,
							"postcss-loader",
							scssStyleLoader,
						],
					}),
				}],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production"),
			},
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HashedModuleIdsPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new UglifyJsPlugin({
			cache: true,
			parallel: true,
			sourceMap: false,
			uglifyOptions: {
				ie8: false,
				safari10: false,
				warnings: false,
				output: { comments: false },
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