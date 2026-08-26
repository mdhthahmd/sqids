# Hono Sqids API

This Node.js ESM example imports the published @mdhthahmd/sqids@2.1.2-next.1 package.

Run `pnpm dev:examples` from the workspace root to start both example APIs in watch mode. The Hono API listens on port 3000.

The API provides number and BigInt encode/decode routes below /sqids. BigInts are accepted and returned as decimal strings so all responses remain valid JSON.
