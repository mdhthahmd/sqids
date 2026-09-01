import { z } from "zod";

export const environmentSchema = z.object({
  HTTP_PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
});

export type Environment = z.infer<typeof environmentSchema>;

export function validateEnvironment(environment: Record<string, unknown>): Environment {
  return environmentSchema.parse(environment);
}
