export declare enum EventErrorCode {
    WORKSPACE_NOT_FOUND = "WORKSPACE_NOT_FOUND",
    DOC_NOT_FOUND = "DOC_NOT_FOUND",
    NOT_IN_WORKSPACE = "NOT_IN_WORKSPACE",
    ACCESS_DENIED = "ACCESS_DENIED",
    INTERNAL = "INTERNAL",
    VERSION_REJECTED = "VERSION_REJECTED"
}
export declare class EventError {
    readonly code: EventErrorCode;
    readonly message: string;
    constructor(code: EventErrorCode, message: string);
    toJSON(): {
        code: EventErrorCode;
        message: string;
    };
}
export declare class WorkspaceNotFoundError extends EventError {
    readonly workspaceId: string;
    constructor(workspaceId: string);
}
export declare class DocNotFoundError extends EventError {
    readonly workspaceId: string;
    readonly docId: string;
    constructor(workspaceId: string, docId: string);
}
export declare class NotInWorkspaceError extends EventError {
    readonly workspaceId: string;
    constructor(workspaceId: string);
}
export declare class AccessDeniedError extends EventError {
    readonly workspaceId: string;
    constructor(workspaceId: string);
}
export declare class InternalError extends EventError {
    readonly error: Error;
    constructor(error: Error);
}
export declare class VersionRejectedError extends EventError {
    readonly version: number;
    constructor(version: number);
}
//# sourceMappingURL=error.d.ts.map