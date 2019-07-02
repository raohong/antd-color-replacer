import * as webpack from 'webpack';
import * as adapters from './adapter';
export { clientCompiler as AntdColorReplacerClient } from './client';
export interface AntdColorReplacerOptions {
    antd?: boolean;
    primaryColor?: string;
    colors?: string[];
    filename?: string;
    hash?: boolean;
    selectorAdapter?: adapters.AntdColorReplacerAdapter;
}
export interface AntdColorReplacerMeta {
    filename: string;
    antd: boolean;
    colors: string[];
    primaryColor: string;
}
declare class AntdColorReplacer {
    private options;
    constructor(options?: AntdColorReplacerOptions);
    apply(compiler: webpack.Compiler): void;
    getAssets(filename: string, compilation: any): any;
    handleAssets(compilation: any, assets: any): void;
    generateThemeMeta(compilation: any, assetsFilename: any): void;
}
export default AntdColorReplacer;
