export const test = {
	namespaced: true,
	state: {
		user: 1234,
		name: "成为",
		tid: 34567,
	},
	getters: {
		nid: state => `${state.user}-${state.tid}`,
	},
	actions: {},
	mutations: {},
};