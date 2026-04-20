# mdx-pagefind

[![npm version](https://badge.fury.io/js/mdx-pagefind.svg)](https://www.npmjs.com/package/mdx-pagefind)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://www.gnu.org/licenses/mit)

A command-line tool for indexing MDX and Markdown files with [Pagefind](https://pagefind.app/). It converts source files to HTML and generates a static search index that can be consumed by any frontend.

## Requirements

- Node.js 18 or later
- TypeScript 6 (peer dependency)

## Installation

```bash
npm install mdx-pagefind
```

## Usage

```bash
mdx-pagefind [options]
```

### Options

| Option   | Alias | Default        | Description                                       |
| -------- | ----- | -------------- | ------------------------------------------------- |
| `--site` | `-s`  | `src/contents` | Directory containing source MDX or Markdown files |
| `--help` | `-h`  |                | Show help                                         |

### Example

```bash
mdx-pagefind --site docs/content
```

## How It Works

1. All `.md` and `.mdx` files under the source directory are located recursively.
2. Each file is processed through a remark pipeline that strips MDX-specific nodes (JSX elements, ESM imports, expressions) and converts the remaining content to HTML.
3. The resulting HTML files are written to `.pagefind/cache/`, mirroring the original directory structure.
4. Pagefind indexes the HTML output and writes the search index to `.pagefind/generated/`.
5. The generated directory is usable as a self-contained search module, with `index.js` as the entry point and bundled TypeScript declarations at `index.d.ts`.

## Output Structure

```
.pagefind/
  cache/          HTML files converted from MDX sources
  generated/      Pagefind search index
    index.js      Entry point (re-exported from pagefind.js)
    index.d.ts    TypeScript declarations
```

## Integrating the Search Index

### TypeScript Configuration

To resolve the `pagefind` module alias, add the following to your `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "paths": {
      "pagefind": ["./.pagefind/generated"],
    },
  },
}
```

### Usage

Import the generated module using the `pagefind` alias:

```typescript
import { debouncedSearch } from "pagefind";

const results = await debouncedSearch("your query");
if (results) {
  for (const result of results.results) {
    const data = await result.data();
    console.log(data.meta.title, data.url, data.excerpt);
  }
}
```

### Types

```typescript
interface PagefindResult {
  url: string;
  excerpt: string;
  meta: { title?: string };
  sub_results: PagefindSubResult[];
}

interface PagefindSubResult {
  title: string;
  url: string;
  excerpt: string;
}

const debouncedSearch: (
  query: string,
  options?: Record<string, any>,
  debounce?: number,
) => Promise<{
  results: Array<{ data: () => Promise<PagefindResult> }>;
} | null>;
```

## Supported Syntax

The remark pipeline includes support for the following:

- GitHub Flavored Markdown (tables, strikethrough, task lists)
- Math expressions via remark-math
- YAML frontmatter
- MDX (JSX elements and ESM imports are stripped before indexing)
