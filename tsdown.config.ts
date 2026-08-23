import { defineConfig } from "tsdown";

export default defineConfig([
	{
		entry: ["src/index.ts"],
		format: ["esm"],
		outDir: "esm",
		dts: true,
		clean: true,
	},
	{
		entry: ["src/index.ts"],
		format: ["cjs"],
		outDir: "cjs",
		dts: true,
	},
]);
