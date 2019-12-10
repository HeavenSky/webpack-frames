import React from "react";
import { connect } from "react-redux";
import { Button, Input } from "antd";
import { UPDATE } from "../../utils/store";

const opts = ["all", "plan", "done"];
const Todo = props => {
	const { tasks, filter, text, toggle,
		click, change, submit } = props;
	return <div className="todo">
		{tasks.map(({ text, done }, i) => {
			const color = done ? "#67c23a" : "#409eff";
			return <div key={i}>
				<Button type="link"
					onClick={toggle(i, !done)}
					style={{ color }}>
					{`#${i} ${text} [${done
						? "完成" : "计划中"}]`}
				</Button>
			</div>;
		})}
		<form onSubmit={submit}>
			<Input value={text} onChange={change} />
			<Button htmlType="submit">Add Todo</Button>
		</form>
		{opts.map(s =>
			<Button key={s}
				disabled={s === filter}
				onClick={click(s)}
			>{s}</Button>
		)}
	</div>;
};

const name = "todo";
const s2p = state => {
	const { tasks, filter, text } = state[name];
	if (filter === "all") { return state[name]; }
	const status = filter === "done";
	const list = tasks.filter(v => v.done === status);
	return { filter, text, tasks: list };
};
const d2p = dispatch => ({
	toggle: (i, done) => () => dispatch({
		type: UPDATE, path: `${name}/tasks/${i}`,
		payload: { done },
	}),
	click: filter => () => dispatch({
		type: UPDATE, path: name,
		payload: { filter },
	}),
	change: e => dispatch({
		type: UPDATE, path: name,
		payload: { text: e.target.value },
	}),
	submit(e) {
		dispatch({ type: name + "/SUBMIT" });
		e.preventDefault(); return false;
	},
});
export default connect(s2p, d2p)(Todo);