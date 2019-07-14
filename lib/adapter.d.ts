import * as postcss from 'postcss';
export declare type AntdColorReplacerAdapterCustomHandle = (node: postcss.Rule, postCss: typeof postcss) => void;
declare type IAdapterResult = string | false | AntdColorReplacerAdapterCustomHandle | void;
export declare type AntdColorReplacerAdapter = (selector: string) => IAdapterResult;
/**
 *
 * @param {string} selector
 * @returns {Function | string | false}
 * 返回 false 删除
 * 返回 Funciton 时 自定义处理 api 参考 postcss
 * 返回 string 且不为空 替换
 * 其它跳过
 */
export declare const antdSelectorAdapter: AntdColorReplacerAdapter;
export {};
