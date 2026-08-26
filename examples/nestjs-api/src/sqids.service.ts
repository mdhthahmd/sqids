import Sqids, { type SqidsOptions } from "@mdhthahmd/sqids";
import { Injectable } from "@nestjs/common";

const bigintOptions: SqidsOptions<"bigint"> = { mode: "bigint" };

@Injectable()
export class SqidsService {
	private readonly numberSqids = new Sqids();
	private readonly bigintSqids = new Sqids(bigintOptions);

	encodeNumbers(numbers: unknown): string {
		if (
			!Array.isArray(numbers) ||
			!numbers.every((number) => typeof number === "number")
		) {
			throw new Error("Numbers must contain only numeric values");
		}

		return this.numberSqids.encode(numbers);
	}

	decodeNumbers(id: string): number[] {
		return this.numberSqids.decode(id);
	}

	encodeBigInts(numbers: unknown): string {
		if (
			!Array.isArray(numbers) ||
			!numbers.every((number) => typeof number === "string")
		) {
			throw new Error("Numbers must contain only decimal strings");
		}

		return this.bigintSqids.encode(numbers.map(BigInt));
	}

	decodeBigInts(id: string): string[] {
		return this.bigintSqids.decode(id).map(String);
	}
}
