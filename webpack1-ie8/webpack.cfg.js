const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const {
	outputFolder, ver,
	cssStyleLoader, cssModuleLoader,
	postStyleLoader, lessStyleLoader,
} = require("./webpack.ini");

const extractLoader = new ExtractTextPlugin(
	`css/[name]${ver.replace(
		/(chunk|content|module)?hash/gi,
		"contenthash"
	)}.css`,
	{ allChunks: true }
);
const productionConfig = {
	// devtool: "source-map",
	devtool: false,
	module: {
		loaders: [
			{
				test: /_\.css(\?.*)?$/i,
				loader: extractLoader.extract(
					cssModuleLoader,
					postStyleLoader
				),
			},
			{
				test: /[^_]\.css(\?.*)?$/i,
				loader: extractLoader.extract(
					cssStyleLoader,
					postStyleLoader
				),
			},
			// 这里不需要 style-loader, 加了反而报错
			// less在生产环境的编译配置很特殊 https://github.com/webpack-contrib/extract-text-webpack-plugin/blob/webpack-1/README.md
			{
				test: /_\.less(\?.*)?$/i,
				loader: extractLoader.extract([
					cssModuleLoader,
					postStyleLoader,
					lessStyleLoader,
				]),
			},
			{
				test: /[^_]\.less(\?.*)?$/i,
				loader: extractLoader.extract([
					cssStyleLoader,
					postStyleLoader,
					lessStyleLoader,
				]),
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
		// new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		// new webpack.HashedModuleIdsPlugin(),
		// new webpack.NoEmitOnErrorsPlugin(),
		new UglifyJSPlugin({
			cache: true,
			parallel: true,
			sourceMap: false,
			uglifyOptions: {
				ie8: true,
				warnings: false,
				compress: { drop_console: true },
			},
		}),
		extractLoader,
	],
};

module.exports = productionConfig;