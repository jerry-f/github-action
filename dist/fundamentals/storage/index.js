var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import './config';
import { Global, Module } from '@nestjs/common';
import { registerStorageProvider, StorageProviderFactory } from './providers';
import { FsStorageProvider } from './providers/fs';
registerStorageProvider('fs', (config, bucket) => {
    if (!config.storageProviders.fs) {
        throw new Error('Missing fs storage provider configuration');
    }
    return new FsStorageProvider(config.storageProviders.fs, bucket);
});
let StorageProviderModule = class StorageProviderModule {
};
StorageProviderModule = __decorate([
    Global(),
    Module({
        providers: [StorageProviderFactory],
        exports: [StorageProviderFactory],
    })
], StorageProviderModule);
export { StorageProviderModule };
export * from '../../native';
export { registerStorageProvider, StorageProviderFactory } from './providers';
export { autoMetadata, toBuffer } from './providers/utils';
//# sourceMappingURL=index.js.map