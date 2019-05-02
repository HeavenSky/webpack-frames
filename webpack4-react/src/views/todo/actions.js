const initor = (type, fn) => {
	typeof fn === "function" || (fn = x => x);
	const re = (...args) =>
		({ payload: fn(...args), type });
	re.type = type;
	return re;
};
export const ADD_TODO = initor("ADD_TODO");
export const TOGGLE_TODO = initor("TOGGLE_TODO");
export const SET_VISIBLE = initor("SET_VISIBLE");