import React from "react";
import ReactDOMClient from "react-dom/client";
import App from "view/App";

document.addEventListener("DOMContentLoaded", () => {
	const root = ReactDOMClient.createRoot(document.body.querySelector("main")!);
	root.render(React.createElement(App));
});
