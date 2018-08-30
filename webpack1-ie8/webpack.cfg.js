const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const {
	outputFolder, ver,
	cssStyleLoader, cssModuleLoader,
	scssStyleLoader, lessStyleLoader,
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
					"postcss-loader"
				),
			},
			{
				test: /[^_]\.css(\?.*)?$/i,
				loader: extractLoader.extract(
					cssStyleLoader,
					"postcss-loader"
				),
			},
			// webpack1 比较特殊, 不需要 style-loader, 加了反而报错, less scss 在生产环境的编译配置很特殊
			// https://github.com/webpack-contrib/extract-text-webpack-plugin/blob/webpack-1/README.md
			{
				test: /_\.less(\?.*)?$/i,
				loader: extractLoader.extract([
					cssModuleLoader,
					"postcss-loader",
					lessStyleLoader,
				]),
			},
			{
				test: /[^_]\.less(\?.*)?$/i,
				loader: extractLoader.extract([
					cssStyleLoader,
					"postcss-loader",
					lessStyleLoader,
				]),
			},
			{
				test: /_\.scss(\?.*)?$/i,
				loader: extractLoader.extract([
					cssModuleLoader,
					"postcss-loader",
					scssStyleLoader,
				]),
			},
			{
				test: /[^_]\.scss(\?.*)?$/i,
				loader: extractLoader.extract([
					cssStyleLoader,
					"postcss-loader",
					scssStyleLoader,
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
		new UglifyJsPlugin({
			cache: true,
			parallel: true,
			sourceMap: false,
			uglifyOptions: {
				ie8: true,
				safari10: false,
				warnings: false,
				output: { comments: false },
				compress: { drop_console: true },
			},
		}),
		extractLoader,
	],
};

module.exports = productionConfig;