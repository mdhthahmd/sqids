import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	Inject,
	Param,
	Post,
} from "@nestjs/common";
import { SqidsService } from "./sqids.service";

function readNumbers(body: unknown): unknown {
	if (typeof body !== "object" || body === null || !("numbers" in body)) {
		throw new BadRequestException("Request body must contain a numbers array");
	}

	return body.numbers;
}

function asBadRequest(error: unknown): BadRequestException {
	if (error instanceof BadRequestException) {
		return error;
	}

	return new BadRequestException(
		error instanceof Error ? error.message : "Invalid request body",
	);
}

@Controller("sqids")
export class SqidsController {
	constructor(@Inject(SqidsService) private readonly sqids: SqidsService) {}

	@Post("number/encode")
	@HttpCode(200)
	encodeNumbers(@Body() body: unknown): { id: string } {
		try {
			return { id: this.sqids.encodeNumbers(readNumbers(body)) };
		} catch (error) {
			throw asBadRequest(error);
		}
	}

	@Get("number/decode/:id")
	decodeNumbers(@Param("id") id: string): { numbers: number[] } {
		return { numbers: this.sqids.decodeNumbers(id) };
	}

	@Post("bigint/encode")
	@HttpCode(200)
	encodeBigInts(@Body() body: unknown): { id: string } {
		try {
			return { id: this.sqids.encodeBigInts(readNumbers(body)) };
		} catch (error) {
			throw asBadRequest(error);
		}
	}

	@Get("bigint/decode/:id")
	decodeBigInts(@Param("id") id: string): { numbers: string[] } {
		return { numbers: this.sqids.decodeBigInts(id) };
	}
}
