const { PROD: p } = require("./basic");
// postcss.config.js 配置生效需 postcss-loader 不携带 options
const plugins = {
	autoprefixer: {},
	cssnano: { safe: true },
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
p || (delete plugins.cssnano);
delete plugins["postcss-preset-env"];
delete plugins["postcss-px-to-viewport"];
module.exports = { plugins, minimize: p, sourceMap: !p };
// https://github.com/postcss/postcss-loader#options