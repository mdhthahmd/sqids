import { describe, expect, expectTypeOf, it } from "vitest";
import Sqids, { defaultOptions } from "../src/sqids";

describe("options", () => {
	it.each([null, [], "invalid", 1])(
		"rejects non-object options: %j",
		(options) => {
			expect(() => new Sqids(options as never)).toThrow(
				"Options must be an object",
			);
		},
	);

	it("rejects an invalid mode", () => {
		expect(() => new Sqids({ mode: "invalid" as never })).toThrow(
			'Mode must be either "number" or "bigint"',
		);
	});

	it("rejects a non-string alphabet", () => {
		expect(() => new Sqids({ alphabet: 123 as never })).toThrow(
			"Alphabet must be a string",
		);
	});

	it("rejects a non-Set blocklist", () => {
		expect(() => new Sqids({ blocklist: [] as never })).toThrow(
			"Blocklist must be a Set of strings",
		);
	});

	it("rejects non-string blocklist entries", () => {
		expect(() => new Sqids({ blocklist: new Set([123]) as never })).toThrow(
			"Blocklist must contain only strings",
		);
	});
});

describe("default options", () => {
	it("cannot change constructor defaults through the public export", () => {
		const original = {
			alphabet: defaultOptions.alphabet,
			minLength: defaultOptions.minLength,
			mode: defaultOptions.mode,
			blocklist: new Set(defaultOptions.blocklist),
		};

		try {
			defaultOptions.alphabet = "abc";
			defaultOptions.minLength = 20;
			defaultOptions.blocklist.clear();

			const sqids = new Sqids();
			expect(sqids.encode([1, 2, 3])).toBe("86Rf07");
			expect(sqids.encode([4_572_721])).toBe("JExTR");
		} finally {
			defaultOptions.alphabet = original.alphabet;
			defaultOptions.minLength = original.minLength;
			defaultOptions.mode = original.mode;
			defaultOptions.blocklist.clear();
			for (const word of original.blocklist) {
				defaultOptions.blocklist.add(word);
			}
		}
	});
});

describe("alphabet", () => {
	it("simple", () => {
		const sqids = new Sqids({
			alphabet: "0123456789abcdef",
		});

		const numbers = [1, 2, 3];
		const id = "489158";

		expect(sqids.encode(numbers)).toBe(id);
		expect(sqids.decode(id)).toEqual(numbers);
	});

	it("short alphabet", () => {
		const sqids = new Sqids({
			alphabet: "abc",
		});

		const numbers = [1, 2, 3];
		expect(sqids.decode(sqids.encode(numbers))).toEqual(numbers);
	});

	it("long alphabet", () => {
		const sqids = new Sqids({
			alphabet:
				"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_+|{}[];:'\"/?.>,<`~",
		});

		const numbers = [1, 2, 3];
		expect(sqids.decode(sqids.encode(numbers))).toEqual(numbers);
	});

	it("multibyte characters", () => {
		expect(
			() =>
				new Sqids({
					alphabet: "ë1092",
				}),
		).toThrow("Alphabet cannot contain multibyte characters");
	});

	it("repeating alphabet characters", () => {
		expect(
			() =>
				new Sqids({
					alphabet: "aabcdefg",
				}),
		).toThrow("Alphabet must contain unique characters");
	});

	it("too short of an alphabet", () => {
		expect(
			() =>
				new Sqids({
					alphabet: "ab",
				}),
		).toThrow("Alphabet length must be at least 3");
	});
});

const maxUint64 = (1n << 64n) - 1n;

