import Vue from "vue";
import nprogress from "nprogress";
import VueRouter from "vue-router";

import Frame from "../components/subroute.vue";
import index from "../components/index.vue";
import content from "../components/content.vue";
import index1 from "../components/index.1.vue";
import index2 from "../components/index.2.vue";
import index3 from "../components/index.3.vue";
Vue.use(VueRouter);
export const routes = [
	{ path: "/", component: index },
	{ path: "/content", component: content },
	{
		path: "/user", component: Frame,
		children: [
			{ path: "/", component: index1 },
			{ path: "2", component: index2 },
			{ path: "3", component: index3 },
		],
	},
];

export const router = new VueRouter({ routes });
router.beforeEach(
	(to, from, next) => {
		nprogress.start();
		next();
	});
router.afterEach(
	(to, from) => nprogress.done()
);