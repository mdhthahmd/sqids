import { z } from "zod";

export const encodeNumbersRequestSchema = z.object({
  numbers: z.array(z.number()),
});

export const encodeBigIntsRequestSchema = z.object({
  numbers: z.array(z.string().regex(/^\d+$/)),
});

export const encodeResponseSchema = z.object({
  id: z.string(),
});

export const decodeNumbersResponseSchema = z.object({
  numbers: z.array(z.number()),
});

export const decodeBigIntsResponseSchema = z.object({
  numbers: z.array(z.string()),
});
