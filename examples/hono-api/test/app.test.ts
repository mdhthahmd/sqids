import assert from "node:assert/strict";
import { describe, it } from "node:test";
import app from "../src/app.js";

describe("published Sqids package in Hono", () => {
	it("round-trips numbers through the HTTP API", async () => {
		const encodeResponse = await app.request("/sqids/number/encode", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ numbers: [1, 2, 3] }),
		});
		assert.equal(encodeResponse.status, 200);
		const encoded = (await encodeResponse.json()) as { id: string };
		assert.equal(typeof encoded.id, "string");

		const decodeResponse = await app.request(
			`/sqids/number/decode/${encoded.id}`,
		);
		assert.equal(decodeResponse.status, 200);
		assert.deepEqual(await decodeResponse.json(), { numbers: [1, 2, 3] });
	});

	it("round-trips uint64 BigInts as JSON strings", async () => {
		const numbers = ["0", "9007199254740992", "18446744073709551615"];
		const encodeResponse = await app.request("/sqids/bigint/encode", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ numbers }),
		});
		assert.equal(encodeResponse.status, 200);
		const encoded = (await encodeResponse.json()) as { id: string };

		const decodeResponse = await app.request(
			`/sqids/bigint/decode/${encoded.id}`,
		);
		assert.equal(decodeResponse.status, 200);
		assert.deepEqual(await decodeResponse.json(), { numbers });
	});
});
