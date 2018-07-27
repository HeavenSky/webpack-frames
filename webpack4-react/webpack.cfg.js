const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const { outputFolder } = require("./webpack.ini");

const productionConfig = {
	// devtool: "source-map",
	devtool: false,
	plugins: [
		new CleanWebpackPlugin([outputFolder]),
		// new webpack.optimize.ModuleConcatenationPlugin(),
		// new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HashedModuleIdsPlugin(),
		// new webpack.NoEmitOnErrorsPlugin(),
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
	],
};

module.exports = productionConfig;