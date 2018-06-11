const fs = require("fs");
const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const iniConfig = require("./webpack.ini");
const { dir, isProd, buildFolder } = iniConfig;
const buildPath = dir(buildFolder);

// fs.existsSync(buildPath) && fs.rmdirSync(buildPath);
const fm = (list, file) => {
	const txt = list.map(
		v => fs.readFileSync(dir(v), "utf-8")
	).join("\n") || "";
	fs.existsSync(buildPath) || fs.mkdirSync(buildPath);
	fs.writeFileSync(dir(buildFolder, file), txt, "utf-8");
};
Object.keys(iniConfig.lib || {}).forEach(js => {
	const libs = [];
	(iniConfig.lib[js] || []).forEach(v => {
		const fv = iniConfig.format(v) || "";
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
	entry: iniConfig.dll,
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
		),*/
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
			/* api: dir("src/api"),
			components: dir("src/components"),
			containers: dir("src/containers"),
			constants: dir("src/constants"),
			reducers: dir("src/reducers"),
			actions: dir("src/actions"),
			routes: dir("src/routes"),
			styles: dir("src/styles"),
			views: dir("src/views"),
			utils: dir("src/utils"), */
			"@": dir("src"),
			vue$: "vue/dist/vue.esm",
		},
		extensions: [".js", ".jsx", ".vue", ".json"],
	},
	performance: {
		hints: false,
	},
	mode: isProd ? "production" : "development",
};
isProd && dllConfig.plugins.push(
	new UglifyJSPlugin({
		cache: true,
		parallel: true,
		sourceMap: false,
		uglifyOptions: {
			warnings: false,
			compress: { drop_console: true },
		},
	})
);

module.exports = dllConfig;