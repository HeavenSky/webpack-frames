const webpack = require("webpack");
const merge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const iniConfig = require("./webpack.ini");
const {
	publicPath, prefixAjax,
	buildFolder, outputFolder,
	staticFolder, templateFolder,
	cssStyleLoader, cssModuleLoader,
	postStyleLoader, lessStyleLoader,
	isProd, dir, ver, ts, styleLoader,
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
const commonConfig = {
	entry: iniConfig.ipt,
	externals: iniConfig.cdn,
	output: {
		publicPath,
		path: dir(outputFolder),
		filename: `js/[name]${ver}[chunkhash:5].js`,
		chunkFilename: `js/[name]${ver}[chunkhash:5].js`,
		// 用import()按需加载 https://doc.webpack-china.org/api/module-methods/#import-
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
						limit: 9999,
						name: `img/[name]${ver}[hash:5].[ext]`,
					},
				}],
			},
			{
				test: /\.(woff2?|svg|ttf|otf|eot)(\?.*)?$/i,
				use: [{
					loader: "url-loader",
					options: {
						limit: 9999,
						name: `font/[name]${ver}[hash:5].[ext]`,
					},
				}],
			},
			{
				test: /\.css(\?.*)?$/i,
				oneOf: [{
					resourceQuery: /\bmodule\b/i,
					use: [
						isProd ? MiniCssExtractPlugin.loader : styleLoader,
						cssModuleLoader,
						postStyleLoader,
					],
				}, {
					use: [
						isProd ? MiniCssExtractPlugin.loader : styleLoader,
						cssStyleLoader,
						postStyleLoader,
					],
				}],
			},
			{
				test: /\.less(\?.*)?$/i,
				oneOf: [{
					resourceQuery: /\bmodule\b/i,
					use: [
						isProd ? MiniCssExtractPlugin.loader : styleLoader,
						cssModuleLoader,
						postStyleLoader,
						lessStyleLoader,
					],
				}, {
					use: [
						isProd ? MiniCssExtractPlugin.loader : styleLoader,
						cssStyleLoader,
						postStyleLoader,
						lessStyleLoader,
					],
				}],
			},
		],
	},
	plugins: [
		new CopyWebpackPlugin(copyList),
		new MiniCssExtractPlugin({
			allChunks: true,
			filename: `css/[name]${ver}[contenthash:5].css`,
			chunkFilename: `css/[name]${ver}[contenthash:5].css`,
		}),
		/* new webpack.optimize.CommonsChunkPlugin({
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
		new webpack.ContextReplacementPlugin(
			/moment[\\/]locale$/i,
			/^\.\/zh-cn$/i
		),*/
		new webpack.IgnorePlugin(
			/^\.\/locale$/i,
			/moment$/i
		),
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
	optimization: {
		runtimeChunk: {
			name: "runtime",
		},
		splitChunks: {
			cacheGroups: {
				manifest: {
					test: /[\\/]node_modules[\\/].*\.(json|vue|jsx?)(\?.*)?$/i,
					name: "manifest",
					chunks: "all",
				},
			},
		},
	},
	mode: isProd ? "production" : "development",
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

	const title = iniConfig.format(
		iniConfig.html.title, app
	) || `Home Page for ${app}`;
	const ico = iniConfig.format(
		iniConfig.html.ico, app
	) || `favicon.ico`;
	const css = (iniConfig.html.css || []).map(
		v => v && iniConfig.format(v, app)
	).filter(v => v);
	const js1 = Object.keys(iniConfig.lib || {}).map(
		v => v && `js/${v}.lib.js?${ts}`
	);
	const js2 = (iniConfig.html.js || []).map(
		v => v && iniConfig.format(v, app)
	);
	const js3 = Object.keys(iniConfig.dll || {}).map(
		v => v && `js/${v}.dll.js?${ts}`
	);
	const js = iniConfig.distinct(
		[...js1, ...js2, ...js3].filter(v => v)
	);

	const chunks = (iniConfig.html.chunks || []).map(
		v => v && iniConfig.format(v, app)
	).filter(v => v);
	chunks.push(app);
	chunks.splice(0, 0, "manifest", "runtime");
	commonConfig.plugins.push(
		new HtmlWebpackPlugin({
			filename: app + ".html",
			template: dir(templateFolder, "index.html"),
			prefixAjax, chunks, title, ico, css, js,
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