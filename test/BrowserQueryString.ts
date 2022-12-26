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
	describe("BrowserQueryString.set()", () => {
		it("Should fire an event when query string changes", () => {
			const tracker = new assert.CallTracker();
			const noop = tracker.calls(() => {}, 1);
			bqs.addEventListener("change", noop);
			bqs.set({a: "abc"});
			tracker.verify();
		});
		it("Shouldn't fire an event when query string is the same", () => {
			let flag = false;
			bqs.addEventListener("change", () => flag = true);
			bqs.set({});
			assert.equal(flag, false);
		});
		it("Should pass correct query string object to listeners when \"merge\" === true", () => {
			let query;
			bqs.set({a: "1"})
			bqs.addEventListener("change", q => query = q);
			bqs.set({b: "2", c: "3"}, true);
			assert.deepStrictEqual(query, {a: "1", b: "2", c: "3"});
		});
		it("Should pass correct query string object to listeners when \"merge\" === false", () => {
			let query;
			bqs.set({a: "1"})
			bqs.addEventListener("change", q => query = q);
			bqs.set({b: "2", c: "3"}, false);
			assert.deepStrictEqual(query, {b: "2", c: "3"});
		});
	});
});
