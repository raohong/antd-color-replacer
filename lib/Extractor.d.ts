import { AntdColorReplacerOptions } from './index';
declare type IExtractor = (assets: string, options: AntdColorReplacerOptions) => Promise<string>;
export declare const Extactor: IExtractor;
export default Extactor;
