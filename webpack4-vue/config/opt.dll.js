const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const { buildFolder, DLL } = require("./opt.self");
const { WK, dir, dmt: { merge } } = require("./basic");
WK !== 1 && require("./mix"); // 执行文本拼接
const optAll = require("./opt.all");
const optDll = {
	entry: merge(DLL),
	output: {
		path: dir(buildFolder),
		filename: "[name].dll.js",
		library: "[name]_[chunkhash:5]",
		// library 与 DllPlugin 中的 name 一致
	},
	plugins: [
		new webpack.DllPlugin({
			context: dir(),
			name: "[name]_[chunkhash:5]",
			path: dir(buildFolder, "[name].manifest.json"),
		}),
	],
};
module.exports = webpackMerge(optAll, optDll);