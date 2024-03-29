import "mocha";
import assert from "assert";
import * as util from "app/util";

describe("util.searchEmoji()", () => {
	const data: app.emoji.Emoji[] = [
		{tags: ["abc", "def", "ghi"], codes: [], variations: {}},
		{tags: ["def", "ghi", "jkl"], codes: [], variations: {}},
		{tags: ["mno", "pqr", "stu"], codes: [], variations: {}}
	];
	it("Should return all elements when the query is empty", () => {
		assert.deepStrictEqual(util.searchEmoji("", data), data);
	});
	it("Should return empty array when the array is empty", () => {
		assert.deepStrictEqual(util.searchEmoji("a", []), []);
	});
	it("Should return empty array when none of the elements satisfy the query", () => {
		assert.deepStrictEqual(util.searchEmoji("x y z", data), []);
	});
	it("Should return correct result when the query and the tags in emoji have different character cases", () => {
		assert.deepStrictEqual(util.searchEmoji("DEF H", data), [
			{tags: ["abc", "def", "ghi"], codes: [], variations: {}},
			{tags: ["def", "ghi", "jkl"], codes: [], variations: {}}
		]);
	});
	it("Should return correct result", () => {
		assert.deepStrictEqual(util.searchEmoji("def h", data), [
			{tags: ["abc", "def", "ghi"], codes: [], variations: {}},
			{tags: ["def", "ghi", "jkl"], codes: [], variations: {}}
		]);
	});
});

describe("util.className()", () => {
	it("Should return empty string for empty array", () => {
		assert.equal(util.className().className, "");
	});
	it("Should return string as is if there are no empty items", () => {
		assert.equal(util.className("one", "two", "three").className, "one two three");
	});
	it("Should filter out empty entries when there are empty ones", () => {
		assert.equal(util.className("one", "", "three").className, "one three");
	});
});
