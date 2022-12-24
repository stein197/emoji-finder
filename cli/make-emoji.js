/**
 * @typedef {{
 * 	codes: number[];
 * 	variations: {
 * 		apple?: string;
 * 		google?: string;
 * 		facebook?: string;
 * 		windows?: string;
 * 		twitter?: string;
 * 		joypixels?: string;
 * 		samsung?: string;
 * 		gmail?: string;
 * 		softbank?: string;
 * 		dcm?: string;
 * 		kddi?: string;
 * 	};
 * 	tags: string[];
 * }} Emoji
 */
// @ts-check
const fs = require("fs");
const https = require("https");
const path = require("path");
const process = require("process");
const jsdom = require("jsdom");
const config = require("../config.json");

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
		response.on("data", chunk => data += chunk.toString());
		response.on("end", () => {
			try {
				console.log("Parsing DOM...");
				const emojiData = parse(data);
				const filePath = path.normalize(path.resolve(__dirname, "..", config.url.emoji));
				console.log(`Writing data to ${filePath}...`);
				fs.writeFileSync(filePath, JSON.stringify(emojiData));
				console.log(`Data has been generated successfully!`);
			} catch (e) {
				console.log(`Unable to parse data: ${e.message}`);
			}
		})
	}).on("error", err => {
		console.error(`Unable to request ${URL}: ${err.message}\n${err.stack}`);
	});
})(...process.argv.slice(2));

/**
 * @param {string} data
 * @returns {Emoji[]}
 */
function parse(data) {
	const dom = new jsdom.JSDOM(data);
	/** @type {Emoji[]} */
	const result = [];
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
			codes: trChildren[ROW_INDEx_CODE].textContent.split(/\s+/g).map(code => +`0x${code.replace(/U\+/, "")}`),
			variations: {
				apple: trChildren[ROW_INDEX_IMAGE_APPLE]?.querySelector("img")?.getAttribute("src"),
				google: trChildren[ROW_INDEX_IMAGE_GOOGLE]?.querySelector("img")?.getAttribute("src"),
				facebook: trChildren[ROW_INDEX_IMAGE_FACEBOOK]?.querySelector("img")?.getAttribute("src"),
				windows: trChildren[ROW_INDEX_IMAGE_WINDOWS]?.querySelector("img")?.getAttribute("src"),
				twitter: trChildren[ROW_INDEX_IMAGE_TWITTER]?.querySelector("img")?.getAttribute("src"),
				joypixels: trChildren[ROW_INDEX_IMAGE_JOYPIXELS]?.querySelector("img")?.getAttribute("src"),
				samsung: trChildren[ROW_INDEX_IMAGE_SAMSUNG]?.querySelector("img")?.getAttribute("src"),
				gmail: trChildren[ROW_INDEX_IMAGE_GMAIL]?.querySelector("img")?.getAttribute("src"),
				softbank: trChildren[ROW_INDEX_IMAGE_SOFTBANK]?.querySelector("img")?.getAttribute("src"),
				dcm: trChildren[ROW_INDEX_IMAGE_DCM]?.querySelector("img")?.getAttribute("src"),
				kddi: trChildren[ROW_INDEX_IMAGE_KDDI]?.querySelector("img")?.getAttribute("src"),
			},
			tags: [currentCategoryName, trChildren[ROW_INDEX_NAME]?.textContent.toLowerCase().trim()].join(" ").split(/[^\p{L}\p{N}]/gu).filter((v, i, a) => a.indexOf(v) === i)
		});
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
