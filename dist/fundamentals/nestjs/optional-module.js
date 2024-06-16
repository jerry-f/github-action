import { Module, } from '@nestjs/common';
import { omit } from 'lodash-es';
const additionalOptions = [
    'contributesTo',
    'requires',
    'if',
    'overrides',
];
export function OptionalModule(metadata) {
    return (target) => {
        additionalOptions.forEach(option => {
            if (Object.hasOwn(metadata, option)) {
                Reflect.defineMetadata(option, metadata[option], target);
            }
        });
        if (metadata.overrides) {
            metadata.providers = (metadata.providers ?? []).concat(metadata.overrides);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            metadata.exports = (metadata.exports ?? []).concat(metadata.overrides);
        }
        const nestMetadata = omit(metadata, additionalOptions);
        Module(nestMetadata)(target);
    };
}
export function getOptionalModuleMetadata(target, key) {
    if ('module' in target) {
        return target[key];
    }
    else {
        return Reflect.getMetadata(key, target);
    }
}
//# sourceMappingURL=optional-module.js.map