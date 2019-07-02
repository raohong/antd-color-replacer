export { getAntdSerials } from './antdColorPalette';
export { tint } from './tint';

export const regExcape = (str: string): string => {
  return str.replace(/[*+?{}[\]()\\\/.^$-]/g, '\\$&');
};
