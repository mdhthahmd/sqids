import Sqids, { type SqidsOptions } from "@mdhthahmd/sqids";
import { Hono } from "hono";

const bigintOptions: SqidsOptions<"bigint"> = { mode: "bigint" };
const numberSqids = new Sqids();
const bigintSqids = new Sqids(bigintOptions);

const app = new Hono();

function readNumbers(body: unknown): unknown[] {
	if (
		typeof body !== "object" ||
		body === null ||
		!("numbers" in body) ||
		!Array.isArray(body.numbers)
	) {
		throw new Error("Request body must contain a numbers array");
	}

	return body.numbers;
}

function errorMessage(error: unknown): string {
	return error instanceof Error ? error.message : "Invalid request body";
}

app.post("/sqids/number/encode", async (context) => {
	try {
		const numbers = readNumbers(await context.req.json<unknown>());
		if (!numbers.every((number) => typeof number === "number")) {
			throw new Error("Numbers must contain only numeric values");
		}

		return context.json({ id: numberSqids.encode(numbers) });
	} catch (error) {
		return context.json({ error: errorMessage(error) }, 400);
	}
});

app.get("/sqids/number/decode/:id", (context) => {
	return context.json({ numbers: numberSqids.decode(context.req.param("id")) });
});

app.post("/sqids/bigint/encode", async (context) => {
	try {
		const values = readNumbers(await context.req.json<unknown>());
		if (!values.every((value) => typeof value === "string")) {
			throw new Error("Numbers must contain only decimal strings");
		}

		return context.json({ id: bigintSqids.encode(values.map(BigInt)) });
	} catch (error) {
		return context.json({ error: errorMessage(error) }, 400);
	}
});

app.get("/sqids/bigint/decode/:id", (context) => {
	const numbers = bigintSqids.decode(context.req.param("id")).map(String);
	return context.json({ numbers });
});

export default app;
