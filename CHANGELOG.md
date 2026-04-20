# CHANGELOG

## [1.1.1] - 2026-04-20

### Fixed

- **Metadata Loading Error**: Fixed "Failed to load Pagefind metadata" error in the browser by correctly moving runtime assets (`wasm`, `fragments`, `index`, and `.pf_meta`) to the public directory.
- **Dynamic Asset Discovery**: Added logic to automatically find and move the hashed `.pf_meta` file.

### Added

- **New CLI Option**: Added `--public` (alias `-p`) flag to specify the web server's public directory (defaults to `public`).

### Changed

- **[Breaking Change] Option Renaming**: Renamed `--site` flag to `--source` (alias `-s`) to better reflect its purpose as the source content directory.
- **Asset Distribution**:
  - Development files (`index.js`, `index.d.ts`) remain in `.pagefind/generated`.
  - Production assets are now moved to `public/pagefind/` to be accessible via HTTP.

## [1.1.0] - 2026-04-20

### Added

- **TypeScript Support**: Added automatic generation of `index.d.ts` in the generated folder for full TypeScript compatibility.
- **Path Mapping Guide**: Added instructions for configuring `paths` in `tsconfig.json` to simplify `pagefind` imports.
- **Search API Documentation**: Added detailed documentation for `debouncedSearch`, including code examples and interface definitions.

### Changed

- **[Breaking Change] New Output Structure**: All outputs are now unified under the `.pagefind/` directory:
  - `.pagefind/cache/`: Stores intermediate HTML files (formerly configured via `--out`).
  - `.pagefind/generated/`: Stores the search index (formerly configured via `--output-path`).
- **[Breaking Change] Simplified CLI Options**: Removed the following flags to streamline the user experience:
  - Removed `--out` (now defaults to `.pagefind/cache`).
  - Removed `--output-path` (now defaults to `.pagefind/generated`).
- **Engine Requirements**: Upgraded minimum requirement to Node.js 18 or later.
- **Enhanced Remark Pipeline**: Improved stability when processing MDX-specific nodes (JSX elements, ESM imports/exports, and expressions).
- **URL Normalization**: Updated Pagefind URL handling to use directory-style paths (e.g., `/path/to/page/`) instead of `.html` extensions.

### Removed

- Removed internal project file references (e.g., `walk.ts`, `processor.ts`) from README to focus on library usage.
- Removed documentation for legacy Pagefind UI integration in favor of the new `pagefind` module alias approach.

---

## [1.0.0] - Initial Release

- Support for converting MD and MDX files to HTML.
- Built-in support for GitHub Flavored Markdown (GFM), Math (LaTeX), and YAML frontmatter.
- Automated search index generation via Pagefind CLI.
- Configurable source, intermediate, and final output paths via CLI.
