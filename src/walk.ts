import { promises as fs } from "fs";
import path from "path";
import { processor } from "./processor";
import { wrapHtml } from "./html";

const MDX_PATTERN = /\.mdx?$/;

async function processFile(inputPath: string, outputPath: string): Promise<void> {
    const content = await fs.readFile(inputPath, "utf-8");
    const result = await processor.process(content);
    const title = path.basename(inputPath).replace(MDX_PATTERN, "");
    const html = wrapHtml(title, String(result));

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html);
}

export async function walk(sourceRoot: string, outputRoot: string, dir = ""): Promise<void> {
    const currentDir = path.join(sourceRoot, dir);
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    await Promise.all(
        entries.map((entry) => {
            const relPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                return walk(sourceRoot, outputRoot, relPath);
            }

            if (!MDX_PATTERN.test(entry.name)) {
                return;
            }

            const inputPath = path.join(currentDir, entry.name);
            const outputPath = path.join(outputRoot, relPath.replace(MDX_PATTERN, ".html"));

            return processFile(inputPath, outputPath);
        })
    );
}
