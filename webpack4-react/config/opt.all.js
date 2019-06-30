const webpack = require("webpack");
const { IE_SHIM, PROD, WK, dpv, dir } = require("./basic");
const mode = PROD ? "production" : "development";
const optAll = {
	plugins: [
		/* new webpack.ContextReplacementPlugin(
			/moment[\\/]locale$/i,
			/^\.\/zh-cn$/i
		), */
		new webpack.IgnorePlugin(
			/^\.\/locale$/i,
			/moment$/i
		),
	],
	resolve: {
		/* apis: dir("src/apis"),
		components: dir("src/components"),
		containers: dir("src/containers"),
		constants: dir("src/constants"),
		reducers: dir("src/reducers"),
		services: dir("src/services"),
		actions: dir("src/actions"),
		layouts: dir("src/layouts"),
		assets: dir("src/assets"),
		models: dir("src/models"),
		routes: dir("src/routes"),
		styles: dir("src/styles"),
		themes: dir("src/themes"),
		pages: dir("src/pages"),
		utils: dir("src/utils"),
		views: dir("src/views"), */
		alias: { "@": dir("src") },
		extensions: [".js", ".jsx", ".vue", ".json"],
	},
	optimization: { minimizer: [] },
	performance: { hints: false }, mode,
};
const rhl = "react-hot-loader"; // ie浏览器兼容处理
const res = `${rhl}/dist/${rhl}.production.min`;
if (IE_SHIM) { optAll.resolve.alias[`${rhl}$`] = res; }
if (WK < 4) {
	delete optAll.mode;
	delete optAll.optimization;
	optAll.plugins.push(new webpack.DefinePlugin({
		"process.env.NODE_ENV": JSON.stringify(mode),
	}));
	WK === 1 && optAll.resolve.extensions.unshift("");
}
const hasTerser = dpv("terser-webpack-plugin");
const X = { cache: true, parallel: true, sourceMap: false };
const O = {
	ie8: WK === 1, safari10: false, warnings: false,
	compress: { drop_console: true },
	output: { beautify: false },
};
if (WK >= 4 && hasTerser) {
	const TerserPlugin = require("terser-webpack-plugin");
	PROD && optAll.optimization.minimizer.push(
		new TerserPlugin({ ...X, terserOptions: O }));
} else {
	const UglifyPlugin = require("uglifyjs-webpack-plugin");
	PROD && optAll.plugins.push(
		new UglifyPlugin({ ...X, uglifyOptions: O }));
}
module.exports = optAll;