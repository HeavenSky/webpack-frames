const { NODE_ENV } = process.env;
const pkg = require("./package.json");
const isProd = NODE_ENV === "production";
const floor = /ie8/i.test(pkg.name) ? 8 : 9;
// 在 package.json 中是 browserslist 参数
const browsers = [
	"ie >= " + floor,
	"android >= 4",
	"ios >= 7",
	">= 0.2%", // 覆盖90%的浏览器
];
const plugins = {
	cssnano: { safe: true },
	autoprefixer: { browsers },
	"postcss-preset-env": {},
	"postcss-px-to-viewport": {
		unitToConvert: "px",
		viewportWidth: 750,
		unitPrecision: 3,
		propList: ["*"],
		viewportUnit: "vmin",
		fontViewportUnit: "vmin",
		selectorBlackList: [],
		minPixelValue: 1,
		mediaQuery: false,
		replace: true,
		exclude: [],
		landscape: false,
		landscapeUnit: "vmax",
		landscapeWidth: 1334,
	},
};
isProd || (delete plugins.cssnano);
delete plugins["postcss-preset-env"];
delete plugins["postcss-px-to-viewport"];
// postcss.config.js 配置生效需 postcss-loader 不携带 options
module.exports = {
	plugins,
	minimize: isProd,
	sourceMap: !isProd,
}; // https://github.com/postcss/postcss-loader#options