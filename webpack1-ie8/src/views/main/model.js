import { meet } from "../../utils/fns";
import { async } from "../../utils/store";
import { jqCheck } from "../../utils/service";

const reddits = ["ActionScript", "C", "Clojure", "CoffeeScript", "CSS", "Go", "Haskell", "HTML", "Java", "JavaScript", "Lua", "Matlab", "Objective-C", "Perl", "PHP", "Python", "R", "Ruby", "Scala", "Shell", "Swift", "TeX", "TypeScript", "Vim script"];
const orders = ["asc", "desc"];
const name = "home";

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
		patent: [],
		division: [],
		loading: false,
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
			UPDATE(dispatch, { loading: true },
				`${name}/history/${key}`);
			FETCH(dispatch, {
				crossDomain: true,
				url: "https://api.github.com/search/repositories",
				data: { sort: "stars", q: `topic:${reddit} language:${reddit}`, order },
			}, `${name}/REDDIT`, `${name}/REDDIT_${key}`);
		},
		async REDDIT_RESPONSE({ payload, lock }, { dispatch }) {
			const key = (lock || "").replace(/^.*_/, "");
			const [{ items } = {}] = payload || [];
			UPDATE(dispatch, {
				fetched: true,
				loading: false,
				data: items || [],
				time: new Date().toLocaleString(),
			}, `${name}/history/${key}`);
		},
		async GET_JSON(_, { dispatch }) {
			UPDATE(dispatch, { loading: true });
			FETCH(dispatch,
				{ url: "json/patent.json" },
				`${name}/patent`,
				`${name}/patent`
			);
			FETCH(dispatch,
				{ url: "json/division.json" },
				`${name}/division`,
				`${name}/division`
			);
			const result = await Promise.all([
				meet(`${name}/patent_RESPONSE`),
				meet(`${name}/division_RESPONSE`),
			]);
			const [patent, division] = result.map(
				({ payload }) => payload[0] || []);
			UPDATE(dispatch, { loading: false, patent, division });
		},
		async DEL_PAT({ payload }, { getState, dispatch }) {
			const { patent = [] } = getState()[name];
			const idx = patent.indexOf(payload);
			const list = patent.slice();
			list.splice(idx, 1);
			UPDATE(dispatch, { patent: list });
		},
	},
	after: ({ dispatch }) => [
		dispatch({ type: `${name}/GET_DATA` }),
		dispatch({ type: `${name}/GET_JSON` }),
	],
};