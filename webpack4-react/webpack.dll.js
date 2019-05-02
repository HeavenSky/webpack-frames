const fs = require("fs");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const iniConfig = require("./webpack.ini");
const { dir, isProd, buildFolder } = iniConfig;
const buildPath = dir(buildFolder);

// fs.existsSync(buildPath) && fs.rmdirSync(buildPath);
const fm = (list, file) => {
	const str = list.map(
		v => fs.readFileSync(dir(v), "utf-8")
	).join("\n") || "";
	fs.existsSync(buildPath) || fs.mkdirSync(buildPath);
	fs.writeFileSync(dir(buildFolder, file), str, "utf-8");
};
Object.keys(iniConfig.lib || {}).forEach(js => {
	const libs = [];
	(iniConfig.lib[js] || []).forEach(v => {
		const fv = iniConfig.fmt(v) || "";
		if (fv) {
			libs.push(
				fv[0] === "." ? `${fv}.js`
					: `node_modules/${fv}.js`
			);
		}
	});
	libs.length && fm(libs, `${js}.lib.js`);
});

const dllConfig = {
	entry: iniConfig.dll || {},
	output: {
		path: buildPath,
		filename: "[name].dll.js",
		library: "[name]_[chunkhash:5]",
		// library 与 DllPlugin 中的 name 一致
	},
	plugins: [
		/* new webpack.ContextReplacementPlugin(
			/moment[\\/]locale$/i,
			/^\.\/zh-cn$/i
		), */
		new webpack.IgnorePlugin(
			/^\.\/locale$/i,
			/moment$/i
		),
		new webpack.DllPlugin({
			context: __dirname,
			name: "[name]_[chunkhash:5]",
			path: dir(buildFolder, "[name].manifest.json"),
		}),
	],
	resolve: {
		alias: {
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
			"@": dir("src"),
		},
		extensions: [".js", ".jsx", ".vue", ".json"],
	},
	performance: {
		hints: false,
	},
	mode: isProd ? "production" : "development",
};
isProd && dllConfig.plugins.push(
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
	})
);

module.exports = dllConfig;