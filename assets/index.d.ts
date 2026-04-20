export interface PagefindSubResult {
    title: string;
    url: string;
    excerpt: string;
}

export interface PagefindResult {
    url: string;
    excerpt: string;
    meta: { title?: string };
    sub_results: PagefindSubResult[];
}

export const debouncedSearch: (
    query: string,
    options?: Record<string, any>,
    debounce?: number
) => Promise<{
    results: Array<{ data: () => Promise<PagefindResult> }>
} | null>;

export interface MappedResult {
    title: string;
    url: string;
    excerpt: string;
}