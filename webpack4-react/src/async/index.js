import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { SELECT_REDDIT, FETCH_REDDIT } from "./actions";
import { thunk, print } from "../utils/history";
import reducer from "./reducers";
import Async from "./Async";

const store = createStore(reducer, applyMiddleware(thunk, print));
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