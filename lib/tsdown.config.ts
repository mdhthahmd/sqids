import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["src/sqids.ts"],
    format: ["esm"],
    outDir: "esm",
    dts: true,
    clean: true,
  },
  {
    entry: ["src/sqids.ts"],
    format: ["cjs"],
    outDir: "cjs",
    dts: true,
  },
]);
