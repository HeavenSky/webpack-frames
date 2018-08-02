import React, { Component } from "react";
import { Alert } from "antd";

class NoAu extends Component {
	state = {
		arr: [1, 2, 3, 4, 5, 6, 7, 8],
	};
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
			<div key="other" className="it-margin">
				<Alert message="法海不懂爱,页面出不来..." />
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