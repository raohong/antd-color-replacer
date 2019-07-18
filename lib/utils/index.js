'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const get_relative_luminance_1 = require('get-relative-luminance');
var antdColorPalette_1 = require('./antdColorPalette');
exports.getAntdSerials = antdColorPalette_1.getAntdSerials;
var tint_1 = require('./tint');
exports.tint = tint_1.tint;
/**
 * 正则转义
 * @param str
 */
exports.regEscape = str => {
  return str.replace(/[*+?{}[\]()\\\/.^$-]/g, '\\$&');
};
/**
 *  从 css delcation value 中提取 颜色
 * @param cssValue
 */
exports.extractColorFromValue = cssValue => {
  const parser = /(?:#(?:[\da-f]{6}|[\da-f]{3}))|(?:rgba?\([^)]+\))|(?:hsla?\([^)]+\))/i;
  const match = cssValue.match(parser);
  return match ? match[0] : null;
};
/**
 * 提取 color 并比较 亮度实在指定之间
 * @param cssValue
 * @param range
 */
exports.checkColorLuminance = (cssValue, range) => {
  try {
    const color = exports.extractColorFromValue(cssValue);
    if (color === null) {
      return false;
    }
    const luminance = get_relative_luminance_1.default(color);
    return luminance >= range[0] && luminance <= range[1];
  } catch (err) {
    return false;
  }
};
/**
 * css  prefix 过滤
 * @param prop
 */
exports.removeCssPrefix = prop => {
  const filter = /^(?:-webkit-|-ms-|-moz-|-o-)/i;
  return prop.replace(filter, '');
};
/**
 * loose 模式下 属性检查
 * @param cssProp
 * @param list
 */
exports.loosePropCheck = (cssProp, list) => {
  // 可能为空
  if (!cssProp) {
    return false;
  }
  const prop = exports.removeCssPrefix(cssProp);
  const btParser = /border|outline/;
  const bgParser = /background/;
  // border outline
  if (btParser.test(prop)) {
    const configProp = list.find(item => btParser.test(item));
    if (!configProp) {
      return false;
    }
    const match1 = configProp.match(/^[a-z\d]+-([a-z\d]+)(?:-([a-z\d]+))?$/i);
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
    const bgMatch1 = prop.match(/^background(?:-([a-z\d]+))?$/i);
    const bgMatch2 = target.match(/^background(?:-([a-z\d]+))?$/i);
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
