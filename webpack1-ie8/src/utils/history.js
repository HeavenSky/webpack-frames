import createHistory from "history/createHashHistory";

const history = createHistory();
history.listen(
	(location, action) => 0 &&
		history.push({
			pathname: "/home",
			search: "?id=1",
			state: { id: "1" },
		})
);
export default history;