import { OnEvent } from '../../event';
/**
 * not implemented yet
 */
export const OnRuntimeConfigChange_DO_NOT_USE = (nameWithModule) => {
    return OnEvent(`runtimeConfig.${nameWithModule}.changed`);
};
//# sourceMappingURL=event.js.map