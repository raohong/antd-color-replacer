import getRelativeLuminance from 'get-relative-luminance';
export { getAntdSerials } from './antdColorPalette';
export { tint } from './tint';

/**
 * 正则转义
 * @param str
 */
export const regEscape = (str: string): string => {
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
  const value = cssValue.replace(/\s*!important/, '');
  const color = extractColorFromValue(value);
  const noneList = ['0', 'none', 'unset'];

  try {
    if (color === null) {
      return noneList.includes(value);
    }

    const luminance = getRelativeLuminance(color);

    return luminance >= range[0] && luminance <= range[1];
  } catch (err) {
    return false;
  }
};

/**
 * css  prefix 过滤
 * @param prop
 */
export const removeCssPrefix = (prop: string): string => {
  const filter = /^(?:-webkit-|-ms-|-moz-|-o-)/i;
  return prop.replace(filter, '');
};

/**
 * loose 模式下 属性检查
 * @param cssProp
 * @param list
 */
export const loosePropCheck = (cssProp: string, list: string[]): boolean => {
  // 可能为空
  if (!cssProp) {
    return false;
  }

  const prop = removeCssPrefix(cssProp);

  const btParser = /border|outline/;
  const bgParser = /background/;

  // border outline
  if (btParser.test(prop)) {
    const configProp = list.find(item => {
      const propChecker = new RegExp(regEscape(item), 'i');
      return propChecker.test(prop);
    });

    if (!configProp) {
      return false;
    }

    const match1 = configProp.match(/^[a-z\d]+-([a-z\d]+)(?:-([a-z\d]+))?$/i) as RegExpMatchArray;
    // eg border outline
    if (match1 === null) {
      return true;
    }

    const match2 = prop.match(/^[a-z\d]+-+([a-z\d]+)(?:-([a-z\d]+))?$/i);

    // eg configProp: border-top prop: border
    if (match2 === null) {
      return false;
    }

    // eg prop: border-top-color
    if (match2[2]) {
      if (match2[2] !== 'color') {
        return false;
      }
      // eg configProp: border-top
      if (!match1[2] && match1[1] === match2[1]) {
        return true;
      }

      // eg configProp: border-top-color prop:border-top-color
      // eg configProp: border-bottom-color prop:border-top-color
      if (match1[2] && match1[2] === 'color' && match1[1] === match2[1]) {
        return true;
      }
    } else {
      // eg prop: border-top configPorp: border-bottom
      if (match2[1] && !match1[2] && match2[1] === match1[1]) {
        return true;
      }
    }

    return false;
  }

  // background
  if (bgParser.test(prop)) {
    const target = list.find(item => bgParser.test(item));

    if (!target) {
      return false;
    }

    // 由前面的条件可知 必存在
    const bgMatch1 = prop.match(/^background(?:-([a-z\d]+))?$/i) as RegExpMatchArray;
    const bgMatch2 = target.match(/^background(?:-([a-z\d]+))?$/i) as RegExpMatchArray;

    if (bgMatch1[1]) {
      // eg background-color background
      if (!bgMatch2[1]) {
        return true;
      }

      return bgMatch2[1] === bgMatch1[1];
    }

    // eg background background-image
    return bgMatch2[1] ? false : prop === target;
  }

  return list.includes(prop);
};
