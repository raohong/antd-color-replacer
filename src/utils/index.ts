export { getAntdSerials } from './antdColorPalette';
export { tint } from './tint';

/**
 * 正则转义
 * @param str
 */
export const regExcape = (str: string): string => {
  return str.replace(/[*+?{}[\]()\\\/.^$-]/g, '\\$&');
};
