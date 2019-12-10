require("./file"); // 执行文本拼接,文件(夹)清理
const webpack = require("webpack");
const merge = require("webpack-merge");
const ModulePlugin = require("./hook");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { buildFolder, outputFolder, staticFolder,
	compileFolder, templateFile, LIB, IPT, modify,
	title, ico, css, js, page } = require("./opt.self");
const { scssStyleLoader, lessStyleLoader, styleLoader, cfg,
	cssModuleLoader, cssStyleLoader } = require("./loader");
const { FOR_IE, PROD, isArray, WK, ts, dir, rel, ver, fmt,
	keys, join, calc, poly } = require("./basic");
const mode = PROD ? "production" : "development";
const copyList = [ // 文件和文件夹拷贝列表
	{ context: dir(buildFolder), from: "*.js", to: "js" },
	{ context: dir(buildFolder), from: "*.css", to: "css" },
].concat(PROD ? dir(staticFolder) : []);
const plugins = [
	new ModulePlugin(), new CopyWebpackPlugin(copyList),
	new webpack.DefinePlugin({
		"process.env.NODE_ENV": JSON.stringify(mode),
	}),
];
if (calc("vue-loader") >= 15) {
	const VueLodPlugin = require("vue-loader/lib/plugin");
	plugins.push(new VueLodPlugin());
} // https://vue-loader.vuejs.org/zh/migrating.html
const out = `js/${ver("chunk")}.js`;
const minimizer = []; const splitChunks = {};
const optNow = require(PROD ? "./opt.prod" : "./opt.dev");
const optRun = {
	entry: join(0, IPT), performance: { hints: false },
	optimization: { splitChunks, minimizer }, plugins, mode,
	output: { // publicPath必须以/结尾,防止路径拼接出错
		path: dir(outputFolder), publicPath: void 0,
		filename: out, chunkFilename: out, pathinfo: !PROD,
		// library: ["SKY", "[name]"], libraryTarget: "umd",
	}, // 开发环境chunkhash更合适,但与热部署不兼容,妥协用hash
	module: { // module-variables,module-methods,performance
		rules: [{
			test: /\.(js|jsx|mjs)(\?.*)?$/i,
			use: [{ loader: "babel-loader", options: cfg }],
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
	resolve: {
		alias: { "@": dir("src") },
		extensions: ".js|.jsx|.mjs|.vue|.json".split("|"),
	}, // https://vuejs.org/v2/guide/installation.html
	externals: { jquery: "$", wangeditor: "wangEditor" },
};
const rhl = "react-hot-loader"; // ie浏览器兼容处理
const rhlPath = `${rhl}/dist/${rhl}.production.min`;
if (FOR_IE) { optRun.resolve.alias[`${rhl}$`] = rhlPath; }
if (WK < 2) {
	optRun.module.postLoaders = [{
		test: /\.(js|jsx|mjs)(\?.*)?$/i,
		loader: "export-from-ie8/loader",
		query: { cacheDirectory: true },
	}];
	optRun.module.loaders = optRun.module.rules.map(v => {
		const { use: [{ loader, options }], ...rest } = v;
		return { loader, query: options, ...rest };
	});
	delete optRun.module.rules;
	const Es3ifyPlugin = require("es3ify-webpack-plugin");
	plugins.push(new Es3ifyPlugin({
		test: /\.(js|jsx|mjs)(\?.*)?$/i, sourceMap: false,
	}));
	optRun.resolve.extensions.unshift("");
}
const X = { cache: true, parallel: true, sourceMap: false };
const O = {
	ie8: WK < 2, safari10: true, warnings: false,
	compress: { drop_console: true }, mangle: true,
	output: { beautify: false }, keep_fnames: false,
};
if (WK < 4) { // context当前目录 resource目标文件 chunks模块
	plugins.push(new webpack.optimize.CommonsChunkPlugin({
		name: "vendor", children: true, deepChildren: true,
		minChunks: mod => /node_modules/.test(mod.resource),
	}), new webpack.optimize.CommonsChunkPlugin({
		name: "runtime", minChunks: Infinity,
	})); // 抽取webpack每次运行编译时的代码变化,文件会很小
	PROD && plugins.push(new (require("uglifyjs" +
		"-webpack-plugin"))({ ...X, uglifyOptions: O }));
	delete optRun.mode; delete optRun.optimization;
} else {
	PROD && minimizer.push(new (require("terser" +
		"-webpack-plugin"))({ ...X, terserOptions: O }));
	const vendor = { // mod._chunks 模块Set对象
		name: "vendor", chunks: "all", enforce: true,
		test: mod => /node_modules/.test(mod.resource),
	}; // context当前目录 resource目标文件 type类型
	splitChunks.cacheGroups = { vendor };
	optRun.optimization.runtimeChunk = { name: "runtime" };
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
const addEntryPage = name => {
	const app = name || "index";
	optRun.entry[app] = (PROD || FOR_IE ? poly : []).concat(
		dir("src/utils/public"), dir(compileFolder, app));
	const opt = {
		filename: app + ".html",
		template: dir(templateFile),
		chunks: ["runtime", "vendor", ...keys(IPT), app],
		chunksSortMode: "manual", inject: true, hash: true,
		showErrors: true, cache: true, xhtml: true,
		minify: false, templateParameters: {},
	};
	const arg = opt.templateParameters;
	const p = rel(app, "").slice(0, -2); // 保证路径是/结尾
	const fu = v => /^(https?:\/)?\//i.test(v) ? v : p + v;
	arg.ico = fu(fmt(ico, app) || "favicon.ico"); arg.p = p;
	arg.title = fmt(title, app) || `Home Page for ${app}`;
	arg.js = isArray(js) ? js.map(v => fmt(v, app)) : [];
	arg.css = isArray(css) ? css.map(v => fmt(v, app)) : [];
	keys(LIB).forEach(k => /\.js$/i.test(k)
		? arg.js.push(`js/${k}?${ts}`) : /\.css$/i.test(k)
			? arg.css.push(`css/${k}?${ts}`) : void 0);
	arg.js = arg.js.filter(Boolean).map(fu);
	arg.css = arg.css.filter(Boolean).map(fu);
	plugins.push(new HtmlWebpackPlugin(opt));
};
isArray(page) && page.forEach(addEntryPage); // 多页面打包
(page && page.length) || (copyList.length = 0);
/* *** modify final configuration  *** */
const config = merge(optNow, optRun);
module.exports = modify ? modify(config) || config : config;