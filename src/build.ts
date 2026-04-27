import fs from "node:fs/promises";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { processor } from "./processor";

const execAsync = promisify(exec);
const MDX = /\.mdx?$/;

const ROOT = ".pagefind";
const CACHE = path.join(ROOT, "cache");
const GENERATED = path.join(ROOT, "generated");

async function walk(src: string, out: string, dir = ""): Promise<void> {
    const entries = await fs.readdir(path.join(src, dir), { withFileTypes: true });
    await Promise.all(entries.map(async (e) => {
        const rel = path.join(dir, e.name);
        if (e.isDirectory()) return walk(src, out, rel);
        if (!MDX.test(e.name)) return;
        const body = await processor.process(await fs.readFile(path.join(src, rel), "utf-8"));
        const html = `<!DOCTYPE html><html><head><title>${e.name.replace(MDX, "")}</title></head><body><article data-pagefind-body>${body}</article></body></html>`;
        await fs.mkdir(path.dirname(path.join(out, rel)), { recursive: true });
        await fs.writeFile(path.join(out, rel.replace(MDX, ".html")), html);
    }));
}

export async function build(srcRoot: string, pubRoot: string): Promise<void> {
    await fs.rm(ROOT, { recursive: true, force: true });
    await fs.mkdir(CACHE, { recursive: true });
    await walk(srcRoot, CACHE);
    await execAsync(`pagefind --site ${CACHE} --output-path ${GENERATED}`);

    const pubPf = path.join(pubRoot, "pagefind");
    await fs.rm(pubPf, { recursive: true, force: true });
    await fs.mkdir(pubPf, { recursive: true });
    await fs.rename(path.join(GENERATED, "pagefind.js"), path.join(GENERATED, "index.js"));
    for (const name of ["fragment", "index", "pagefind-entry.json", "wasm.unknown.pagefind"]) {
        await fs.rename(path.join(GENERATED, name), path.join(pubPf, name));
    }
    const meta = (await fs.readdir(GENERATED)).find(f => f.endsWith(".pf_meta"));
    if (!meta) throw new Error("No .pf_meta file found");
    await fs.rename(path.join(GENERATED, meta), path.join(pubPf, meta));
}