/* postcss.config.js当postcss-loader无options参数时生效
https://github.com/postcss/postcss-loader#options
https://github.com/pigcan/postcss-plugin-px2rem
https://github.com/csstools/postcss-preset-env */
const { PROD } = require("./basic");
const plugins = {
	autoprefixer: {},
	cssnano: { safe: true },
	"postcss-preset-env": {},
	"postcss-plugin-px2rem": {
		rootValue: 100,
		unitPrecision: 2,
		minPixelValue: 2,
	},
};
delete plugins["postcss-plugin-px2rem"];
delete plugins["postcss-preset-env"];
PROD || (delete plugins.cssnano);
module.exports = {
	plugins, minimize: PROD, sourceMap: !PROD,
};