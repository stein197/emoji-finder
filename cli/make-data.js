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
		response.on("end", () => console.log(parse(data)));
	}).on("error", err => {
		console.error(`Unable to request ${URL}: ${err.message}`)
	});
})(...process.argv.slice(2));

/**
 * @param {string} data
 * @returns {{}[]}
 */
function parse(data) {
	console.log("Parsing DOM...");
	const dom = new jsdom.JSDOM(data);
	console.log("Collecting data...");
	const result = [];
	try {
		const tbodyElement = dom.window.document.body.querySelector("tbody")
		let currentCategoryName = "";
		let i = 0;
		for (const trElement of Array.from(tbodyElement.children)) {
			i++;
			const item = {};
			const trChildren = Array.from(trElement.children);
			if (trChildren.length === 1) {
				currentCategoryName = trElement.textContent.trim();
			} else {
				item.code = trChildren[1].textContent;
				item.variations = {
					apple: trChildren[3].querySelector("img")?.getAttribute("src"),
					google: trChildren[4].querySelector("img")?.getAttribute("src"),
					facebook: trChildren[5].querySelector("img")?.getAttribute("src"),
					windows: trChildren[6].querySelector("img")?.getAttribute("src"),
					twitter: trChildren[7].querySelector("img")?.getAttribute("src"),
					joy: trChildren[8].querySelector("img")?.getAttribute("src"),
					samsung: trChildren[9].querySelector("img")?.getAttribute("src"),
					gmail: trChildren[10].querySelector("img")?.getAttribute("src"),
					sb: trChildren[11].querySelector("img")?.getAttribute("src"),
					dcm: trChildren[12].querySelector("img")?.getAttribute("src"),
					kddi: trChildren[13].querySelector("img")?.getAttribute("src"),
				};
				item.category = [currentCategoryName, trChildren[14].textContent.trim()].join(" ");
			}
			result.push(item);
		}
	} catch (e) {
		console.log(`Unable to parse the data: ${e.message}`);
	}
	return result;
}
