import { describe, expect, it } from "vitest";
import { add, hello, subtract } from "../src/sqid.js";

describe("hello", () => {
	it("greets the world by default", () => {
		expect(hello()).toBe("Hello, world!");
	});

	it("greets a given name", () => {
		expect(hello("pnpm")).toBe("Hello, pnpm!");
	});
});

describe("add", () => {
	it("adds two positive numbers", () => {
		expect(add(2, 3)).toBe(5);
	});

	it("handles negatives", () => {
		expect(add(-4, 1)).toBe(-3);
	});

	it("is commutative", () => {
		expect(add(7, 11)).toBe(add(11, 7));
	});
});

describe("subtract", () => {
	it("subtracts two positive numbers", () => {
		expect(subtract(9, 4)).toBe(5);
	});

	it("can go negative", () => {
		expect(subtract(3, 10)).toBe(-7);
	});
});
