// @ts-check
const https = require("https");
const process = require("process");
const jsdom = require("jsdom");

const URL = "https://unicode.org/emoji/charts/full-emoji-list.html";
const ROW_INDEx_CODE = 1;
const ROW_INDEX_IMAGE_APPLE = 3;
const ROW_INDEX_IMAGE_GOOGLE = 4;
const ROW_INDEX_IMAGE_FACEBOOK = 5;
const ROW_INDEX_IMAGE_WINDOWS = 6;
const ROW_INDEX_IMAGE_TWITTER = 7;
const ROW_INDEX_IMAGE_JOYPIXELS = 8;
const ROW_INDEX_IMAGE_SAMSUNG = 9;
const ROW_INDEX_IMAGE_GMAIL = 10;
const ROW_INDEX_IMAGE_SOFTBANK = 11;
const ROW_INDEX_IMAGE_DCM = 12;
const ROW_INDEX_IMAGE_KDDI = 13;
const ROW_INDEX_NAME = 14;

(function main(...args) {
	console.log(`Requesting ${URL}...`)
	https.get(URL, response => {
		let data = "";
		response.on("data", chunk => data += chunk);
		response.on("end", () => console.log(parse(data).slice(0, 10)));
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
		for (const trElement of Array.from(tbodyElement.children)) {
			if (isCategoryName(trElement)) {
				currentCategoryName = trElement.textContent.trim();
				continue;
			}
			if (isHeaderRow(trElement))
				continue;
			const trChildren = trElement.children;
			result.push({
				code: trChildren[ROW_INDEx_CODE].textContent,
				variations: {
					apple: trChildren[ROW_INDEX_IMAGE_APPLE].querySelector("img")?.getAttribute("src") ?? null,
					google: trChildren[ROW_INDEX_IMAGE_GOOGLE].querySelector("img")?.getAttribute("src") ?? null,
					facebook: trChildren[ROW_INDEX_IMAGE_FACEBOOK].querySelector("img")?.getAttribute("src") ?? null,
					windows: trChildren[ROW_INDEX_IMAGE_WINDOWS].querySelector("img")?.getAttribute("src") ?? null,
					twitter: trChildren[ROW_INDEX_IMAGE_TWITTER].querySelector("img")?.getAttribute("src") ?? null,
					joypixels: trChildren[ROW_INDEX_IMAGE_JOYPIXELS].querySelector("img")?.getAttribute("src") ?? null,
					samsung: trChildren[ROW_INDEX_IMAGE_SAMSUNG].querySelector("img")?.getAttribute("src") ?? null,
					gmail: trChildren[ROW_INDEX_IMAGE_GMAIL].querySelector("img")?.getAttribute("src") ?? null,
					softbank: trChildren[ROW_INDEX_IMAGE_SOFTBANK].querySelector("img")?.getAttribute("src") ?? null,
					dcm: trChildren[ROW_INDEX_IMAGE_DCM].querySelector("img")?.getAttribute("src") ?? null,
					kddi: trChildren[ROW_INDEX_IMAGE_KDDI].querySelector("img")?.getAttribute("src") ?? null,
				},
				tags: [currentCategoryName, trChildren[ROW_INDEX_NAME].textContent.trim()].join(" ").split(/[^\p{L}\p{N}]/gu)
			});
		}
	} catch (e) {
		console.log(`Unable to parse the data: ${e.message}`);
	}
	return result;
}

/**
 * @param {HTMLTableRowElement} trElement
 * @returns {boolean}
 */
function isCategoryName(trElement) {
	return trElement.childElementCount === 1;
}

/**
 * @param {HTMLTableRowElement} trElement
 * @returns {boolean}
 */
function isHeaderRow(trElement) {
	return Array.from(trElement.children).some(tdElement => tdElement.textContent.toLowerCase() === "browser");
}
