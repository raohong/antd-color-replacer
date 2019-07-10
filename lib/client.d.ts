interface IMeatFilenameCustomHandle {
    (metaFilename: string): string;
}
export interface AntdColorReplacerClientOptions {
    metaFilename?: string | IMeatFilenameCustomHandle;
    primaryColor?: string;
    colors?: string[];
    antd?: boolean;
}
export declare const clientCompiler: {
    compile: (options?: string | AntdColorReplacerClientOptions) => Promise<void>;
};
export default clientCompiler;
