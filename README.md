<p align="center">
  <a href="https://sqids.org/">
    <img src="https://sqids.org/img/sqids-banner.webp" width="480" alt="Sqids">
  </a>
</p>

<h1 align="center">Sqids JavaScript (with BigInt support)</h1>

<p align="center">
  <a href="https://github.com/mdhthahmd/sqids/actions/workflows/release.yml"><img alt="release workflow" src="https://img.shields.io/github/actions/workflow/status/mdhthahmd/sqids/release.yml?branch=main&logo=githubactions&logoColor=white&label=release"></a>
  <a href="https://github.com/mdhthahmd/sqids"><img alt="GitHub stars" src="https://img.shields.io/github/stars/mdhthahmd/sqids?logo=github"></a>
  <a href="https://github.com/mdhthahmd/sqids/blob/main/LICENSE"><img alt="MIT license" src="https://img.shields.io/npm/l/@mdhthahmd/sqids?label=license"></a>
</p>

<p align="center">
  <a href="https://nodejs.org/"><img alt="Node.js 18 or newer" src="https://img.shields.io/badge/Node.js-18%2B-5FA04E?logo=nodedotjs&logoColor=white"></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white"></a>
  <a href="https://pnpm.io/"><img alt="pnpm 11" src="https://img.shields.io/badge/pnpm-11.22-F69220?logo=pnpm&logoColor=white"></a>
</p>

<p align="center">
  <a href="https://vitest.dev/"><img alt="Vitest 4" src="https://img.shields.io/badge/Vitest-4.1-6E9F18?logo=vitest&logoColor=white"></a>
  <a href="https://biomejs.dev/"><img alt="Biome 2" src="https://img.shields.io/badge/Biome-2.5-60A5FA?logo=biome&logoColor=white"></a>
  <a href="https://commitlint.js.org/"><img alt="Commitlint 21" src="https://img.shields.io/badge/Commitlint-21.2-000000?logo=commitlint&logoColor=white"></a>
  <a href="https://tsdown.dev/"><img alt="tsdown 0.22" src="https://img.shields.io/badge/tsdown-0.22-F7B93E"></a>
  <a href="https://semantic-release.gitbook.io/"><img alt="semantic-release 25" src="https://img.shields.io/badge/semantic--release-25-E10079?logo=semanticrelease&logoColor=white"></a>
</p>

<p align="center">
  <a href="https://typicode.github.io/husky/"><img alt="Husky 9" src="https://img.shields.io/badge/Husky-9.1-42B983"></a>
  <a href="https://github.com/lint-staged/lint-staged"><img alt="lint-staged 17" src="https://img.shields.io/badge/lint--staged-17.3-835AFD"></a>
  <a href="https://publint.dev/"><img alt="publint 0.3" src="https://img.shields.io/badge/publint-0.3-4B32C3"></a>
  <a href="https://github.com/arethetypeswrong/arethetypeswrong.github.io"><img alt="Are the Types Wrong 0.18" src="https://img.shields.io/badge/Are_the_Types_Wrong%3F-0.18-3178C6"></a>
  <a href="https://github.com/features/actions"><img alt="GitHub Actions" src="https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white"></a>
</p>

