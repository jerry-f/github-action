import { registerEnumType } from '@nestjs/graphql';
export var DocVariant;
(function (DocVariant) {
    DocVariant["Workspace"] = "workspace";
    DocVariant["Page"] = "page";
    DocVariant["Space"] = "space";
    DocVariant["Settings"] = "settings";
    DocVariant["Unknown"] = "unknown";
})(DocVariant || (DocVariant = {}));
registerEnumType(DocVariant, {
    name: 'DocVariant',
});
export class DocID {
    static parse(raw) {
        try {
            return new DocID(raw);
        }
        catch (e) {
            return null;
        }
    }
    /**
     * pure guid for workspace and subdoc without any prefix
     */
    get guid() {
        return this.variant === DocVariant.Workspace
            ? this.workspace
            : // sub is always truthy when variant is not workspace
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.sub;
    }
    get full() {
        return this.variant === DocVariant.Workspace
            ? this.workspace
            : `${this.workspace}:${this.variant}:${this.sub}`;
    }
    get isWorkspace() {
        return this.variant === DocVariant.Workspace;
    }
    constructor(raw, workspaceId) {
        if (!raw.length) {
            throw new Error('Invalid Empty Doc ID');
        }
        let parts = raw.split(':');
        if (parts.length > 3) {
            // special adapt case `wsId:space:page:pageId`
            if (parts[1] === DocVariant.Space && parts[2] === DocVariant.Page) {
                parts = [workspaceId ?? parts[0], DocVariant.Space, parts[3]];
            }
            else {
                throw new Error(`Invalid format of Doc ID: ${raw}`);
            }
        }
        else if (parts.length === 2) {
            // `${variant}:${guid}`
            if (!workspaceId) {
                throw new Error('Workspace is required');
            }
            parts.unshift(workspaceId);
        }
        else if (parts.length === 1) {
            // ${ws} or ${pageId}
            if (workspaceId && parts[0] !== workspaceId) {
                parts = [workspaceId, DocVariant.Unknown, parts[0]];
            }
            else {
                // parts:[ws] equals [workspaceId]
            }
        }
        let workspace = parts.at(0);
        // fix for `${non-workspaceId}:${variant}:${guid}`
        if (workspaceId) {
            workspace = workspaceId;
        }
        const variant = parts.at(1);
        const docId = parts.at(2);
        if (!workspace) {
            throw new Error('Workspace is required');
        }
        if (variant) {
            if (!Object.values(DocVariant).includes(variant)) {
                throw new Error(`Invalid ID variant: ${variant}`);
            }
            if (!docId) {
                throw new Error('ID is required for non-workspace doc');
            }
        }
        else if (docId) {
            throw new Error('Variant is required for non-workspace doc');
        }
        this.raw = raw;
        this.workspace = workspace;
        this.variant = variant ?? DocVariant.Workspace;
        this.sub = docId || null;
    }
    toString() {
        return this.full;
    }
    fixWorkspace(workspaceId) {
        if (!this.isWorkspace && this.workspace !== workspaceId) {
            this.workspace = workspaceId;
        }
    }
}
//# sourceMappingURL=doc.js.map