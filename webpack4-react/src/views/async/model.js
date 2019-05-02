import { async } from "../../utils/store";
import { jqCheck } from "../../utils/service";

const reddits = ["ActionScript", "C", "Clojure", "CoffeeScript", "CSS", "Go", "Haskell", "HTML", "Java", "JavaScript", "Lua", "Matlab", "Objective-C", "Perl", "PHP", "Python", "R", "Ruby", "Scala", "Shell", "Swift", "TeX", "TypeScript", "Vim script"];
const orders = ["asc", "desc"];
const name = "star";

const UPDATE = (dispatch, payload, path = name) =>
	dispatch(async({ payload, path }, true));
const jq = config => jqCheck($.ajax(config));
const FETCH = (dispatch, config, prefix, lock) =>
	dispatch(async({ fn: _ => jq(config), prefix, lock }));
export default {
	name,
	state: {
		reddit: "JavaScript",
		order: "desc",
		reddits, orders,
		history: {
			"JavaScript|desc": {
				data: [],
				time: "",
				fetched: false,
				loading: false,
				// 没取数据
				// 没取数据 loading
				// 取过数据
				// 取过数据 loading
			},
		},
	},
	effects: {
		async GET_DATA({ payload }, { getState, dispatch }) {
			const { reddit, order, history } = {
				...getState()[name],
				...(payload || {}),
			};
			const key = `${reddit}|${order}`;
			const { loading, fetched } = history[key] || {};
			if (!reddit || !order || loading) {
				return;
			}
			UPDATE(dispatch, { reddit, order });
			if (payload && fetched) {
				return;
			}
			UPDATE(dispatch, { loading: true }, `${name}/history/${key}`);
			FETCH(
				dispatch,
				{
					crossDomain: true,
					url: "https://api.github.com/search/repositories",
					data: { sort: "stars", q: `topic:${reddit} language:${reddit}`, order },
				},
				`${name}/REDDIT`,
				`${name}/REDDIT_${key}`
			);
		},
		async REDDIT_RESPONSE({ payload, lock }, { dispatch }) {
			const key = (lock || "").replace(/^.*_/, "");
			const [{ items } = {}] = payload || [];
			UPDATE(
				dispatch,
				{
					fetched: true,
					loading: false,
					data: items || [],
					time: new Date().toLocaleString(),
				},
				`${name}/history/${key}`
			);
		},
	},
	after: ({ dispatch }) => dispatch({ type: `${name}/GET_DATA` }),
};