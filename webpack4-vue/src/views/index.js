import App from "./main/app";
import router from "./main/router";
import { set, init, render } from "../utils/vuex";
/* https://router.vuejs.org/zh/
push方法参数如果提供了path, params会被忽略
{ name: "user", params: { userId: 123 } };
{ path: "role", query: { roleId: 234 } };
*/
const r = require.context("./", true,
	/\/(models\/.*|model)\.jsx?$/i);
r.keys().map(r).forEach(set);
render({ router, store: init(), render: h => h(App) });