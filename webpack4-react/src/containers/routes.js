import React, { Component } from "react";
import { Alert } from "antd";
import Async from "../async";
import Todo from "../todo";

class NoAu extends Component {
	state = { arr: Array(30).fill().map((v, i) => i + 1) };
	componentDidMount() {
		const wrap = $(".sort-test");
		wrap.sortable({
			axis: "y",
			items: ">.item",
			stop: (event, ui) => {
				// http://api.jqueryui.com/sortable/#method-toArray
				const arr = wrap.sortable("toArray", { attribute: "data-idx" });
				// cancel the sort so the DOM is untouched
				wrap.sortable("cancel");
				// Update the state
				this.setState({ arr });
			},
		}).disableSelection();
	};
	render() {
		const { arr } = this.state;
		return <div className="sort-test">
			<Todo />
			<Async />
			<div key="other" className="it-margin">
				<Alert message="页面出错了, 请确认后刷新重试..." />
			</div>
			{arr.map(
				v => <div key={v} className="it-margin item" data-idx={v}>
					<Alert message={v} />
				</div>
			)}
		</div>;
	};
};
const routes = [
	{ type: "redirect", exact: true, strict: true, from: "/", to: "/home" },
	{ type: "route", component: NoAu },
];
export default routes;