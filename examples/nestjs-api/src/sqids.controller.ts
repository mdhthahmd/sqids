import {
	Body,
	Controller,
	Get,
	HttpCode,
	Inject,
	Param,
	Post,
} from "@nestjs/common";
import { SqidsService } from "./sqids.service";

type NumberBody = {
	numbers: number[];
};

type BigIntBody = {
	numbers: string[];
};

@Controller("sqids")
export class SqidsController {
	constructor(@Inject(SqidsService) private readonly sqids: SqidsService) {}

	@Post("number/encode")
	@HttpCode(200)
	encodeNumbers(@Body() body: NumberBody): { id: string } {
		return { id: this.sqids.encodeNumbers(body.numbers) };
	}

	@Get("number/decode/:id")
	decodeNumbers(@Param("id") id: string): { numbers: number[] } {
		return { numbers: this.sqids.decodeNumbers(id) };
	}

	@Post("bigint/encode")
	@HttpCode(200)
	encodeBigInts(@Body() body: BigIntBody): { id: string } {
		return { id: this.sqids.encodeBigInts(body.numbers) };
	}

	@Get("bigint/decode/:id")
	decodeBigInts(@Param("id") id: string): { numbers: string[] } {
		return { numbers: this.sqids.decodeBigInts(id) };
	}
}
