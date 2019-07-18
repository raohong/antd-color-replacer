export { getAntdSerials } from './antdColorPalette';
export { tint } from './tint';
/**
 * 正则转义
 * @param str
 */
export declare const regEscape: (str: string) => string;
/**
 *  从 css delcation value 中提取 颜色
 * @param cssValue
 */
export declare const extractColorFromValue: (cssValue: string) => string | null;
/**
 * 提取 color 并比较 亮度实在指定之间
 * @param cssValue
 * @param range
 */
export declare const checkColorLuminance: (cssValue: string, range: [number, number]) => boolean;
/**
 * css  prefix 过滤
 * @param prop
 */
export declare const removeCssPrefix: (prop: string) => string;
/**
 * loose 模式下 属性检查
 * @param cssProp
 * @param list
 */
export declare const loosePropCheck: (cssProp: string, list: string[]) => boolean;
