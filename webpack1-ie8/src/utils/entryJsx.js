import React from "react";
import { render } from "react-dom";

const entryJsx = App => render(
	<App />, document.getElementById("app")
);
export default entryJsx;