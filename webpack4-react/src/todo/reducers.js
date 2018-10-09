import { combineReducers } from "redux";
import { ADD_TODO, TOGGLE_TODO, SET_VISIBLE } from "./actions";

const list = (state = [], { type, payload }) => {
	const item = state.find(v => v.id === payload);
	switch (type) {
		case ADD_TODO.type:
			// payload = { id, text };
			return state.concat(
				Object.assign({ done: false }, payload)
			);
		case TOGGLE_TODO.type:
			// payload = id;
			item && (item.done = !item.done);
			return item ? state.slice() : state;
		default:
			return state;
	}
};
const filter = (state = "all", { type, payload }) => {
	switch (type) {
		case SET_VISIBLE.type:
			// payload = filter;
			return payload;
		default:
			return state;
	}
};

export default combineReducers({ list, filter });