[Sqids](https://sqids.org/javascript) (pronounced "squids") generates short, unique, URL-safe IDs from numbers. This implementation follows the Sqids specification and adds opt-in BigInt support for the full unsigned 64-bit integer range.

## 📚 Table of contents

- [Features](#-features)
- [Use cases](#-use-cases)
- [Installation](#-installation)
- [Quick start](#-quick-start)
- [BigInt support](#-bigint-support)
- [Configuration](#️-configuration)
- [Example APIs](#-example-apis)
- [Development](#️-development)
- [License](#-license)

## ✨ Features

- 🔢 **Multiple numbers** — encode one or more non-negative numbers into one ID
- 💪 **BigInt support** — use the full unsigned 64-bit integer range
- ⚡ **Quick decoding** — decode IDs back into their original values
- 🔀 **Randomized output** — sequential inputs produce nonconsecutive IDs
- 📏 **ID padding** — configure a minimum ID length
- 🔤 **Custom alphabets** — control the characters used to generate IDs
- 🛡️ **Blocklists** — regenerate IDs containing blocked words
- 🔗 **URL safe** — use generated IDs safely in URLs
- 🌍 **Portable** — Sqids supports [40+ programming languages](https://sqids.org/)

## 🎯 Use cases

Sqids works well for:

- Public URL identifiers and link shorteners
- Internal identifiers such as event or object references
- Reversible database lookups by numeric primary key

> [!WARNING]
> Sqids is not encryption. Anyone can decode an ID, so do not use it for secrets or to hide sensitive information.

## 📦 Installation

Requires Node.js 18 or newer.

Using pnpm:

```bash
pnpm add @mdhthahmd/sqids
```

Using npm:

```bash
npm install @mdhthahmd/sqids
```

Using Yarn:

```bash
yarn add @mdhthahmd/sqids
```

## 🚀 Quick start

```javascript
import Sqids from "@mdhthahmd/sqids";

const sqids = new Sqids();
const id = sqids.encode([1, 2, 3]); // "86Rf07"
const numbers = sqids.decode(id); // [1, 2, 3]
```

> [!NOTE]
> Because of the algorithm's design, multiple IDs can decode to the same sequence of numbers. If IDs must be canonical, re-encode the decoded numbers and verify that the generated ID matches.

## 💪 BigInt support

Enable BigInt mode when values may exceed `Number.MAX_SAFE_INTEGER`. BigInt mode accepts values from `0n` through `2n ** 64n - 1n` and returns `bigint[]` when decoding.

```javascript
import Sqids from "@mdhthahmd/sqids";

const sqids = new Sqids({ mode: "bigint" });
const values = [0n, 9_007_199_254_740_992n, 18_446_744_073_709_551_615n];

const id = sqids.encode(values);
const decoded = sqids.decode(id);

console.log(decoded); // [0n, 9007199254740992n, 18446744073709551615n]
```

Number mode and BigInt mode generate the same ID for values within the safe-integer range:

```javascript
new Sqids().encode([1, 2, 3]) ===
  new Sqids({ mode: "bigint" }).encode([1n, 2n, 3n]); // true
```

## ⚙️ Configuration

### Minimum ID length

```javascript
import Sqids from "@mdhthahmd/sqids";

const sqids = new Sqids({
  minLength: 10,
});

const id = sqids.encode([1, 2, 3]); // "86Rf07xd4z"
const numbers = sqids.decode(id); // [1, 2, 3]
```

### Custom alphabet

```javascript
import Sqids from "@mdhthahmd/sqids";

const sqids = new Sqids({
  alphabet: "FxnXM1kBN6cuhsAvjW3Co7l2RePyY8DwaU04Tzt9fHQrqSVKdpimLGIJOgb5ZE",
});

const id = sqids.encode([1, 2, 3]); // "B4aajs"
const numbers = sqids.decode(id); // [1, 2, 3]
```

### Custom blocklist

```javascript
import Sqids from "@mdhthahmd/sqids";

const sqids = new Sqids({
  blocklist: new Set(["86Rf07"]),
});

const id = sqids.encode([1, 2, 3]); // "se8ojk"
const numbers = sqids.decode(id); // [1, 2, 3]
```

## 🧪 Example APIs

The workspace includes two consumer applications that use the published `@mdhthahmd/sqids@2.1.0-next.1` package:

- `examples/hono-api` — Node.js ESM API on port 3000
- `examples/nestjs-api` — NestJS CommonJS API on port 3001

Start both APIs in watch mode:

```bash
pnpm dev:examples
```

For manual testing, open `bruno/requests/api` as a collection in Bruno and select the `hono` or `nestjs` environment. Run each folder's `encode` request before its `decode` request.

## 🛠️ Development

### Dev Container

The recommended setup is the repository's Dev Container. It provides Node.js 24.19, pnpm 11.22, GitHub CLI, Biome, Vitest Explorer, Bruno, and the configured coding-agent tools.

1. Install Docker and a Dev Container-compatible editor, such as VS Code with the Dev Containers extension.
2. Clone the repository and open it in VS Code.
3. Run **Dev Containers: Reopen in Container** from the command palette.
4. Wait for `pnpm install --frozen-lockfile` to finish automatically.
5. Run `pnpm test:all` to verify the workspace.

To apply changes made to `.devcontainer/devcontainer.json`, run **Dev Containers: Rebuild Container**.

### Local setup

Install Node.js 24.19 and pnpm 11.22, then run:

```bash
pnpm install --frozen-lockfile
pnpm test:all
```

### Workspace layout

| Path | Purpose |
| --- | --- |
| `lib` | Published Sqids package, source, tests, and benchmarks |
| `examples/hono-api` | ESM consumer example |
| `examples/nestjs-api` | CommonJS consumer example |
| `bruno/requests/api` | Bruno collection for both example APIs |

### Commands

| Command | Description |
| --- | --- |
| `pnpm build` | Build the library and all example applications |
| `pnpm dev:lib` | Rebuild the library in watch mode |
| `pnpm dev:examples` | Start both example APIs in watch mode |
| `pnpm test:all` | Build, type-check, test, and run Biome CI checks |
| `pnpm test:coverage` | Run the library tests with coverage |
| `pnpm test:package` | Validate the packed npm package and its types |
| `pnpm benchmark` | Run the library's Vitest benchmarks |
| `pnpm check` | Format and lint the entire repository with Biome |
| `pnpm clean` | Remove generated workspace build output |

The benchmark suite covers number and BigInt operations, verified round trips, UUID-shaped batch inputs, construction, padding, custom alphabets, and blocklist retries.

## 📄 License

[MIT](LICENSE)
