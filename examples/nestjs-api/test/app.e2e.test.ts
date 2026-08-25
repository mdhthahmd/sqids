import "reflect-metadata";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("published Sqids package in NestJS", () => {
	let app: INestApplication;

	before(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		app = moduleRef.createNestApplication({ logger: false });
		await app.init();
	});

	after(async () => {
		await app.close();
	});

	it("round-trips numbers through the HTTP API", async () => {
		const encoded = await request(app.getHttpServer())
			.post("/sqids/number/encode")
			.send({ numbers: [1, 2, 3] })
			.expect(200);
		assert.equal(typeof encoded.body.id, "string");

		const decoded = await request(app.getHttpServer())
			.get(`/sqids/number/decode/${encoded.body.id}`)
			.expect(200);
		assert.deepEqual(decoded.body, { numbers: [1, 2, 3] });
	});

	it("round-trips uint64 BigInts as JSON strings", async () => {
		const numbers = ["0", "9007199254740992", "18446744073709551615"];
		const encoded = await request(app.getHttpServer())
			.post("/sqids/bigint/encode")
			.send({ numbers })
			.expect(200);

		const decoded = await request(app.getHttpServer())
			.get(`/sqids/bigint/decode/${encoded.body.id}`)
			.expect(200);
		assert.deepEqual(decoded.body, { numbers });
	});
});
