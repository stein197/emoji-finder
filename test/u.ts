import assert from "assert";
// import mocha from "mocha";
import "mocha";
import * as u from "app/u";
import type {Emoji} from "app/type/Emoji";

describe("u.searchEmoji()", () => {
	const data: Emoji[] = [
		{tags: ["abc", "def", "ghi"], codes: [], variations: {}},
		{tags: ["def", "ghi", "jkl"], codes: [], variations: {}},
		{tags: ["mno", "pqr", "stu"], codes: [], variations: {}},
	];
	it("Should return all elements when the query is empty", () => {
		assert.deepStrictEqual(u.searchEmoji("", data), data);
	});
	it("Should return empty array when the array is empty", () => {
		assert.deepStrictEqual(u.searchEmoji("a", []), []);
	});
	it("Should return empty array when none of the elements satisfy the query", () => {
		assert.deepStrictEqual(u.searchEmoji("x y z", data), []);
	});
	it("Should return correct result when the query and the tags in emoji have different character cases", () => {
		assert.deepStrictEqual(u.searchEmoji("AB S U", data), [
			{tags: ["abc", "def", "ghi"], codes: [], variations: {}},
			{tags: ["mno", "pqr", "stu"], codes: [], variations: {}},
		]);
	});
	it("Should return correct result", () => {
		assert.deepStrictEqual(u.searchEmoji("ab s u", data), [
			{tags: ["abc", "def", "ghi"], codes: [], variations: {}},
			{tags: ["mno", "pqr", "stu"], codes: [], variations: {}},
		]);
	});
});