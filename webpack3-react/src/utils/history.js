import createHistory from "history/createHashHistory";

const history = createHistory();
history.listen(
	(location, action) => 0 &&
		history.push({
			pathname: "/home",
			search: "?id=1",
			state: { id: "1" },
		})
);
export default history;

// https://cn.redux.js.org
const action = ({ type, payload, meta, error, async }) => 0;
const initor = (type, fn) => {
	typeof fn === "function" || (fn = x => x);
	const re = (...args) =>
		({ payload: fn(...args), type });
	re.type = type;
	return re;
};
const creator = (type, fn, mo) => {
	typeof fn === "function" || (fn = x => x);
	typeof mo === "function" || (mo = x => x);
	const re = (argsFn, argsMo) =>
		Object.assign(
			mo.apply(null, argsMo) || {},
			{ payload: fn.apply(null, argsFn), type }
		);
	re.type = type;
	return re;
};
const thunk = store => next => action =>
	typeof action === "function"
		? action(store) : next(action);
const print = store => next => action => {
	const { console } = window;
	console.group(action.type);
	console.log("\tDispatch:\n", action);
	const result = next(action);
	console.log("\tNewState:\n", store.getState());
	console.groupEnd(action.type);
	return result;
};
export { action, initor, creator, thunk, print };
/* https://vuex.vuejs.org/zh/api
const module = {
	state: Object || Function,
	getters: { getter(state, getters, rootS, rootG) { } },
	mutations: { mutation(state, payload) { } },
	actions: { action(context, payload) { } },
};
const store = new Vuex.Store({
	modules: { module },
	getters: { getter(state, getters) { } },
}); */