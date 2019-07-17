import getRelativeLuminance from 'get-relative-luminance';
export { getAntdSerials } from './antdColorPalette';
export { tint } from './tint';

/**
 * 正则转义
 * @param str
 */
export const regExcape = (str: string): string => {
  return str.replace(/[*+?{}[\]()\\\/.^$-]/g, '\\$&');
};

/**
 *  从 css delcation value 中提取 颜色
 * @param cssValue
 */
export const extractColorFromValue = (cssValue: string): null | string => {
  const parser = /(?:#(?:[\da-f]{6}|[\da-f]{3}))|(?:rgba?\([^)]+\))|(?:hsla?\([^)]+\))/i;

  const match = cssValue.match(parser);

  return match ? match[0] : null;
};

/**
 * 提取 color 并比较 亮度实在指定之间
 * @param cssValue
 * @param range
 */
export const checkColorLuminance = (cssValue: string, range: [number, number]): boolean => {
  try {
    const color = extractColorFromValue(cssValue);

    if (color === null) {
      return false;
    }

    const luminance = getRelativeLuminance(color);

    return luminance >= range[0] && luminance <= range[1];
  } catch (err) {
    return false;
  }
};
