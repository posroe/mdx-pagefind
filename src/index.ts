#!/usr/bin/env

import { promises as fs } from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { createPagefind } from "./pagefind";
import { walk } from "./walk";

interface BuildOptions {
    sourceRoot: string;
    publicRoot: string;
}

const ROOT = ".pagefind";
const OUTPUT_ROOT = path.join(ROOT, "cache");
const GENERATED_PATH = path.join(ROOT, "generated");

async function parseArgs(): Promise<BuildOptions> {
    const argv = await yargs(hideBin(process.argv))
        .scriptName("mdx-pagefind")
        .usage("$0 [options]", "Build MDX files to HTML and index with Pagefind")
        .options({
            source: {
                type: "string",
                alias: "s",
                default: "src/contents",
                describe: "Directory containing source MDX files",
                normalize: true,
            },
            public: {
                type: "string",
                alias: "p",
                default: "public",
                describe: "Directory containing public files",
                normalize: true,
            }
        })
        .help()
        .alias("help", "h")
        .parse();

    return {
        sourceRoot: path.resolve(process.cwd(), argv.source),
        publicRoot: path.resolve(process.cwd(), argv.public)
    };
}

async function build(options: BuildOptions): Promise<void> {
    const { sourceRoot, publicRoot } = options;

    await fs.access(sourceRoot).catch(() => {
        throw new Error(`Source directory not found: ${sourceRoot}`);
    });

    await fs.rm(ROOT, { recursive: true, force: true });
    await fs.mkdir(OUTPUT_ROOT, { recursive: true });

    await walk(sourceRoot, OUTPUT_ROOT);
    await createPagefind(OUTPUT_ROOT, GENERATED_PATH);

    await fs.cp(
        path.join(__dirname, "../assets/index.d.ts"),
        path.join(GENERATED_PATH, "index.d.ts"),
        { recursive: true }
    );

    await fs.mkdir(path.join(publicRoot, "pagefind"), { recursive: true });

    await fs.rename(
        path.join(GENERATED_PATH, "pagefind.js"),
        path.join(GENERATED_PATH, "index.js")
    );

    await fs.rename(
        path.join(GENERATED_PATH, "fragment"),
        path.join(publicRoot, "pagefind", "fragment")
    );

    await fs.rename(
        path.join(GENERATED_PATH, "index"),
        path.join(publicRoot, "pagefind", "index")
    );

    await fs.rename(
        path.join(GENERATED_PATH, "pagefind-entry.json"),
        path.join(publicRoot, "pagefind", "pagefind-entry.json")
    );

    await fs.rename(
        path.join(GENERATED_PATH, "wasm.unknown.pagefind"),
        path.join(publicRoot, "pagefind", "wasm.unknown.pagefind")
    );

    const dir = await fs.readdir(GENERATED_PATH, { withFileTypes: true });
    const pfMetaFile = dir.find((file) => file.name.endsWith(".pf_meta"));

    if (!pfMetaFile) {
        throw new Error("No pf_meta file found");
    }

    await fs.rename(
        path.join(GENERATED_PATH, pfMetaFile.name),
        path.join(publicRoot, "pagefind", pfMetaFile.name)
    );
}

async function main(): Promise<void> {
    const options = await parseArgs();

    console.log("Starting build...");
    console.log(`  source : ${options.sourceRoot}`);
    console.log(`  output : ${OUTPUT_ROOT}`);
    console.log(`  index  : ${GENERATED_PATH}`);

    try {
        await build(options);
        console.log("Build complete.");
    } catch (err) {
        console.error("Build failed:", err instanceof Error ? err.message : err);
        process.exit(1);
    }
}

main();