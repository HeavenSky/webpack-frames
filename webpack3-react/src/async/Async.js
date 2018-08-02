import React from "react";
import { connect } from "react-redux";
import { SELECT_REDDIT, INVALID_REDDIT, NEED_REDDIT } from "./actions";

const List = ({ style, data }) => (
	<ul style={style}>
		{data.map(v =>
			<li key={v.id}>
				<a href={v.html_url}>{v.name}</a>
				<span>(<b>{v.stargazers_count}</b>)stars</span>
				<br /><i>{v.description}</i>
			</li>)}
	</ul>
);
const Switch = ({ value, change, opts }) => (
	<div>
		{/* eslint-disable-next-line */}
		<select value={value} onChange={change}>
			{opts.map(opt =>
				<option key={opt} value={opt}>{opt}</option>)}
		</select>
		<span>{value}</span>
	</div>
);
const App = ({ opts, selected, handleSwitch, lastFetch, infetch, handleRefresh, style, data }) => (
	<div>
		<Switch value={selected} change={handleSwitch} opts={opts} />
		<div>
			{lastFetch && `Last Fetch data at ${lastFetch}. `}
			{infetch === false && <button onClick={handleRefresh(selected)}>Refresh</button>}
		</div>
		{data.length
			? <List style={style} data={data} />
			: <div>{infetch ? "Loading..." : "Empty, no data."}</div>
		}
	</div>
);

const mapStateToProps = ({ selected, history }) => {
	const { lastFetch, infetch, rows = [] } = history[selected] || {};
	return {
		selected, history,
		lastFetch, infetch,
		style: { opacity: infetch ? 0.5 : 1 },
		data: rows,
	};
};
const mapDispatchToProps = (dispatch) => ({
	handleSwitch: e => {
		const reddit = e.target.value;
		dispatch(SELECT_REDDIT(reddit));
		dispatch(NEED_REDDIT(reddit));
	},
	handleRefresh: reddit => e => {
		dispatch(INVALID_REDDIT(reddit));
		dispatch(NEED_REDDIT(reddit));
	},
});
export default connect(mapStateToProps, mapDispatchToProps)(App);