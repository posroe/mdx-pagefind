#!/usr/bin/env

import { promises as fs } from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { createPagefind } from "./pagefind";
import { walk } from "./walk";

interface BuildOptions {
    sourceRoot: string;
}

const ROOT = ".pagefind";
const OUTPUT_ROOT = path.join(ROOT, "cache");
const GENERATED_PATH = path.join(ROOT, "generated");

async function parseArgs(): Promise<BuildOptions> {
    const argv = await yargs(hideBin(process.argv))
        .scriptName("mdx-pagefind")
        .usage("$0 [options]", "Build MDX files to HTML and index with Pagefind")
        .options({
            site: {
                type: "string",
                alias: "s",
                default: "src/contents",
                describe: "Directory containing source MDX files",
                normalize: true,
            }
        })
        .help()
        .alias("help", "h")
        .parse();

    return {
        sourceRoot: path.resolve(process.cwd(), argv.site)
    };
}

async function build(options: BuildOptions): Promise<void> {
    const { sourceRoot } = options;

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

    await fs.rename(
        path.join(GENERATED_PATH, "pagefind.js"),
        path.join(GENERATED_PATH, "index.js")
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