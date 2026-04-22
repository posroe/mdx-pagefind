import * as pagefind from "pagefind";

export async function createPagefind(siteDir: string, outputPath: string): Promise<void> {
    const { index } = await pagefind.createIndex();
    if (!index) {
        throw new Error("Failed to create Pagefind index");
    }

    await index.addDirectory({ path: siteDir });
    await index.writeFiles({ outputPath });
}