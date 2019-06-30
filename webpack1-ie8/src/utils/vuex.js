import Vue from "vue";
import Vuex from "vuex";
import nprogress from "nprogress";
import { isFunction, join, log } from "./fns";

Vue.use(Vuex); // 全局处理ELEMENT和IVIEW的默认展示
Vue.prototype.$ELEMENT = { zIndex: 1111, size: "mini" };
Vue.prototype.$IVIEW = { transfer: true, size: "small" };
export const wrap = (router, before, after) => {
	router.beforeEach((to, from, next) => {
		nprogress.start();
		const res = isFunction(before) && before(to, from);
		Promise.resolve(res).then(route => {
			if (!route) { throw new Error(); }
			return [next(route), nprogress.done()];
		}).catch(() => next());
	});
	router.afterEach((to, from) => {
		nprogress.done();
		isFunction(after) && after(to, from);
	});
};
const modules = {}; // 自动加载module的封装实现
modules.ROOT = { mutations: { log }, actions: { log } };
export const set = (...v) => join(modules, ...v);
export const init = () => new Vuex.Store({ modules });
export const render = ob => new Vue({ el: "#app", ...ob });
/* const r = require.context("./main", true,
	/\/(models\/.*|model)\.jsx?$/i);
set(...r.keys().map(r)); // set支持传参多个设置module
render({ router, store: init(), render: h => h(App) });
const name = { // https://vuex.vuejs.org/zh/api 接口文档
	namespaced: true, // 开启命名空间 用index.d.ts查看具体接口
	state: {}, getters: {}, actions: {}, mutations: {},
}; // commit(mutation)=reducer;dispatch(action)=effect
// commit,dispatch参数type,payload,opt或payloadWithType,opt
// mutation参数state,payload;action参数context,payload */