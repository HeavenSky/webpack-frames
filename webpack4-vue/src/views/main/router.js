import Vue from "vue";
import ElementUI from "element-ui";
import VueRouter from "vue-router";

import { wrap } from "../../utils/vuex";
import frame from "./frame.vue";
import index from "./index.vue";
import index1 from "./index.1.vue";
import index2 from "./index.2.vue";
import index3 from "./index.3.vue";
import content from "./content.vue";

Vue.use(ElementUI);
Vue.use(VueRouter);
const routes = [
	{ path: "/", component: index },
	{ path: "/content", component: content },
	{
		path: "/user", component: frame,
		children: [
			{ path: "/", component: index1 },
			{ path: "2", component: index2 },
			{ path: "3", component: index3 },
		],
	},
];
const router = new VueRouter({ routes });
wrap(router); export default router;