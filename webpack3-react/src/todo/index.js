import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "./reducers";
import TodoSubmit from "./TodoSubmit";
import FilterList from "./FilterList";
import TodoList from "./TodoList";

const store = createStore(reducers);
const App = () => (
	<Provider store={store}>
		<div>
			<TodoSubmit />
			<FilterList />
			<TodoList />
		</div>
	</Provider>
);
export default App;