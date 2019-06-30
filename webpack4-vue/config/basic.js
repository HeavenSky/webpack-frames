const { NODE_ENV, PKG_CSS, DIR_SVC, IE_SHIM } = process.env;
const PROD = NODE_ENV === "production";
/* *** directory *** */
const path = require("path");
const dir = path.resolve.bind(path);
const rel = path.relative.bind(path);
const pkg = require(dir("package.json"));
/* *** functions *** */
const { isArray } = Array;
const isFn = v => typeof v === "function";
const dmt = v => [...new Set(v)].filter(Boolean);
dmt.keys = v => Object.keys(v || {});
dmt.vals = v => Object.values(v || {});
dmt.merge = (...v) => Object.assign({}, ...v);
const fmt = (func, app) => isFn(func) ? func(app) : func;
const { version, dependencies, devDependencies } = pkg;
const dps = dmt.merge(dependencies, devDependencies);
const dpv = v => (dps[v] || "").replace(/^\D+|\D+$/g, "");
const calc = mod => parseFloat(dpv(mod)); // 异常就返回NaN
// 用 dpv(mod).split(/\D+/).map(parseFloat); 更合适
const pair = (mod, s) => (s ? mod + s : "") + dpv(mod);
/* *** constants *** */
const ts = new Date().toISOString().replace(/[.:-]/g, "_");
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
const ver = v => ["[name]", PROD ? `[${v || ""}hash:5]`
	: "", `${version}`].join("-"); // chunk|content|module
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
	PROD, PKG_CSS, DIR_SVC, IE_SHIM, isArray, WK, ver,
	dir, rel, dmt, fmt, dpv, calc, pair, ts, min, poly,
	bootcdn, sfile, cdnjs, pkgcdn, ghcdn, wpcdn, elecdn,
};