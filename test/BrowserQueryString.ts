import "mocha";
import assert from "assert";
import jsdom from "jsdom";
import BrowserQueryString from "app/BrowserQueryString";

describe("BrowserQueryString", () => {
	let bqs: BrowserQueryString<{a: string, b: string, c: string}>;
	beforeEach(() => {
		const dom = new jsdom.JSDOM("", {
			url: "https://localhost"
		});
		bqs = new BrowserQueryString(dom.window);
	});
	describe("BrowserQueryString.data", () => {
		it("Should return correct object when \"merge\" === true", () => {
			bqs.set({a: "1"})
			bqs.set({b: "2", c: "3"}, true);
			assert.deepStrictEqual(bqs.data, {a: "1", b: "2", c: "3"});
		});
		it("Should return correct object \"merge\" === false", () => {
			bqs.set({a: "1"})
			bqs.set({b: "2", c: "3"}, false);
			assert.deepStrictEqual(bqs.data, {b: "2", c: "3"});
		});
		it("Should return the same object when empty one was set and \"merge\" === true", () => {
			bqs.set({a: "1"});
			bqs.set({}, true);
			assert.deepStrictEqual(bqs.data, {a: "1"});
		});
		it("Should return empty when empty one was set and \"merge\" === false", () => {
			bqs.set({a: "1"});
			bqs.set({}, false);
			assert.deepStrictEqual(bqs.data, {});
		});
	});
});
