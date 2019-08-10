import React from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import Select from "../../components/Select";

const List = ({ style, data }) => <ol style={style}>
	{(data || []).map(v =>
		<li key={v.id}>
			<a href={v.html_url}>{v.name}</a>
			<span>(<b>{v.stargazers_count}</b>)stars</span>
			<br /><i>{v.description}</i>
		</li>)}
</ol>;
const App = ({ reddits, reddit, redditHandle, orders, order, orderHandle, handleRefresh, style, data, time, fetched, loading }) => (
	<div>
		<Select value={reddit} onChange={redditHandle} openSearch
			options={reddits.map(k => ({ label: k, value: k }))} />
		<Select value={order} onChange={orderHandle} openSearch
			options={orders.map(k => ({ label: k, value: k }))} />
		<div>
			{time && `Last Fetch data at ${time}. `}
			{fetched && <Button onClick={handleRefresh}>Refresh</Button>}
		</div>
		{data.length
			? <List style={style} data={data} />
			: <div>{loading ? "Loading..." : "Empty, no data."}</div>
		}
	</div>
);

const name = "async";
const mapStateToProps = state => {
	const { reddit, order, history } = state[name];
	const key = `${reddit}|${order}`;
	const { data = [], time, fetched, loading } = history[key] || {};
	return {
		...state[name],
		data, time, fetched, loading,
		style: { opacity: fetched && loading ? 0.3 : 1 },
	};
};
const mapDispatchToProps = dispatch => ({
	redditHandle: reddit => dispatch({
		type: name + "/GET_DATA",
		payload: { reddit },
	}),
	orderHandle: order => dispatch({
		type: name + "/GET_DATA",
		payload: { order },
	}),
	handleRefresh: () => dispatch({
		type: name + "/GET_DATA",
	}),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);