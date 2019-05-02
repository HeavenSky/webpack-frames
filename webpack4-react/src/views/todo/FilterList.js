import React, { Component } from "react";
import { connect } from "react-redux";
import { SET_VISIBLE } from "./actions";

const STATUS = ["all", "plan", "done"];
class FilterList extends Component {
	render() {
		const { filter, click } = this.props;
		return <div>
			{STATUS.map(s =>
				<button key={s}
					disabled={s === filter}
					onClick={click(s)}
				>{s}</button>
			)}
		</div>;
	}
}

const mapStateToProps = ({ filter }) => ({ filter });
const mapDispatchToProps = dispatch => ({
	click: filter => () => dispatch(SET_VISIBLE(filter)),
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FilterList);