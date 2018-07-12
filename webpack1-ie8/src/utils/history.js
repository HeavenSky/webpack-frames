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
const action = ({ type, payload, meta, error, async }) => 0;
const initor = (type, fn) => {
	typeof fn === "function" || (fn = x => x);
	const re = (...args) =>
		({ payload: fn(...args), type });
	re.type = type;
	return re;
};
const creator = (type, fn, meta) => {
	typeof fn === "function" || (fn = x => x);
	typeof meta === "function" || (meta = x => x);
	const re = (argsFn, argsMeta) =>
		Object.assign(
			meta.apply(null, argsMeta) || {},
			{ payload: fn.apply(null, argsFn), type }
		);
	re.type = type;
	return re;
};
export { action, initor, creator };