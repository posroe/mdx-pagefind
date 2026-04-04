# mdx-pagefind

[![npm version](https://badge.fury.io/js/mdx-pagefind.svg)](https://www.npmjs.com/package/mdx-pagefind)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://www.gnu.org/licenses/mit)

Converts MDX/MD files to HTML and generates a [Pagefind](https://pagefind.app) search index.

## How it works

1. Walks the source directory recursively and finds all `.md` and `.mdx` files
2. Converts each file to HTML via a remark pipeline (strips JSX nodes, supports GFM, math, frontmatter)
3. Writes intermediate HTML files to an output directory
4. Runs Pagefind over the output directory to produce a search index

## Installation

```bash
npm i -D mdx-pagefind
```

## Usage

```bash
mdx-pagefind [options]
```

### Options

| Flag            | Alias | Default           | Description                           |
| --------------- | ----- | ----------------- | ------------------------------------- |
| `--site`        | `-s`  | `src/contents`    | Source directory containing MDX files |
| `--out`         | `-o`  | `out`             | Intermediate HTML output directory    |
| `--output-path` | `-p`  | `public/pagefind` | Final Pagefind index output path      |

### Examples

```bash
# Use defaults
mdx-pagefind

# Custom paths
mdx-pagefind --site docs --out .build --output-path public/search

# Short flags
mdx-pagefind -s docs -o .build -p public/search
```

## Project structure

```
index.ts        CLI entrypoint — parses args and orchestrates the build
walk.ts         Recursively walks the source directory and converts MDX to HTML
processor.ts    Unified/remark pipeline (MDX, GFM, math, frontmatter)
html.ts         Wraps converted HTML in a full HTML document scaffold
pagefind.ts     Creates the Pagefind search index from the HTML output
types.ts        Shared TypeScript interfaces
```

## Output

The build produces two artifacts:

- **Intermediate HTML** (`--out`) — one `.html` file per source MDX file, used as input for Pagefind. Safe to delete after indexing.
- **Pagefind index** (`--output-path`) — static search assets served alongside your site.

To use the search index, load `/<output-path>/pagefind.js` in your frontend and follow the [Pagefind UI docs](https://pagefind.app/docs/).
