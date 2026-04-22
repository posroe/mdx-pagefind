import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdx from "remark-mdx";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { remove } from "unist-util-remove";

const MDX_NODE_TYPES = [
    "mdxJsxFlowElement",
    "mdxJsxTextElement",
    "mdxjsEsm",
    "mdxTextExpression",
    "mdxFlowExpression",
] as const;

function remarkStripMdx() {
    return (tree: any) => {
        remove(tree, (node: any) => MDX_NODE_TYPES.includes(node.type));
    };
}

export const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkStripMdx)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeStringify);