export var EventErrorCode;
(function (EventErrorCode) {
    EventErrorCode["WORKSPACE_NOT_FOUND"] = "WORKSPACE_NOT_FOUND";
    EventErrorCode["DOC_NOT_FOUND"] = "DOC_NOT_FOUND";
    EventErrorCode["NOT_IN_WORKSPACE"] = "NOT_IN_WORKSPACE";
    EventErrorCode["ACCESS_DENIED"] = "ACCESS_DENIED";
    EventErrorCode["INTERNAL"] = "INTERNAL";
    EventErrorCode["VERSION_REJECTED"] = "VERSION_REJECTED";
})(EventErrorCode || (EventErrorCode = {}));
// Such errore are generally raised from the gateway handling to user,
// the stack must be full of internal code,
// so there is no need to inherit from `Error` class.
export class EventError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
    toJSON() {
        return {
            code: this.code,
            message: this.message,
        };
    }
}
export class WorkspaceNotFoundError extends EventError {
    constructor(workspaceId) {
        super(EventErrorCode.WORKSPACE_NOT_FOUND, `You are trying to access an unknown workspace ${workspaceId}.`);
        this.workspaceId = workspaceId;
    }
}
export class DocNotFoundError extends EventError {
    constructor(workspaceId, docId) {
        super(EventErrorCode.DOC_NOT_FOUND, `You are trying to access an unknown doc ${docId} under workspace ${workspaceId}.`);
        this.workspaceId = workspaceId;
        this.docId = docId;
    }
}
export class NotInWorkspaceError extends EventError {
    constructor(workspaceId) {
        super(EventErrorCode.NOT_IN_WORKSPACE, `You should join in workspace ${workspaceId} before broadcasting messages.`);
        this.workspaceId = workspaceId;
    }
}
export class AccessDeniedError extends EventError {
    constructor(workspaceId) {
        super(EventErrorCode.ACCESS_DENIED, `You have no permission to access workspace ${workspaceId}.`);
        this.workspaceId = workspaceId;
    }
}
export class InternalError extends EventError {
    constructor(error) {
        super(EventErrorCode.INTERNAL, `Internal error happened: ${error.message}`);
        this.error = error;
    }
}
export class VersionRejectedError extends EventError {
    constructor(version) {
        super(EventErrorCode.VERSION_REJECTED, 
        // TODO: Too general error message,
        // need to be more specific when versioning system is implemented.
        `The version ${version} is rejected by server.`);
        this.version = version;
    }
}
//# sourceMappingURL=error.js.map