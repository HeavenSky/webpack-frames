import React, { Component } from "react";
import { connect } from "react-redux";
import { ADD_TODO } from "./actions";

class TodoSubmit extends Component {
	id = 1;
	getInput = node => (this.input = node);
	submit = e => {
		const { click } = this.props;
		const text = this.input.value;
		if (/\S+/.test(text || "")) {
			click(this.id++, text);
			this.input.value = "";
		}
		e.preventDefault();
		return false;
	};
	render() {
		return <form onSubmit={this.submit}>
			<input ref={this.getInput} />
			<button type="submit">Add Todo</button>
		</form>;
	}
}

const mapStateToProps = undefined;
const mapDispatchToProps = dispatch => ({
	click: (id, text) => dispatch(ADD_TODO({ id, text })),
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TodoSubmit);