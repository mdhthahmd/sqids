import Sqids, { type SqidsOptions } from "@mdhthahmd/sqids";
import { Injectable } from "@nestjs/common";

const bigintOptions: SqidsOptions<"bigint"> = { mode: "bigint" };

@Injectable()
export class SqidsService {
	private readonly numberSqids = new Sqids();
	private readonly bigintSqids = new Sqids(bigintOptions);

	encodeNumbers(numbers: number[]): string {
		return this.numberSqids.encode(numbers);
	}

	decodeNumbers(id: string): number[] {
		return this.numberSqids.decode(id);
	}

	encodeBigInts(numbers: string[]): string {
		return this.bigintSqids.encode(numbers.map(BigInt));
	}

	decodeBigInts(id: string): string[] {
		return this.bigintSqids.decode(id).map(String);
	}
}
