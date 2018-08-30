const fs = require("fs");
const webpack = require("webpack");
const merge = require("webpack-merge");
const Es3ifyPlugin = require("es3ify-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const iniConfig = require("./webpack.ini");
const {
	isProd, dir, ver, ts,
	publicPath, prefixAjax,
	buildFolder, outputFolder,
	staticFolder, templateFolder,
} = iniConfig;
const buildPath = dir(buildFolder);

// react-hot-loader 不兼容 react@0 临时解决方案如下
const F = "node_modules/react-hot-loader/dist/react-hot-loader.development.js";
if (fs.existsSync(dir(F))) {
	let str = fs.readFileSync(dir(F), "utf-8");
	str = str.replace(/stack.children.push/g, "(stack.children||[]).push");
	fs.writeFileSync(dir(F), str, "utf-8");
}
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

const copyList = [{
	context: buildFolder,
	from: "*.js",
	to: "js",
}];
isProd && copyList.push(staticFolder);
const currentConfig = require(
	isProd ? "./webpack.cfg" : "./webpack.cfg.dev"
);
// 用import()按需加载 https://doc.webpack-china.org/api/module-methods/#import-
const commonConfig = {
	entry: iniConfig.ipt || {},
	externals: iniConfig.cdn || {},
	output: {
		publicPath,
		path: dir(outputFolder),
		// 开发环境应该是[chunkhash]的,但是由于[chunkhash]和webpack-dev-server --hot不兼容,只能妥协
		filename: `js/[name]${ver.replace(
			/(chunk|content|module)?hash/gi,
			isProd ? "chunkhash" : "hash"
		)}.js`,
		chunkFilename: `js/[name]${ver.replace(
			/(chunk|content|module)?hash/gi,
			isProd ? "chunkhash" : "hash"
		)}.js`,
	},
	module: {
		postLoaders: [{
			test: /\.jsx?(\?.*)?$/i,
			loader: "export-from-ie8/loader?cacheDirectory=true",
		}],
		loaders: [
			{
				test: /\.jsx?(\?.*)?$/i,
				loader: "babel-loader?cacheDirectory=true",
				include: dir("src"),
				exclude: dir(staticFolder),
			},
			{
				test: /\.(jpe?g|png|gif|bmp|ico)(\?.*)?$/i,
				loader: `url-loader?limit=9999&name=img/[name]${ver.replace(
					/(chunk|content|module)?hash/gi, "hash"
				)}.[ext]`,
			},
			{
				test: /\.(woff2?|svg|ttf|otf|eot)(\?.*)?$/i,
				loader: `url-loader?limit=9999&name=font/[name]${ver.replace(
					/(chunk|content|module)?hash/gi, "hash"
				)}.[ext]`,
			},
		],
	},
	plugins: [
		new CopyWebpackPlugin(copyList),
		new webpack.optimize.CommonsChunkPlugin({
			name: "runtime",
			minChunks: (module, count) => {
				const { resource } = module || {};
				return /[\\/]node_modules[\\/].*\.(json|vue|jsx?)(\?.*)?$/i.test(resource);
			},
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "manifest",
			chunks: ["runtime"],
		}),
		/* new webpack.ContextReplacementPlugin(
			/moment[\\/]locale$/i,
			/^\.\/zh-cn$/i
		),*/
		new webpack.IgnorePlugin(
			/^\.\/locale$/i,
			/moment$/i
		),
		new Es3ifyPlugin(),
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
		extensions: ["", ".js", ".jsx", ".vue", ".json"],
	},
	performance: {
		hints: false,
	},
};
const addEntryPage = name => {
	const app = name || "index";
	commonConfig.entry[app] = [
		dir(templateFolder, app + ".js"),
	];

	const title = iniConfig.fmt(
		iniConfig.html.title, app
	) || `Home Page for ${app}`;
	const ico = iniConfig.fmt(
		iniConfig.html.ico, app
	) || `favicon.ico`;
	const css = (iniConfig.html.css || []).map(
		v => v && iniConfig.fmt(v, app)
	).filter(v => v);
	const js1 = Object.keys(iniConfig.lib || {}).map(
		v => v && `js/${v}.lib.js?${ts}`
	);
	const js2 = (iniConfig.html.js || []).map(
		v => v && iniConfig.fmt(v, app)
	);
	const js = iniConfig.dst(
		[...js1, ...js2].filter(v => v)
	);

	const chunks = (iniConfig.html.chunks || []).map(
		v => v && iniConfig.fmt(v, app)
	).filter(v => v);
	chunks.push(app);
	chunks.unshift("manifest", "runtime");
	const prefix = prefixAjax || "";
	const pubrel = publicPath ||
		iniConfig.rel(app, "").slice(0, -2);
	commonConfig.plugins.push(
		new HtmlWebpackPlugin({
			filename: app + ".html",
			template: dir(templateFolder, "index.html"),
			prefix, pubrel, chunks, title, ico, css, js,
			chunksSortMode: "manual",
			showErrors: true,
			minify: false,
			inject: true,
			cache: true,
			xhtml: true,
			hash: true,
		})
	);
};
const { length } = iniConfig.page || [];
if (length) {
	iniConfig.page.forEach(addEntryPage); // 多页面打包
} else {
	copyList.length = 0;
}

module.exports = merge(commonConfig, currentConfig);