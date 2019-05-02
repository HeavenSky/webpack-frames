import { set, init, render } from "../utils/store";
import App from "./main/App";

const r = require.context("./", true,
	/\/(models\/.*|model)\.jsx?$/i);
r.keys().map(r).forEach(v =>
	Object.values(v).forEach(set));
render(App, init());