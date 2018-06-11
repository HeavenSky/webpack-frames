import React, { Component } from "react";
import { Alert } from "antd";

import Http from "../components/Http";
import Push from "../components/Push";

const Home = props => "主页";
const Test = props => "测试";
class NoAu extends Component {
	state = {
		arr: [1, 2, 3, 4, 5, 6, 7, 8],
		url: null,
		file: null,
	};
	change = key => val => this.setState({ [key]: val });
	componentDidMount() {
		const wrap = $(".sort-test");
		wrap.sortable({
			axis: "y",
			items: "> .item",
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
		const { arr, url, file } = this.state;
		return <div className="ot-padding">
			<div className="sort-test">
				<div key="other" className="it-margin">
					<Alert message="法海不懂爱,页面出不来..." />
				</div>
				{arr.map(
					v => <div key={v} className="it-margin item" data-idx={v}>
						<Alert message={v} />
					</div>
				)}
			</div>
			<div className="it-margin">
				<Http value={url} onChange={this.change("url")} />
			</div>
			<Push value={file} onChange={this.change("file")} />
		</div>;
	};
};
const routes = [
	{ type: "redirect", exact: true, strict: true, from: "/", to: "/home" },
	{ type: "route", path: "/home", component: Home },
	{ type: "route", path: "/test", component: Test },
	{ type: "route", component: NoAu },
];
export default routes;