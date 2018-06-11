import Vue from "vue";

const entryVue = (App, res) =>
	new Vue(
		Object.assign({
			el: "#app",
			render: h => h(App),
		}, res)
	);
export default entryVue;