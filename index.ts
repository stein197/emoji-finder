import Application from "app/Application";

document.addEventListener("DOMContentLoaded", () => {
	const application = new Application(window, document.body.querySelector("main")!);
	application.run();
});
