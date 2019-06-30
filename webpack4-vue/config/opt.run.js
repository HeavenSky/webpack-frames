const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { publicPath, prefixAjax, compileFolder, templateFile,
	buildFolder, outputFolder, staticFolder, DLL, LIB, page,
	IPT, CDN, title, ico, css, js } = require("./opt.self");
const { scssStyleLoader, lessStyleLoader, cssStyleLoader,
	cssModuleLoader, styleLoader } = require("./loader");
const { PROD, isArray, WK, ver, dir, rel, fmt, calc, ts,
	dmt: { keys, merge } } = require("./basic");
const copyList = [ // 文件和文件夹拷贝列表
	{ context: dir(buildFolder), from: "*.js", to: "js" },
	{ context: dir(buildFolder), from: "*.css", to: "css" },
].concat(PROD ? [dir(staticFolder)] : []);
const plugins = [new CopyWebpackPlugin(copyList)];
if (calc("vue-loader") >= 15) {
	const VueLodPlugin = require("vue-loader/lib/plugin");
	plugins.push(new VueLodPlugin());
} // https://vue-loader.vuejs.org/zh/migrating.html
// import按需加载 https://doc.webpack-china.org/api/module-methods/#import-
const optAll = require("./opt.all");
const optNow = require(PROD ? "./opt.prod" : "./opt.dev");
const out = `js/${ver("chunk")}.js`;
let reg = /.*/; // regexp use for optimize of modules chunk
reg = /[\\/]node_modules[\\/].*\.(json|vue|jsx?)(\?.*)?$/i;
const optRun = {
	entry: merge(IPT), externals: merge(CDN),
	output: {
		publicPath, path: dir(outputFolder),
		filename: out, // 开发环境chunkhash更合适,妥协用hash
		chunkFilename: out, // 因为与dev-server --hot不兼容
	},
	module: {
		rules: [{
			test: /\.jsx?(\?.*)?$/i,
			use: [{
				loader: "babel-loader",
				options: { cacheDirectory: true },
			}],
			include: dir("src"),
			exclude: dir(staticFolder),
		}, {
			test: /\.vue(\?.*)?$/i,
			use: [{
				loader: "vue-loader",
				options: { cacheDirectory: true },
			}],
			include: dir("src"),
			exclude: dir(staticFolder),
		}, {
			test: /\.(jpe?g|png|gif|bmp|ico)(\?.*)?$/i,
			use: [{
				loader: "url-loader",
				options: {
					limit: 4000,
					name: `img/${ver()}.[ext]`,
				},
			}],
		}, {
			test: /\.(woff2?|svg|ttf|otf|eot)(\?.*)?$/i,
			use: [{
				loader: "url-loader",
				options: {
					limit: 4000,
					name: `font/${ver()}.[ext]`,
				},
			}],
		}],
	},
	plugins,
	optimization: { // runtime 作用不大,暂时去掉
		// runtimeChunk: { name: "runtime" },
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: reg,
					name: "vendor",
					chunks: "all",
				},
			},
		},
	},
};
if (WK === 1) {
	require("./mix"); // 执行文本拼接
	optRun.module.postLoaders = [{
		test: /\.jsx?(\?.*)?$/i,
		loader: "export-from-ie8/loader",
		query: { cacheDirectory: true },
	}];
	const { rules } = optRun.module;
	optRun.module.loaders = rules.map(rule => {
		const { use: [{ loader, options }], ...rs } = rule;
		return { loader, query: options, ...rs };
	});
	delete optRun.module.rules;
	const Es3ifyPlugin = require("es3ify-webpack-plugin");
	optRun.plugins.push(new Es3ifyPlugin({
		test: /\.jsx?(\?.*)?$/i, sourceMap: false,
	}));
}
if (WK < 4) {
	delete optRun.optimization;
	optRun.plugins.push(
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			minChunks(module, _count) {
				const { resource } = module || {};
				return resource && reg.test(resource);
			},
		}) // runtime 作用不大,暂时去掉
		/* new webpack.optimize.CommonsChunkPlugin({
			name: "runtime",
			chunks: Infinity,
		}) */
	);
} else {
	const { loader } = require("mini-css-extract-plugin");
	optRun.module.rules.push({
		test: /\.css(\?.*)?$/i,
		oneOf: [{
			resourceQuery: /\bmodule\b/i,
			use: [
				PROD ? loader : styleLoader,
				cssModuleLoader,
				"postcss-loader",
			],
		}, {
			use: [
				PROD ? loader : styleLoader,
				cssStyleLoader,
				"postcss-loader",
			],
		}],
	}, {
		test: /\.less(\?.*)?$/i,
		oneOf: [{
			resourceQuery: /\bmodule\b/i,
			use: [
				PROD ? loader : styleLoader,
				cssModuleLoader,
				"postcss-loader",
				lessStyleLoader,
			],
		}, {
			use: [
				PROD ? loader : styleLoader,
				cssStyleLoader,
				"postcss-loader",
				lessStyleLoader,
			],
		}],
	}, {
		test: /\.scss(\?.*)?$/i,
		oneOf: [{
			resourceQuery: /\bmodule\b/i,
			use: [
				PROD ? loader : styleLoader,
				cssModuleLoader,
				"postcss-loader",
				scssStyleLoader,
			],
		}, {
			use: [
				PROD ? loader : styleLoader,
				cssStyleLoader,
				"postcss-loader",
				scssStyleLoader,
			],
		}],
	});
}
keys(DLL).forEach(dll => plugins.push(
	new webpack.DllReferencePlugin({
		context: dir(),
		manifest: require(dir(
			buildFolder, dll + ".manifest.json")),
	})
));
const addEntryPage = name => {
	const app = name || "index";
	optRun.entry[app] = [
		require.resolve(dir(compileFolder, app)),
	];
	const opt = {
		filename: app + ".html",
		template: dir(templateFile),
		chunks: ["runtime", "vendor", ...keys(IPT), app],
		chunksSortMode: "manual", showErrors: true,
		minify: false, inject: true, cache: true,
		xhtml: true, hash: true,
	};
	opt.title = fmt(title, app) || `Home Page for ${app}`;
	opt.ico = fmt(ico, app) || "favicon.ico";
	opt.css = isArray(css) ? css.map(v => fmt(v, app)) : [];
	opt.js = isArray(js) ? js.map(v => fmt(v, app)) : [];
	keys(LIB).forEach(k => /\.css$/i.test(k)
		? opt.css.push(`css/${k}?${ts}`) : /\.js$/i.test(k)
			? opt.js.push(`js/${k}?${ts}`) : undefined);
	opt.css = opt.css.filter(Boolean);
	opt.js = opt.js.concat(keys(DLL).map(k =>
		`js/${k}.dll.js?${ts}`)).filter(Boolean);
	opt.prefix = prefixAjax || "";
	opt.pubrel = publicPath || rel(app, "").slice(0, -2);
	plugins.push(new HtmlWebpackPlugin(opt));
};
if (isArray(page) && page.length) {
	page.forEach(addEntryPage); // 多页面打包
} else { copyList.length = 0; }
module.exports = webpackMerge(optAll, optNow, optRun);