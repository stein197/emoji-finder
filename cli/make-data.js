// @ts-check
const https = require("https");
const process = require("process");
const jsdom = require("jsdom");

const URL = "https://unicode.org/emoji/charts/full-emoji-list.html";

(function main(...args) {
	console.log(`Requesting ${URL}...`)
	https.get(URL, response => {
		let data = "";
		response.on("data", chunk => data += chunk);
		response.on("end", () => parse(data));
	}).on("error", err => {
		console.error(`Unable to request ${URL}: ${err.message}`)
	});
})(...process.argv.slice(2));

/**
 * @param {string} data
 */
function parse(data) {
	console.log("Parsing DOM...");
	const dom = new jsdom.JSDOM(data);
	console.log("Collecting data...");
	try {
		generate(dom);
	} catch (e) {
		console.log(`Unable to parse the data: ${e.message}`);
	}
}

/**
 * @param {jsdom.JSDOM} dom
 */
function generate(dom) {
	// TODO: Collect data into emoji.json
}