describe("bigint", () => {
	it("round-trips values across the uint64 range", () => {
		const sqids = new Sqids({ mode: "bigint" });
		const numbers = [0n, 1n, BigInt(Number.MAX_SAFE_INTEGER), maxUint64];

		expect(sqids.decode(sqids.encode(numbers))).toEqual(numbers);
	});

	it("uses the same encoding as number mode for safe integers", () => {
		const numberSqids = new Sqids();
		const bigintSqids = new Sqids({ mode: "bigint" });

		expect(bigintSqids.encode([1n, 2n, 3n])).toBe(
			numberSqids.encode([1, 2, 3]),
		);
	});

	it("round-trips padded IDs", () => {
		const sqids = new Sqids({
			mode: "bigint",
			minLength: defaultOptions.alphabet.length,
		});
		const numbers = [0n, maxUint64];

		expect(sqids.decode(sqids.encode(numbers))).toEqual(numbers);
	});

	it("rejects values outside the uint64 range and non-bigints", () => {
		const sqids = new Sqids({ mode: "bigint" });
		const encodingError = /Encoding supports bigints between 0n and/;

		expect(() => sqids.encode([-1n])).toThrow(encodingError);
		expect(() => sqids.encode([maxUint64 + 1n])).toThrow(encodingError);

		// @ts-expect-error bigint mode accepts bigint values only
		expect(() => sqids.encode([1])).toThrow(encodingError);
	});

	it("does not decode unsafe bigint values in number mode", () => {
		const bigintSqids = new Sqids({ mode: "bigint" });
		const numberSqids = new Sqids();
		const id = bigintSqids.encode([maxUint64]);

		expect(bigintSqids.decode(id)).toEqual([maxUint64]);
		expect(numberSqids.decode(id)).toEqual([]);
	});

	it("preserves mode-specific return types", () => {
		expectTypeOf(new Sqids().decode("")).toEqualTypeOf<number[]>();
		expectTypeOf(new Sqids({ mode: "number" }).decode("")).toEqualTypeOf<
			number[]
		>();
		expectTypeOf(new Sqids({ mode: "bigint" }).decode("")).toEqualTypeOf<
			bigint[]
		>();
	});

	it("exposes number mode as the default option", () => {
		expect(defaultOptions.mode).toBe("number");
	});

	it("does not accept the removed bigint option", () => {
		// @ts-expect-error bigint was replaced by mode
		new Sqids({ bigint: true });
	});

	it("rejects bigints in number mode", () => {
		const sqids = new Sqids();
		const encodingError = /Encoding supports numbers between 0 and/;

		// @ts-expect-error number mode accepts number values only
		expect(() => sqids.encode([1n])).toThrow(encodingError);
	});
});

describe("blocklist", () => {
	it("if no custom blocklist param, use the default blocklist", () => {
		const sqids = new Sqids();

		expect(sqids.decode("aho1e")).toEqual([4_572_721]);
		expect(sqids.encode([4_572_721])).toBe("JExTR");
	});

	it(`if an empty blocklist param passed, don't use any blocklist`, () => {
		const sqids = new Sqids({
			blocklist: new Set([]),
		});

		expect(sqids.decode("aho1e")).toEqual([4_572_721]);
		expect(sqids.encode([4_572_721])).toBe("aho1e");
	});

	it("if a non-empty blocklist param passed, use only that", () => {
		const sqids = new Sqids({
			blocklist: new Set([
				"ArUO", // originally encoded [100000]
			]),
		});

		// make sure we don't use the default blocklist
		expect(sqids.decode("aho1e")).toEqual([4_572_721]);
		expect(sqids.encode([4_572_721])).toBe("aho1e");

		// make sure we are using the passed blocklist
		expect(sqids.decode("ArUO")).toEqual([100_000]);
		expect(sqids.encode([100_000])).toBe("QyG4");
		expect(sqids.decode("QyG4")).toEqual([100_000]);
	});

	it("blocklist", () => {
		const sqids = new Sqids({
			blocklist: new Set([
				"JSwXFaosAN", // normal result of 1st encoding, let's block that word on purpose
				"OCjV9JK64o", // result of 2nd encoding
				"rBHf", // result of 3rd encoding is `4rBHfOiqd3`, let's block a substring
				"79SM", // result of 4th encoding is `dyhgw479SM`, let's block the postfix
				"7tE6", // result of 4th encoding is `7tE6jdAHLe`, let's block the prefix
			]),
		});

		expect(sqids.encode([1_000_000, 2_000_000])).toBe("1aYeB7bRUt");
		expect(sqids.decode("1aYeB7bRUt")).toEqual([1_000_000, 2_000_000]);
	});

	it("decoding blocklist words should still work", () => {
		const sqids = new Sqids({
			blocklist: new Set(["86Rf07", "se8ojk", "ARsz1p", "Q8AI49", "5sQRZO"]),
		});

		expect(sqids.decode("86Rf07")).toEqual([1, 2, 3]);
		expect(sqids.decode("se8ojk")).toEqual([1, 2, 3]);
		expect(sqids.decode("ARsz1p")).toEqual([1, 2, 3]);
		expect(sqids.decode("Q8AI49")).toEqual([1, 2, 3]);
		expect(sqids.decode("5sQRZO")).toEqual([1, 2, 3]);
	});

	it("match against a short blocklist word", () => {
		const sqids = new Sqids({
			blocklist: new Set(["pnd"]),
		});

		expect(sqids.decode(sqids.encode([1_000]))).toEqual([1_000]);
	});

	it("blocklist filtering in constructor", () => {
		const sqids = new Sqids({
			alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			blocklist: new Set(["sxnzkl"]), // lowercase blocklist in only-uppercase alphabet
		});

		const id = sqids.encode([1, 2, 3]);
		const numbers = sqids.decode(id);

		expect(id).toBe("IBSHOZ"); // without blocklist, would've been "SXNZKL"
		expect(numbers).toEqual([1, 2, 3]);
	});

	it("max encoding attempts", () => {
		const alphabet = "abc";
		const minLength = 3;
		const blocklist = new Set(["cab", "abc", "bca"]);

		const sqids = new Sqids({
			alphabet,
			minLength,
			blocklist,
		});

		expect(alphabet).toHaveLength(minLength);
		expect(blocklist.size).toEqual(minLength);

		expect(() => sqids.encode([0])).toThrow(
			"Reached max attempts to re-generate the ID",
		);
	});
});

