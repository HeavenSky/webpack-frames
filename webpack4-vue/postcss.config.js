const { NODE_ENV } = process.env;
const pkg = require("./package.json");
const isProd = NODE_ENV === "production";
const floor = /ie8/i.test(pkg.name) ? 7 : 8;
const browsers = [
	"last 2 versions",
	"ie > " + floor,
	"> 0.01%",
];
// 在 package.json 中是 browserslist 参数
const plugins = {
	autoprefixer: { browsers },
	cssnano: { safe: true },
	"postcss-cssnext": {},
	"postcss-px-to-viewport": {
		minPixelValue: 1,
		unitPrecision: 5,
		viewportWidth: 320,
		viewportHeight: 568,
		mediaQuery: false,
		viewportUnit: "vw",
		selectorBlackList: [],
	},
};
delete plugins["postcss-cssnext"];
delete plugins["postcss-px-to-viewport"];
// npm ddp 扁平化
const minimize = isProd;
const sourceMap = !isProd;
isProd || (delete plugins.cssnano);
// https://github.com/postcss/postcss-loader#options
// postcss.config.js 配置生效需 postcss-loader 不携带 options
module.exports = { plugins, minimize, sourceMap };