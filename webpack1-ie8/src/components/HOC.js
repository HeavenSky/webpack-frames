import React, { Component } from "react";

const HOC = Z => class extends Component {
	static displayName = `HOC(${Z.displayName || Z.name})`;
	render() { return <Z />; }
};

export default HOC;