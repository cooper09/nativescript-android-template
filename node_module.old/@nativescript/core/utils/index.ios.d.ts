export { iOSNativeHelper } from './native-helper';
export * from './utils-common';
export { Source } from './debug';
export declare function openFile(filePath: string): boolean;
export declare function GC(): void;
export declare function releaseNativeObject(object: NSObject): void;
export declare function openUrl(location: string): boolean;
export declare function isRealDevice(): boolean;
export declare const ad = 0;
