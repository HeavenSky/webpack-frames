import Vue from "vue";
import nprogress from "nprogress";
import VueRouter from "vue-router";
import { Button } from "element-ui";

import Frame from "./frame.vue";
import index from "./index.vue";
import index1 from "./index.1.vue";
import index2 from "./index.2.vue";
import index3 from "./index.3.vue";
import content from "./content.vue";

Vue.use(VueRouter);
Vue.use(Button, { size: "mini" });
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