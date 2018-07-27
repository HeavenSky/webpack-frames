import { connect } from "react-redux";
import { SELECT_REDDIT, INVALID_REDDIT, NEED_REDDIT } from "./actions";
import React from "react";
let current;
const List = ({ style, data }) => (
	<ul style={style}>
		{
			data.map(v =>
				<li key={v.id}>
					<a href={v.html_url}>{v.name}</a>
					<span>(<b>{v.stargazers_count}</b>)stars</span>
					<br /><i>{v.description}</i>
				</li>)
		}
	</ul>
);
const Switch = ({ value, change, opts }) => (
	<div>
		<span>{value}</span>
		<select value={value} onBlur={change}>
			{
				opts.map(opt =>
					<option key={opt} value={opt}>{opt}</option>)
			}
		</select>
	</div>
);
const App = ({ opts, selected, handleSwitch, lastFetch, infetch = true, handleRefresh, style, data }) => (
	<div>
		<Switch value={selected} change={handleSwitch} opts={opts} />
		<div>
			{!lastFetch || `Last Fetch data at ${lastFetch}. `}
			{!infetch && <button onClick={handleRefresh}>Refresh</button>}
		</div>
		{!data.length
			? <div>{infetch ? "Loading..." : "Empty."}</div>
			: <List style={style} data={data} />
		}
	</div>
);

const mapStateToProps = ({ selected, history }) => {
	const { lastFetch, infetch = true, rows = [] } = history[selected] || {};
	current = selected;
	return {
		selected, history,
		lastFetch, infetch,
		style: { opacity: infetch ? 0.5 : 1 },
		data: rows,
	};
};
const mapDispatchToProps = (dispatch) => ({
	handleSwitch: e => {
		current = e.target.value;
		dispatch(SELECT_REDDIT(current));
		dispatch(NEED_REDDIT(current));
	},
	handleRefresh: e => {
		dispatch(INVALID_REDDIT(current));
		dispatch(NEED_REDDIT(current));
	},
});
export default connect(mapStateToProps, mapDispatchToProps)(App);