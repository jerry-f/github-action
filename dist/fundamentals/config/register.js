import { RuntimeConfigType } from '@prisma/client';
import { get, merge, set } from 'lodash-es';
export const defaultStartupConfig = {};
export const defaultRuntimeConfig = {};
export function runtimeConfigType(val) {
    if (Array.isArray(val)) {
        return RuntimeConfigType.Array;
    }
    switch (typeof val) {
        case 'string':
            return RuntimeConfigType.String;
        case 'number':
            return RuntimeConfigType.Number;
        case 'boolean':
            return RuntimeConfigType.Boolean;
        default:
            return RuntimeConfigType.Object;
    }
}
function registerRuntimeConfig(module, configs) {
    Object.entries(configs).forEach(([key, value]) => {
        defaultRuntimeConfig[`${module}/${key}`] = {
            id: `${module}/${key}`,
            module,
            key,
            description: value.desc,
            value: value.default,
            type: runtimeConfigType(value.default),
        };
    });
}
export function defineStartupConfig(module, configs) {
    set(defaultStartupConfig, module, merge(get(defaultStartupConfig, module, {}), configs));
}
export function defineRuntimeConfig(module, configs) {
    registerRuntimeConfig(module, configs);
}
//# sourceMappingURL=register.js.map