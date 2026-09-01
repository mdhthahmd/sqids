import { bench, describe } from "vitest";
import Sqids from "../src/sqids";

const sqids = new Sqids();
const numbers = [1, 2, 3, Number.MAX_SAFE_INTEGER];
const id = sqids.encode(numbers);

const bigintSqids = new Sqids({ mode: "bigint" });
const bigints = [1n, 2n, 3n, (1n << 64n) - 1n];
const bigintId = bigintSqids.encode(bigints);

const roundTripNumbers = [1, 2, 3, 4, 5];

function createUuidInputs(count: number): number[][] {
  let state = 0xf00dbabe;
  const randomUint32 = (): number => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return state >>> 0;
  };

  return Array.from({ length: count }, () => [
    randomUint32(),
    randomUint32() & 0xffff,
    (randomUint32() & 0x0fff) | 0x4000,
    (randomUint32() & 0x3fff) | 0x8000,
    randomUint32() * 0x1_0000 + (randomUint32() & 0xffff),
  ]);
}

const uuidInputs = createUuidInputs(1_000);
const noBlocklistSqids = new Sqids({ blocklist: new Set() });
const paddedSqids = new Sqids({ minLength: 50 });
const customAlphabetSqids = new Sqids({
  alphabet: "FxnXM1kBN6cuhsAvjW3Co7l2RePyY8DwaU04Tzt9fHQrqSVKdpimLGIJOgb5ZE",
});
const blockedIdSqids = new Sqids({ blocklist: new Set(["86Rf07"]) });

describe("number operations", () => {
  bench("encode numbers", () => {
    sqids.encode(numbers);
  });
  bench("decode numbers", () => {
    sqids.decode(id);
  });
});

describe("BigInt operations", () => {
  bench("encode bigints", () => {
    bigintSqids.encode(bigints);
  });
  bench("decode bigints", () => {
    bigintSqids.decode(bigintId);
  });
});

describe("encode/decode workloads", () => {
  bench("encode/decode round trip", () => {
    const encoded = sqids.encode(roundTripNumbers);
    const decoded = sqids.decode(encoded);

    if (decoded.some((number, index) => number !== roundTripNumbers[index])) {
      throw new Error("Round trip produced different numbers");
    }
  });

  bench("encode 1,000 UUID inputs", () => {
    for (const input of uuidInputs) {
      noBlocklistSqids.encode(input);
    }
  });
});

describe("configuration workloads", () => {
  bench("construct default instance", () => {
    new Sqids();
  });

  bench("encode with minimum length 50", () => {
    paddedSqids.encode([1, 2, 3]);
  });

  bench("encode with custom alphabet", () => {
    customAlphabetSqids.encode([1, 2, 3]);
  });

  bench("encode with blocked-ID retry", () => {
    blockedIdSqids.encode([1, 2, 3]);
  });
});
