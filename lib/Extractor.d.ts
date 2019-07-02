import { AntdColorReplacerOptions } from './index';
interface IExtractor {
    (assets: string, options: AntdColorReplacerOptions): Promise<string>;
}
export declare const Extactor: IExtractor;
export default Extactor;
