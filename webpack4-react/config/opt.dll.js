const webpack = require("webpack");
const merge = require("webpack-merge");
const { buildFolder, DLL } = require("./opt.self");
const { WK, dir } = require("./basic");
WK !== 1 && require("./mix"); // 执行文本拼接
const optAll = require("./opt.all");
const optDll = {
	entry: Object.assign({}, DLL),
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
module.exports = merge(optAll, optDll);