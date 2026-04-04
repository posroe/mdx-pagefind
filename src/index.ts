#!/usr/bin/env

import { promises as fs } from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { createPagefind } from "./pagefind";
import { walk } from "./walk";

interface BuildOptions {
    sourceRoot: string;
    outputRoot: string;
    searchPath: string;
}

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
            },
            out: {
                type: "string",
                alias: "o",
                default: "out",
                describe: "Intermediate HTML output directory",
                normalize: true,
            },
            "output-path": {
                type: "string",
                alias: "p",
                default: "public/pagefind",
                describe: "Final Pagefind index output path",
                normalize: true,
            },
        })
        .help()
        .alias("help", "h")
        .parse();

    return {
        sourceRoot: path.resolve(process.cwd(), argv.site),
        outputRoot: path.resolve(process.cwd(), argv.out),
        searchPath: path.resolve(process.cwd(), argv["output-path"]),
    };
}

async function build(options: BuildOptions): Promise<void> {
    const { sourceRoot, outputRoot, searchPath } = options;

    await fs.access(sourceRoot).catch(() => {
        throw new Error(`Source directory not found: ${sourceRoot}`);
    });

    await fs.rm(outputRoot, { recursive: true, force: true });
    await fs.mkdir(outputRoot, { recursive: true });

    await walk(sourceRoot, outputRoot);
    await createPagefind(outputRoot, searchPath);
}

async function main(): Promise<void> {
    const options = await parseArgs();

    console.log("Starting build...");
    console.log(`  source : ${options.sourceRoot}`);
    console.log(`  output : ${options.outputRoot}`);
    console.log(`  index  : ${options.searchPath}`);

    try {
        await build(options);
        console.log("Build complete.");
    } catch (err) {
        console.error("Build failed:", err instanceof Error ? err.message : err);
        process.exit(1);
    }
}

main();