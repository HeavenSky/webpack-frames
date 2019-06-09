const { NODE_ENV, PKG_CSS, DIR_SVC, IE_SHIM } = process.env;
const PROD = NODE_ENV === "production";
/* *** directory *** */
const path = require("path");
const rel = path.relative.bind(null);
const dir = path.join.bind(null, __dirname, ".."); // 根目录
const pkg = require(dir("package.json"));
/* *** functions *** */
const { isArray } = Array;
const isFunc = v => typeof v === "function";
const dst = v => [...new Set(v)].filter(Boolean);
dst.every = (v, fn) => Object.keys(v || {}).forEach(fn);
const fmt = (func, app) => isFunc(func) ? func(app) : func;
const { dependencies = {}, devDependencies = {} } = pkg;
const dps = { ...dependencies, ...devDependencies };
const dpv = v => (dps[v] || "").replace(/^\D+|\D+$/g, "");
const calc = mod => parseFloat(dpv(mod)); // 异常就返回NaN
// 用 dpv(mod).split(/\D+/).map(parseFloat); 更合适
const pair = (mod, s) => (s ? mod + s : "") + dpv(mod);
/* *** constants *** */
const ts = new Date().toISOString().replace(/[.:-]/g, "_");
const ver = `${PROD ? "-[hash:5]" : ""}-${pkg.version}`;
const min = PROD ? ".min" : "";
// ie8 在引入 babel-polyfill 前必须先引入 es5-shim
let poly = ["babel-polyfill", "@babel/polyfill"].find(dpv);
poly = poly ? [poly] : [];
// ie 系列浏览器支持 antd 必须引入 media-match
dpv("antd") && poly.push("media-match");
// ie 系列浏览器支持 react16 必须引入 raf/polyfill
calc("react") >= 16 && poly.push("raf/polyfill");
let WK = calc("webpack"); // 获取webpack版本
WK = WK < 2 ? 1 : WK < 4 ? 3 : WK; // 标准化版本号
/* *** hash format *** */
const verh = v => {
	["chunk", "content", "module"].includes(v) || (v = "");
	return ver.replace(
		/(chunk|content|module)?hash/gi, v + "hash"
	);
};
// const prefix = "";
// const suffix = "";
/* *** repository *** */
const bootcdn = "https://cdn.bootcss.com/";
const sfile = "https://cdn.staticfile.org/";
const cdnjs = "https://cdnjs.cloudflare.com/ajax/libs/";
const pkgcdn = "https://cdn.jsdelivr.net/npm/";
const ghcdn = "https://cdn.jsdelivr.net/gh/";
const wpcdn = "https://cdn.jsdelivr.net/wp/";
const elecdn = "https://npm.elemecdn.com/";
// https://unpkg.com/pkg/ https://jsdelivr.com/package/npm/
module.exports = {
	PROD, PKG_CSS, DIR_SVC, IE_SHIM, isArray, isFunc, verh,
	rel, dir, dst, fmt, dpv, calc, pair, ts, ver, min, poly,
	bootcdn, sfile, cdnjs, pkgcdn, ghcdn, wpcdn, elecdn, WK,
};