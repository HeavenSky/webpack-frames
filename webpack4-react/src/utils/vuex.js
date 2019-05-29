import Vue from "vue";
import Vuex from "vuex";
import nprogress from "nprogress";
import { isFunction } from "./fns";

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
// 全局处理默认展示
Vue.prototype.$ELEMENT = {
	zIndex: 1111,
	size: "mini",
};
Vue.prototype.$IVIEW = {
	transfer: true,
	size: "small",
};
Vue.use(Vuex);
// 自动加载module的封装实现
const modules = {};
export const set = mod => Object.assign(modules, mod || {});
export const init = () => new Vuex.Store({ modules });
export const render = ob => new Vue({ el: "#app", ...ob });
/* https://vuex.vuejs.org/zh/api vuex中文api
const r = require.context("./main", true,
	/\/(models\/.*|model)\.jsx?$/i);
r.keys().map(r).forEach(set);
render({ router, store: init(), render: h => h(App) });
store.commit(mutation) || put({ type: reducer });
store.dispatch(action) || put({ type: effect });
export const module = {
	namespaced: true,
	state: {},
	getters: {},
	actions: {},
	mutations: {},
}; */