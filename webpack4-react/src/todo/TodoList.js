import React, { Component } from "react";
import { connect } from "react-redux";
import { TOGGLE_TODO } from "./actions";

class TodoList extends Component {
	render() {
		const { list, click } = this.props;
		return <ul>
			{list.map(v => {
				const { id, text, done } = v;
				const color = done ? "#67c23a" : "#409eff";
				return <li key={id}>
					{/* eslint-disable-next-line */}
					<span onClick={click(id)} style={{ color }}>{`#${id} ${text} [${done ? "完成" : "计划中"}]`}</span>
				</li>;
			})}
		</ul>;
	}
}

const mapStateToProps = ({ list, filter }) => ({
	list: filter === "done" ? list.filter(v => v.done)
		: filter === "plan" ? list.filter(v => !v.done) : list,
});
const mapDispatchToProps = dispatch => ({
	click: id => () => dispatch(TOGGLE_TODO(id)),
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TodoList);