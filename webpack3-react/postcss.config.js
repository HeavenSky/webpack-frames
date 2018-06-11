const pkg = require("./package.json");
const floor = /ie8/.test(pkg.name) ? 7 : 8;
const browsers = [
	"last 2 versions",
	"ie > " + floor,
	"> 0.01%",
];
const plugins = {
	// 在 package.json 中是 browserslist 参数
	autoprefixer: { browsers },
	cssnano: { safe: true },
	/* "postcss-cssnext": {},
	"postcss-px-to-viewport": {
		viewportWidth: 320,
		viewportHeight: 568,
		unitPrecision: 5,
		viewportUnit: "vw",
		selectorBlackList: [],
		minPixelValue: 1,
		mediaQuery: false
	}, */
};
module.exports = { plugins };