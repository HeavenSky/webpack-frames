import { combineReducers } from "redux";
import { SELECT_REDDIT, INVALID_REDDIT, REQUEST_REDDIT, RECEIVE_REDDIT } from "./actions";
const selected = (state = "", { type, payload }) =>
	SELECT_REDDIT.type === type ? payload : state;
const update = (state = {}, { type, payload }) => {
	const { data, date } = payload || {};
	switch (type) {
		case INVALID_REDDIT.type:
			return { ...state,
				invalid: true,
			};
		case REQUEST_REDDIT.type:
			return { ...state,
				infetch: true,
				invalid: false,
			};
		case RECEIVE_REDDIT.type:
			return { ...state,
				infetch: false,
				invalid: false,
				rows: data || [],
				lastFetch: date || "",
			};
		default:
			return state;
	}
};
const history = (state = {}, { type, payload }) => {
	let { reddit } = payload || {};
	reddit || (reddit = payload);
	switch (type) {
		case INVALID_REDDIT.type:
		case RECEIVE_REDDIT.type:
		case REQUEST_REDDIT.type:
			return { ...state,
				[reddit]: update(state[reddit],
					{ type, payload }),
			};
		default:
			return state;
	}
};
export default combineReducers({ selected, history });