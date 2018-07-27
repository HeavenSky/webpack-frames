import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "./reducers";
import TodoSubmit from "./TodoSubmit";
import TodoList from "./TodoList";
import FilterList from "./FilterList";

const store = createStore(reducers);
const App = () => (
	<Provider store={store}>
		<div>
			<TodoSubmit />
			<TodoList />
			<FilterList />
		</div>
	</Provider>
);
export default App;