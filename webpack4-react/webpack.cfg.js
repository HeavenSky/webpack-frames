const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
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
		new UglifyJSPlugin({
			cache: true,
			parallel: true,
			sourceMap: false,
			uglifyOptions: {
				warnings: false,
				compress: { drop_console: true },
			},
		}),
	],
};

module.exports = productionConfig;