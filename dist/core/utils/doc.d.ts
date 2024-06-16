export declare enum DocVariant {
    Workspace = "workspace",
    Page = "page",
    Space = "space",
    Settings = "settings",
    Unknown = "unknown"
}
export declare class DocID {
    raw: string;
    workspace: string;
    variant: DocVariant;
    private readonly sub;
    static parse(raw: string): DocID | null;
    /**
     * pure guid for workspace and subdoc without any prefix
     */
    get guid(): string;
    get full(): string;
    get isWorkspace(): boolean;
    constructor(raw: string, workspaceId?: string);
    toString(): string;
    fixWorkspace(workspaceId: string): void;
}
//# sourceMappingURL=doc.d.ts.map