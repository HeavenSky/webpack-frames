/* *** constants *** */
const { NODE_ENV, MY_PKG, MY_SVC, FOR_IE } = process.env;
const PROD = NODE_ENV === "production";
const { isArray } = Array; const min = PROD ? ".min" : "";
const ts = new Date().toISOString().replace(/\W/g, "_");
/* *** directory *** */
const { resolve: dir, relative: rel } = require("path");
const { version, dependencies, devDependencies } =
	require(dir("package.json")); // hash version name \\
const ver = v => ["[name]", PROD ? `[${v || ""}hash:5]`
	: "", `${version}`].join("-"); // chunk|content|module
/* *** functions *** */
const fmt = (func, app) => typeof func === "function"
	? func(app) : func;
const keys = v => Object.keys(v || {});
const join = (x, ...v) => Object.assign(x || {}, ...v);
const dps = join(null, dependencies, devDependencies);
const dpv = mod => (/[\d.]+/.exec(dps[mod]) || [])[0];
const calc = mod => parseFloat(dpv(mod)); // 异常返回NaN
const pair = (mod, s) => (s ? mod + s : "") + dpv(mod);
const poly = ["core-js", "regenerator-runtime"].concat(
	"html5shiv", dpv("antd") ? "media-match" : [], // IE
	calc("react") < 16 ? [] : "raf/polyfill"); // Map+Set
let WK = calc("webpack"); WK = WK < 2 ? 1 : WK < 4 ? 3 : WK;
/* *** repository *** */
const cdnjs = "https://cdnjs.cloudflare.com/ajax/libs/";
const sfile = "https://cdn.staticfile.org/";
const bootc = "https://cdn.bootcss.com/"; // jsdelivr.com
const baomt = "https://lib.baomitu.com/"; // css.loli.net
const eleme = "https://npm.elemecdn.com/"; // bootcdn.cn
const wpcdn = "https://cdn.jsdelivr.net/wp/"; // cdnjs.com
const ghcdn = "https://cdn.jsdelivr.net/gh/"; // unpkg.com
const npcdn = "https://cdn.jsdelivr.net/npm/";
module.exports = { // prefix,suffix
	MY_PKG, MY_SVC, FOR_IE, PROD, WK, isArray, min, ts,
	dir, rel, ver, fmt, dpv, keys, join, calc, pair, poly,
	cdnjs, sfile, bootc, baomt, eleme, wpcdn, ghcdn, npcdn,
};