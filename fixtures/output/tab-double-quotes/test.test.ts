import { afterEach, beforeEach, describe, expect, it } from "vitest";

// prefer-lowercase-title: titles should be lowercase
describe("my Test Suite", () => {
	// prefer-hooks-in-order: hooks should be in order (beforeAll, beforeEach, afterEach, afterAll)
	afterEach(() => {
		// cleanup
	});
	beforeEach(() => {
		// setup
	});

	// consistent-test-it: should use `it` instead of `test` inside describe
	it("should Work", () => {
		expect(1 + 1).toBe(2);
	});

	it("adds numbers", () => {
		expect(2 + 2).toBe(4);
	});
});

// consistent-test-it: top-level should also use `it`
it("top level test", () => {
	expect(true).toBe(true);
});
