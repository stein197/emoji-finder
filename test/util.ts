import assert from "assert";
import "mocha";
import * as util from "app/util";
import type {Emoji} from "app/type/Emoji";

describe("u.searchEmoji()", () => {
	const data: Emoji[] = [
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