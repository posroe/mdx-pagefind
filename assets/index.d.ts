export type PagefindFilterCounts = Record<string, Record<string, number>>;

export interface PagefindSearchOptions {
    preload?: boolean;
    verbose?: boolean;
    filters?: Record<string, unknown>;
    sort?: Record<string, unknown>;
}

export interface PagefindWordLocation {
    weight: number;
    balanced_score: number;
    location: number;
}

export interface PagefindSearchAnchor {
    element: string;
    id: string;
    text?: string;
    location: number;
}

export interface PagefindSubResult {
    title: string;
    url: string;
    excerpt: string;
    plain_excerpt: string;
    locations: number[];
    weighted_locations: PagefindWordLocation[];
    anchor?: PagefindSearchAnchor;
}

export interface PagefindSearchFragment<M = Record<string, string>> {
    url: string;
    raw_url?: string;
    content: string;
    excerpt: string;
    plain_excerpt: string;
    sub_results: PagefindSubResult[];
    word_count: number;
    locations: number[];
    weighted_locations: PagefindWordLocation[];
    filters: Record<string, string[]>;
    meta: M;
    anchors: PagefindSearchAnchor[];
}

export interface PagefindSearchResult {
    id: string;
    score: number;
    words: number[];
    matchedMetaFields?: string[];
    data: () => Promise<PagefindSearchFragment>;
}

export interface PagefindSearchResults {
    results: PagefindSearchResult[];
    unfilteredResultCount: number;
    filters: PagefindFilterCounts;
    totalFilters: PagefindFilterCounts;
    timings: {
        preload: number;
        search: number;
        total: number;
    };
}

export declare const search: (
    term: string,
    options?: PagefindSearchOptions
) => Promise<PagefindSearchResults>;

export declare const debouncedSearch: (
    term: string,
    options?: PagefindSearchOptions,
    debounceTimeoutMs?: number
) => Promise<PagefindSearchResults | null>;

export declare const preload: (
    term: string,
    options?: PagefindSearchOptions
) => Promise<void>;

export declare const filters: () => Promise<PagefindFilterCounts>;