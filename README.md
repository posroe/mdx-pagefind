# mdx-pagefind

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://www.gnu.org/licenses/mit)
[![npm version](https://badge.fury.io/js/mdx-pagefind.svg)](https://www.npmjs.com/package/mdx-pagefind)
[![npm download](https://img.shields.io/npm/dt/mdx-pagefind)](https://www.npmjs.com/package/mdx-pagefind)

A command-line tool for indexing MDX and Markdown files with [Pagefind](https://pagefind.app/). It converts source files to HTML and generates a static search index that can be consumed by any frontend.

## Installation

```bash
npm install mdx-pagefind
```

## Usage

```bash
mdx-pagefind [options]
```

### Options

| Option     | Alias | Default                                   | Description                                       |
| ---------- | ----- | ----------------------------------------- | ------------------------------------------------- |
| `--source` | `-s`  | `src/contents`                            | Directory containing source MDX or Markdown files |
| `--public` | `-p`  | Your web server's public/static directory | Directory containing public files                 |
| `--help`   | `-h`  |                                           | Show help                                         |

### Example

```bash
mdx-pagefind --source docs/content --public public
```

## How It Works

1. All `.md` and `.mdx` files under the source directory are located recursively.
2. Each file is processed through a remark pipeline that strips MDX-specific nodes (JSX elements, ESM imports, expressions) and converts the remaining content to HTML.
3. The resulting HTML files are written to `.pagefind/cache/`.
4. Pagefind indexes the HTML output and generates search assets.
5. Runtime Assets (`wasm`, `fragments`, etc.) are moved to your public directory (`public/pagefind/`) so the browser can fetch them via HTTP.
6. Development Assets (`index.js`, `index.d.ts`) are kept in `.pagefind/generated/` for TypeScript integration.

## Output Structure

```
.pagefind/
  cache/          HTML files converted from MDX sources
  generated/      Pagefind search index
    index.js      Entry point (re-exported from pagefind.js)
    index.d.ts    TypeScript declarations

public/            Your public folder
  pagefind/        Production runtime assets (WASM, Metadata, Fragments)
```

## Integrating the Search Index

### TypeScript Configuration

To resolve the `pagefind` module alias, add the following to your `tsconfig.json`:

> **Warning:** If you want to import the generated module, use an alias (e.g., pagefind-generated) instead of pagefind, as the build process may confuse it with the original pagefind module.

```jsonc
{
  "compilerOptions": {
    "paths": {
      "pagefind-generated": ["./.pagefind/generated"],
    },
  },
}
```

### Usage

Import the generated module using the `pagefind` alias:

```typescript
import { debouncedSearch } from "pagefind-generated";

const results = await debouncedSearch("your query");
if (results) {
  for (const result of results.results) {
    const data = await result.data();
    console.log(data.meta.title, data.url, data.excerpt);
  }
}
```

## Supported Syntax

The remark pipeline includes support for the following:

- GitHub Flavored Markdown (tables, strikethrough, task lists)
- Math expressions via `remark-math`
- YAML frontmatter
- MDX (JSX elements and ESM imports are stripped before indexing)
