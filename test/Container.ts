import "mocha";
import assert from "assert";
import Container from "app/Container";

describe("Container", () => {
	class Test {}
	describe("Container.get()", () => {
		let c: Container<[Test]>;
		beforeEach(() => c = new Container());
		it("Should return null when there is no such an added item", () => {
			assert.equal(c.get(Test), null);
		});
		it("Should return instance when it was added before", () => {
			const item = new Test();
			c.add(item);
			assert.equal(c.get(Test), item);
		});
	});
});
