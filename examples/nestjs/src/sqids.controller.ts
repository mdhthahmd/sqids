import { BadRequestException, Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { SqidsService } from "./sqids.service";
import {
  decodeBigIntsResponseSchema,
  decodeNumbersResponseSchema,
  encodeBigIntsRequestSchema,
  encodeNumbersRequestSchema,
  encodeResponseSchema,
} from "./sqids.schemas";

function asBadRequest(error: unknown): BadRequestException {
  if (error instanceof BadRequestException) {
    return error;
  }

  return new BadRequestException(error instanceof Error ? error.message : "Invalid request body");
}

@Controller("sqids")
export class SqidsController {
  constructor(private readonly sqids: SqidsService) {}

  @Post("number/encode")
  @HttpCode(200)
  encodeNumbers(@Body() body: unknown): { id: string } {
    const request = encodeNumbersRequestSchema.safeParse(body);
    if (!request.success) {
      throw new BadRequestException("Numbers must contain only numeric values");
    }

    let id: string;
    try {
      id = this.sqids.encodeNumbers(request.data.numbers);
    } catch (error) {
      throw asBadRequest(error);
    }

    return encodeResponseSchema.parse({ id });
  }

  @Get("number/decode/:id")
  decodeNumbers(@Param("id") id: string): { numbers: number[] } {
    return decodeNumbersResponseSchema.parse({
      numbers: this.sqids.decodeNumbers(id),
    });
  }

  @Post("bigint/encode")
  @HttpCode(200)
  encodeBigInts(@Body() body: unknown): { id: string } {
    const request = encodeBigIntsRequestSchema.safeParse(body);
    if (!request.success) {
      throw new BadRequestException("Numbers must contain only decimal strings");
    }

    let id: string;
    try {
      id = this.sqids.encodeBigInts(request.data.numbers);
    } catch (error) {
      throw asBadRequest(error);
    }

    return encodeResponseSchema.parse({ id });
  }

  @Get("bigint/decode/:id")
  decodeBigInts(@Param("id") id: string): { numbers: string[] } {
    return decodeBigIntsResponseSchema.parse({
      numbers: this.sqids.decodeBigInts(id),
    });
  }
}