describe("encoding", () => {
	it("simple", () => {
		const sqids = new Sqids();

		const numbers = [1, 2, 3];
		const id = "86Rf07";

		expect(sqids.encode(numbers)).toBe(id);
		expect(sqids.decode(id)).toEqual(numbers);
	});

	it("different inputs", () => {
		const numbers = [
			0,
			0,
			0,
			1,
			2,
			3,
			100,
			1_000,
			100_000,
			1_000_000,
			Number.MAX_SAFE_INTEGER,
		];

		const sqids = new Sqids();
		expect(sqids.decode(sqids.encode(numbers))).toEqual(numbers);
	});

	it("incremental numbers", () => {
		const sqids = new Sqids();

		const ids = {
			bM: [0],
			Uk: [1],
			gb: [2],
			Ef: [3],
			Vq: [4],
			uw: [5],
			OI: [6],
			AX: [7],
			p6: [8],
			nJ: [9],
		};

		for (const [id, numbers] of Object.entries(ids)) {
			expect(sqids.encode(numbers)).toBe(id);
			expect(sqids.decode(id)).toEqual(numbers);
		}
	});

	it("incremental numbers, same index 0", () => {
		const sqids = new Sqids();

		const ids = {
			SvIz: [0, 0],
			n3qa: [0, 1],
			tryF: [0, 2],
			eg6q: [0, 3],
			rSCF: [0, 4],
			sR8x: [0, 5],
			uY2M: [0, 6],
			"74dI": [0, 7],
			"30WX": [0, 8],
			moxr: [0, 9],
		};

		for (const [id, numbers] of Object.entries(ids)) {
			expect(sqids.encode(numbers)).toBe(id);
			expect(sqids.decode(id)).toEqual(numbers);
		}
	});

	it("incremental numbers, same index 1", () => {
		const sqids = new Sqids();

		const ids = {
			SvIz: [0, 0],
			nWqP: [1, 0],
			tSyw: [2, 0],
			eX68: [3, 0],
			rxCY: [4, 0],
			sV8a: [5, 0],
			uf2K: [6, 0],
			"7Cdk": [7, 0],
			"3aWP": [8, 0],
			m2xn: [9, 0],
		};

		for (const [id, numbers] of Object.entries(ids)) {
			expect(sqids.encode(numbers)).toBe(id);
			expect(sqids.decode(id)).toEqual(numbers);
		}
	});

	it("multi input", () => {
		const sqids = new Sqids();

		const numbers = [
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
			21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
			39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
			57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
			75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
			93, 94, 95, 96, 97, 98, 99,
		];
		const output = sqids.decode(sqids.encode(numbers));
		expect(numbers).toEqual(output);
	});

	it("accepts readonly numbers", () => {
		const numbers = [1, 2, 3] as const;
		const sqids = new Sqids();

		expect(sqids.decode(sqids.encode(numbers))).toEqual(numbers);
	});

	it("accepts a readonly blocklist", () => {
		const blocklist: ReadonlySet<string> = new Set(["86Rf07"]);
		const sqids = new Sqids({ blocklist });

		expect(sqids.encode([1, 2, 3])).toBe("se8ojk");
	});

	it("encoding no numbers", () => {
		const sqids = new Sqids();
		expect(sqids.encode([])).toBe("");
	});

	it("decoding empty string", () => {
		const sqids = new Sqids();
		expect(sqids.decode("")).toEqual([]);
	});

	it("decoding an ID with an invalid character", () => {
		const sqids = new Sqids();
		expect(sqids.decode("*")).toEqual([]);
	});

	it("encode out-of-range numbers", () => {
		const sqids = new Sqids();
		const encodingError = `Encoding supports numbers between 0 and ${Number.MAX_SAFE_INTEGER}`;

		expect(() => sqids.encode([-1])).toThrow(encodingError);
		expect(() => sqids.encode([Number.MAX_SAFE_INTEGER + 1])).toThrow(
			encodingError,
		);
	});
});

