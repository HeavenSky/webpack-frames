const webpack = require("webpack");
const merge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const iniConfig = require("./webpack.ini");
const {
	isProd, dir, ver, ts,
	publicPath, prefixAjax,
	buildFolder, outputFolder,
	staticFolder, templateFolder,
} = iniConfig;

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
		rules: [
			{
				test: /\.jsx?(\?.*)?$/i,
				use: [{
					loader: "babel-loader",
					options: {
						cacheDirectory: true,
					},
				}],
				include: dir("src"),
				exclude: dir(staticFolder),
			},
			{
				test: /\.(jpe?g|png|gif|bmp|ico)(\?.*)?$/i,
				use: [{
					loader: "url-loader",
					options: {
						limit: 5000,
						name: `img/[name]${ver.replace(
							/(chunk|content|module)?hash/gi,
							"hash"
						)}.[ext]`,
					},
				}],
			},
			{
				test: /\.(woff2?|svg|ttf|otf|eot)(\?.*)?$/i,
				use: [{
					loader: "url-loader",
					options: {
						limit: 5000,
						name: `font/[name]${ver.replace(
							/(chunk|content|module)?hash/gi,
							"hash"
						)}.[ext]`,
					},
				}],
			},
		],
	},
	plugins: [
		new CopyWebpackPlugin(copyList),
		new webpack.optimize.CommonsChunkPlugin({
			name: "runtime",
			minChunks(module, _count) {
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
		), */
		new webpack.IgnorePlugin(
			/^\.\/locale$/i,
			/moment$/i
		),
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
};
Object.keys(iniConfig.dll || {}).forEach(
	dll => commonConfig.plugins.push(
		new webpack.DllReferencePlugin({
			context: __dirname,
			manifest: require(dir(
				buildFolder, dll + ".manifest.json"
			)),
		})
	)
);
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
	) || "favicon.ico";
	const css = (iniConfig.html.css || []).map(
		v => v && iniConfig.fmt(v, app)
	).filter(v => v);
	const js1 = Object.keys(iniConfig.lib || {}).map(
		v => v && `js/${v}.lib.js?${ts}`
	);
	const js2 = (iniConfig.html.js || []).map(
		v => v && iniConfig.fmt(v, app)
	);
	const js3 = Object.keys(iniConfig.dll || {}).map(
		v => v && `js/${v}.dll.js?${ts}`
	);
	const js = iniConfig.dst(
		[...js1, ...js2, ...js3].filter(v => v)
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
			template: dir("src/index.html"),
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

const mod = "react-hot-loader";
const { ie, calc, page } = iniConfig;
if (page && page.length) {
	page.forEach(addEntryPage); // 多页面打包
	const { resolve, module: { rules } } = commonConfig;
	ie && calc(mod) && (resolve.alias[`${mod}$`] =
		`${mod}/dist/${mod}.production.min`); // 兼容IE
	calc(mod) > 4.5 && rules.push({
		test: /\.jsx?(\?.*)?$/i,
		use: ["react-hot-loader/webpack"],
		include: dir("node_modules"),
	});
} else {
	copyList.length = 0;
}

module.exports = merge(commonConfig, currentConfig);