import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reducer from "./reducers";
import Async from "./Async";
import { SELECT_REDDIT, FETCH_REDDIT } from "./actions";

const thunk = store => next => action => {
	typeof action === "function"
		? action(store)
		: next(action);
};
const store = createStore(reducer, applyMiddleware(thunk));

const opts = ["ActionScript", "C", "Clojure", "CoffeeScript", "CSS", "Go", "Haskell", "HTML", "Java", "JavaScript", "Lua", "Matlab", "Objective-C", "Perl", "PHP", "Python", "R", "Ruby", "Scala", "Shell", "Swift", "TeX", "TypeScript", "Vim script"];
const init = () => {
	const { getState, dispatch } = store;
	const { selected } = getState();
	selected || [SELECT_REDDIT, FETCH_REDDIT]
		.forEach(f => dispatch(f(opts[9])));
};
const App = () => (
	<Provider key={init()} store={store}>
		<Async opts={opts} />
	</Provider>
);
export default App;