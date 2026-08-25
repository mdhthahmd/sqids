import Sqids, { type SqidsOptions } from "@mdhthahmd/sqids";
import { Hono } from "hono";

type NumberBody = {
	numbers: number[];
};

type BigIntBody = {
	numbers: string[];
};

const bigintOptions: SqidsOptions<"bigint"> = { mode: "bigint" };
const numberSqids = new Sqids();
const bigintSqids = new Sqids(bigintOptions);

const app = new Hono();

app.post("/sqids/number/encode", async (context) => {
	const body = await context.req.json<NumberBody>();
	return context.json({ id: numberSqids.encode(body.numbers) });
});

app.get("/sqids/number/decode/:id", (context) => {
	return context.json({ numbers: numberSqids.decode(context.req.param("id")) });
});

app.post("/sqids/bigint/encode", async (context) => {
	const body = await context.req.json<BigIntBody>();
	const numbers = body.numbers.map(BigInt);
	return context.json({ id: bigintSqids.encode(numbers) });
});

app.get("/sqids/bigint/decode/:id", (context) => {
	const numbers = bigintSqids.decode(context.req.param("id")).map(String);
	return context.json({ numbers });
});

export default app;
