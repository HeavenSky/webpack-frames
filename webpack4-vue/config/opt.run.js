const webpack = require("webpack");
const merge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { publicPath, prefixAjax, compileFolder, templateFile,
	buildFolder, outputFolder, staticFolder, DLL, LIB, page,
	IPT, CDN, title, ico, css, js } = require("./opt.self");
const { scssStyleLoader, lessStyleLoader, cssStyleLoader,
	cssModuleLoader, styleLoader } = require("./loader");
const { PROD, WK, isArray, verh, rel, dir, calc,
	dst: { every }, fmt, ts } = require("./basic");
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
const out = `js/[name]${verh(PROD ? "chunk" : "")}.js`;
let reg = /.*/; // regexp use for optimize of modules chunk
reg = /[\\/]node_modules[\\/].*\.(json|vue|jsx?)(\?.*)?$/i;
const optRun = {
	entry: Object.assign({}, IPT),
	externals: Object.assign({}, CDN),
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
					limit: 5000,
					name: `img/[name]${verh()}.[ext]`,
				},
			}],
		}, {
			test: /\.(woff2?|svg|ttf|otf|eot)(\?.*)?$/i,
			use: [{
				loader: "url-loader",
				options: {
					limit: 5000,
					name: `font/[name]${verh()}.[ext]`,
				},
			}],
		}],
	},
	plugins,
	optimization: {
		runtimeChunk: { name: "runtime" },
		splitChunks: {
			cacheGroups: {
				manifest: {
					test: reg,
					name: "manifest",
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
			name: "runtime",
			minChunks(module, _count) {
				const { resource } = module || {};
				return reg.test(resource);
			},
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "manifest",
			chunks: ["runtime"],
		})
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

every(DLL, dll => plugins.push(
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
		chunks: ["manifest", "runtime", app],
		chunksSortMode: "manual",
		showErrors: true,
		minify: false,
		inject: true,
		cache: true,
		xhtml: true,
		hash: true,
	};
	opt.title = fmt(title, app) || `Home Page for ${app}`;
	opt.ico = fmt(ico, app) || "favicon.ico";
	opt.css = isArray(css) ? css.map(v => fmt(v)) : [];
	opt.js = isArray(js) ? js.map(v => fmt(v)) : [];
	every(LIB, k => /\.css$/i.test(k)
		? opt.css.push(`css/${k}?${ts}`) : /\.js$/i.test(k)
			? opt.js.push(`js/${k}?${ts}`) : null);
	every(DLL, k => opt.js.push(`js/${k}.dll.js?${ts}`));
	opt.css = opt.css.filter(Boolean);
	opt.js = opt.js.filter(Boolean);
	opt.prefix = prefixAjax || "";
	opt.pubrel = publicPath || rel(app, "").slice(0, -2);
	plugins.push(new HtmlWebpackPlugin(opt));
};
if (isArray(page) && page.length) {
	page.forEach(addEntryPage); // 多页面打包
} else { copyList.length = 0; }
module.exports = merge(optAll, optNow, optRun);