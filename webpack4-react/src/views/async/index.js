import React from "react";
import { connect } from "react-redux";

const List = ({ style, data }) => (
	<ul style={style}>
		{(data || []).map(v =>
			<li key={v.id}>
				<a href={v.html_url}>{v.name}</a>
				<span>(<b>{v.stargazers_count}</b>)stars</span>
				<br /><i>{v.description}</i>
			</li>)}
	</ul>
);
const Switch = ({ value, change, opts }) => (
	<span>
		{/* eslint-disable-next-line */}
		<select value={value} onChange={change}>
			{opts.map(opt =>
				<option key={opt} value={opt}>{opt}</option>)}
		</select>
		<span>{value}</span>
	</span>
);
const App = ({ reddits, reddit, redditHandle, orders, order, orderHandle, handleRefresh, style, data, time, fetched, loading }) => (
	<div>
		<Switch opts={reddits} value={reddit} change={redditHandle} />
		<Switch opts={orders} value={order} change={orderHandle} />
		<div>
			{time && `Last Fetch data at ${time}. `}
			{fetched && <button onClick={handleRefresh}>Refresh</button>}
		</div>
		{data.length
			? <List style={style} data={data} />
			: <div>{loading ? "Loading..." : "Empty, no data."}</div>
		}
	</div>
);

const mapStateToProps = state => {
	const { reddit, order, history } = state.star;
	const key = `${reddit}|${order}`;
	const { data = [], time, fetched, loading } = history[key] || {};
	return {
		...state.star,
		data, time, fetched, loading,
		style: { opacity: fetched && loading ? 0.3 : 1 },
	};
};
const mapDispatchToProps = dispatch => ({
	redditHandle: e => dispatch({
		type: "star/GET_DATA",
		payload: { reddit: e.target.value },
	}),
	orderHandle: e => dispatch({
		type: "star/GET_DATA",
		payload: { order: e.target.value },
	}),
	handleRefresh: () => dispatch({
		type: "star/GET_DATA",
	}),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);