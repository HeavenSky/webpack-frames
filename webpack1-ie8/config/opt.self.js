const { PROD, PKG_CSS, DIR_SVC, IE_SHIM, dir, pair,
	bootcdn, pkgcdn, poly, WK } = require("./basic");
// 路径常量请尽可能以`/`结尾 output.publicPath
const publicPath = undefined;
const prefixAjax = undefined;
/* *** file and folder *** */
const buildFolder = "build";
const outputFolder = "dist";
const staticFolder = "static";
const mockApiFolder = "src/mock";
const compileFolder = "src/views";
const templateFile = "src/index.html";
/* *** dll plugin config *** */
const DLL = {};
/* *** file merge config *** */
const LIB = { // 纯文本拼接,无编译过程
	/* "ie8.lib.js": ["./ie8.js", "./dom4.js"],
	"style.css": ["normalize/normalize.min.css",
		"./editor/wangeditor.min.css"],
	"jquery.js": "jquery/dist/jquery.min.js", */
};
/* *** module entry config *** */
const IPT = {
	public: [...poly, dir("src/utils/public.js")]
		.slice(PROD || IE_SHIM ? 0 : -1),
};
/* *** module cdn resource *** */
const CDN = { jquery: "$", wangeditor: "wangEditor" };
/* *** page entry config *** */
const page = ["index"];
/* *** page title config *** */
const title = "";
/* *** page ico config *** */
const ico = "favicon.ico";
/* *** css resource config *** */
const css = [
	"css/normalize.ie8.css",
	"editor/wangeditor.min.css",
	"antd/antd-1.11.6.css",
	!"fa/fa-5.x.min.css",
	// highlight.js
	!`${bootcdn}highlight.js/9.15.6/styles/atom-one-light.min.css`,
	!`${bootcdn}highlight.js/9.15.6/styles/atom-one-dark.min.css`,
	!`${bootcdn}highlight.js/9.15.6/highlight.min.js`,
	// antd-mobile
	!`${pkgcdn + pair("antd-mobile", "@")}/dist/antd-mobile.min.css`,
	!`${pkgcdn + pair("antd-mobile", "@")}/dist/antd-mobile.min.js`,
	// antd
	!`${pkgcdn + pair("antd", "@")}/dist/antd.min.css`,
	!`${pkgcdn + pair("antd", "@")}/dist/antd.min.js`,
];
/* *** js resource config *** */
const js = [
	"js/jquery.min.js",
	"js/jquery-ui.min.js",
	"editor/wangeditor.min.js",
	!"js/pace.min.js",
	!"js/fastclick.min.js",
	!"js/wangeditor.min.js",
];
/* *** page proxy config *** */
const proxy = {};
// https://webpack.docschina.org/configuration/dev-server
// https://github.com/chimurai/http-proxy-middleware#options
const optSelf = {
	publicPath, prefixAjax, compileFolder, templateFile,
	buildFolder, outputFolder, staticFolder, mockApiFolder,
	DLL, LIB, IPT, CDN, page, title, ico, css, js, proxy,
}; // 下方支持一些自定义的骚操作
WK === 1 && (delete optSelf.DLL);
if (PROD/* 生产环境玩法 */) {
	if (PKG_CSS/* 单独编译样式文件 */) {
		const styles = PKG_CSS.split(",");
		optSelf.IPT = { ...styles.map(v => "@/" + v) };
		delete optSelf.DLL;
		delete optSelf.page;
	} // PKG_CSS=star.css,ruler.less npm run dst
} else if (DIR_SVC/* 静态文件服务器 */) {
	+DIR_SVC || (optSelf.staticFolder = DIR_SVC);
	optSelf.IPT = { fns: "@/utils/fns" };
	delete optSelf.DLL;
	delete optSelf.page;
} // 生产包做静态服务器 DIR_SVC=dist npm start
module.exports = optSelf;