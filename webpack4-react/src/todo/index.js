import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import TodoSubmit from "./TodoSubmit";
import FilterList from "./FilterList";
import TodoList from "./TodoList";
import reducers from "./reducers";

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