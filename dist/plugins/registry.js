import { get, merge, omit, set } from 'lodash-es';
import { OptionalModule } from '../fundamentals/nestjs';
export const REGISTERED_PLUGINS = new Map();
export const ENABLED_PLUGINS = new Set();
function registerPlugin(plugin, module) {
    REGISTERED_PLUGINS.set(plugin, module);
}
export const Plugin = (options) => {
    return (target) => {
        registerPlugin(options.name, target);
        return OptionalModule(omit(options, 'name'))(target);
    };
};
export function enablePlugin(plugin, config = {}) {
    config = merge(get(AFFiNE.plugins, plugin), config);
    set(AFFiNE.plugins, plugin, config);
    ENABLED_PLUGINS.add(plugin);
}
//# sourceMappingURL=registry.js.map