describe("min length", () => {
	it.each([-1, 256, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
		"rejects invalid value %s",
		(minLength) => {
			expect(() => new Sqids({ minLength })).toThrow(
				"Minimum length has to be between 0 and 255",
			);
		},
	);

	it("simple", () => {
		const sqids = new Sqids({
			minLength: defaultOptions.alphabet.length,
		});

		const numbers = [1, 2, 3];
		const id = "86Rf07xd4zBmiJXQG6otHEbew02c3PWsUOLZxADhCpKj7aVFv9I8RquYrNlSTM";

		expect(sqids.encode(numbers)).toBe(id);
		expect(sqids.decode(id)).toEqual(numbers);
	});

	it("incremental", () => {
		const numbers = [1, 2, 3];

		const map = {
			6: "86Rf07",
			7: "86Rf07x",
			8: "86Rf07xd",
			9: "86Rf07xd4",
			10: "86Rf07xd4z",
			11: "86Rf07xd4zB",
			12: "86Rf07xd4zBm",
			13: "86Rf07xd4zBmi",
			[defaultOptions.alphabet.length + 0]:
				"86Rf07xd4zBmiJXQG6otHEbew02c3PWsUOLZxADhCpKj7aVFv9I8RquYrNlSTM",
			[defaultOptions.alphabet.length + 1]:
				"86Rf07xd4zBmiJXQG6otHEbew02c3PWsUOLZxADhCpKj7aVFv9I8RquYrNlSTMy",
			[defaultOptions.alphabet.length + 2]:
				"86Rf07xd4zBmiJXQG6otHEbew02c3PWsUOLZxADhCpKj7aVFv9I8RquYrNlSTMyf",
			[defaultOptions.alphabet.length + 3]:
				"86Rf07xd4zBmiJXQG6otHEbew02c3PWsUOLZxADhCpKj7aVFv9I8RquYrNlSTMyf1",
		};

		for (const [minLength, id] of Object.entries(map)) {
			const sqids = new Sqids({
				minLength: Number(minLength),
			});

			expect(sqids.encode(numbers)).toBe(id);
			expect(sqids.encode(numbers)).toHaveLength(Number(minLength));
			expect(sqids.decode(id)).toEqual(numbers);
		}
	});

	it("incremental numbers", () => {
		const sqids = new Sqids({
			minLength: defaultOptions.alphabet.length,
		});

		const ids = {
			SvIzsqYMyQwI3GWgJAe17URxX8V924Co0DaTZLtFjHriEn5bPhcSkfmvOslpBu: [0, 0],
			n3qafPOLKdfHpuNw3M61r95svbeJGk7aAEgYn4WlSjXURmF8IDqZBy0CT2VxQc: [0, 1],
			tryFJbWcFMiYPg8sASm51uIV93GXTnvRzyfLleh06CpodJD42B7OraKtkQNxUZ: [0, 2],
			eg6ql0A3XmvPoCzMlB6DraNGcWSIy5VR8iYup2Qk4tjZFKe1hbwfgHdUTsnLqE: [0, 3],
			rSCFlp0rB2inEljaRdxKt7FkIbODSf8wYgTsZM1HL9JzN35cyoqueUvVWCm4hX: [0, 4],
			sR8xjC8WQkOwo74PnglH1YFdTI0eaf56RGVSitzbjuZ3shNUXBrqLxEJyAmKv2: [0, 5],
			uY2MYFqCLpgx5XQcjdtZK286AwWV7IBGEfuS9yTmbJvkzoUPeYRHr4iDs3naN0: [0, 6],
			"74dID7X28VLQhBlnGmjZrec5wTA1fqpWtK4YkaoEIM9SRNiC3gUJH0OFvsPDdy": [0, 7],
			"30WXpesPhgKiEI5RHTY7xbB1GnytJvXOl2p0AcUjdF6waZDo9Qk8VLzMuWrqCS": [0, 8],
			moxr3HqLAK0GsTND6jowfZz3SUx7cQ8aC54Pl1RbIvFXmEJuBMYVeW9yrdOtin: [0, 9],
		};

		for (const [id, numbers] of Object.entries(ids)) {
			expect(sqids.encode(numbers)).toBe(id);
			expect(sqids.decode(id)).toEqual(numbers);
		}
	});

	it("min lengths", () => {
		for (const minLength of [0, 1, 5, 10, defaultOptions.alphabet.length]) {
			for (const numbers of [
				[0],
				[0, 0, 0, 0, 0],
				[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				[100, 200, 300],
				[1_000, 2_000, 3_000],
				[1_000_000],
				[Number.MAX_SAFE_INTEGER],
			]) {
				const sqids = new Sqids({
					minLength,
				});

				const id = sqids.encode(numbers);
				expect(id.length).toBeGreaterThanOrEqual(minLength);
				expect(sqids.decode(id)).toEqual(numbers);
			}
		}
	});

	it("out-of-range invalid min length", () => {
		const minLengthLimit = 255;
		const minLengthError = `Minimum length has to be between 0 and ${minLengthLimit}`;

		expect(
			() =>
				new Sqids({
					minLength: -1,
				}),
		).toThrow(minLengthError);

		expect(
			() =>
				new Sqids({
					minLength: minLengthLimit + 1,
				}),
		).toThrow(minLengthError);
	});
});
