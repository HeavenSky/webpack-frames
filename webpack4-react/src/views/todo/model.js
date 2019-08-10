import { UPDATE } from "../../utils/store";
const name = "todo";
export default {
	name, state: { tasks: [], filter: "all", text: "" },
	effects: {
		async SUBMIT(_, { getState, dispatch }) {
			const { text, tasks } = getState()[name];
			tasks.push({ text, done: false });
			dispatch({
				type: UPDATE, path: name,
				payload: {
					text: "",
					tasks: tasks.slice(),
				},
			});
		},
	},
};