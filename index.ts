import Application from "Application";

document.addEventListener("DOMContentLoaded", () => {
	const application = new Application(document.body.querySelector("main")!);
	application.run();
});
