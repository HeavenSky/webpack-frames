import React, { Component } from "react";
import { connect } from "react-redux";
import { TOGGLE_TODO } from "./actions";

class TodoList extends Component {
	render() {
		const { list, click } = this.props;
		return <div>
			{list.map(v => {
				const { id, text, done } = v;
				const color = done ? "#67c23a" : "#409eff";
				// eslint-disable-next-line
				return <div key={id} onClick={click(id)} style={{ color }}>
					{`#${id} ${text} ${done ? "完成" : "计划中"}`}
				</div>;
			})}
		</div>;
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