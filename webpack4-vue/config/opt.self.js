const { MY_PKG, MY_SVC, FOR_IE, PROD, min, dmt: { join },
	bootcdn, pkgcdn } = require("./basic");
/* *** file and folder *** */
const buildFolder = "build";
const outputFolder = "dist";
const staticFolder = "static";
const mockApiFolder = "src/mock";
const compileFolder = "src/views";
const templateFile = "src/index.html";
/* *** file merge config *** */
const LIB = { // 纯文本拼接,无编译过程
	/* "ie8.lib.js": ["./ie8.js", "./dom4.js"],
	"style.css": ["normalize/normalize.min.css",
		"./editor/wangeditor.min.css"],
	"jquery.js": "jquery/dist/jquery.min.js", */
};
/* *** module entry config *** */
const IPT = {};
/* *** html title config *** */
const title = "";
/* *** html ico config *** */
const ico = "favicon.ico";
/* *** html css resource *** */
const css = [
	!"fa/fa-5.x.min.css",
	"editor/wangeditor.min.css",
	`${bootcdn}normalize/8.0.1/normalize.min.css`,
	// highlight.js
	!`${pkgcdn}highlight.js/lib/highlight.min.js`,
	!`${pkgcdn}highlight.js/styles/atom-one-dark.min.css`,
	!`${pkgcdn}highlight.js/styles/atom-one-light.min.css`,
	// element-ui
	!`${pkgcdn}element-ui/lib/index.js`,
	!`${pkgcdn}element-ui/lib/theme-chalk/index.css`,
	// vant
	!`${pkgcdn}vant/lib/index.css`,
	!`${pkgcdn}vant/lib/vant.min.js`,
];
const ie = FOR_IE; const shim = "polyfill";
/* *** html js resource *** */
const js = [
	ie && `${pkgcdn}@babel/${shim}/dist/${shim}.min.js`,
	!`${pkgcdn}@ant-design/icons/lib/umd.js`,
	`${bootcdn}jquery/3.4.1/jquery.min.js`,
	"editor/wangeditor.min.js",
	!"js/wangeditor.min.js",
	!"js/fastclick.min.js",
	!"js/pace.min.js",
];
/* *** html entry config *** */
const page = ["index"];
/* *** below whole config *** */
const optSelf = {
	buildFolder, outputFolder, staticFolder,
	mockApiFolder, compileFolder, templateFile,
	LIB, IPT, title, ico, css, js, page,
}; // 生产包做静态服务器 MY_SVC=dist npm start
if (!PROD && MY_SVC) {
	+MY_SVC || (optSelf.staticFolder = MY_SVC);
	optSelf.IPT = { fns: "@/utils/fns" };
	delete optSelf.page; // 仅启动静态文件服务
} else if (PROD && MY_PKG) {
	optSelf.IPT = { ...MY_PKG.split(",") };
	delete optSelf.page; // 单独编译一些文件
} // MY_PKG=a.js,b.css,c.less npm run app
/* *** 开发用本地cdn,生产用外域cdn *** */
LIB[`vue-all${min}.js`] = [
	`vue/dist/vue${min}.js`,
	`vuex/dist/vuex${min}.js`,
	`vue-router/dist/vue-router${min}.js`,
];
/* *** modify final configuration *** */
optSelf.modify = config => !join(config.externals, {
	vue: "Vue", vuex: "Vuex", "vue-router": "VueRouter",
});
module.exports = optSelf;