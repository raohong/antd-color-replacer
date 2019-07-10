"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var antdColorPalette_1 = require("./antdColorPalette");
exports.getAntdSerials = antdColorPalette_1.getAntdSerials;
var tint_1 = require("./tint");
exports.tint = tint_1.tint;
/**
 * 正则转义
 * @param str
 */
exports.regExcape = (str) => {
    return str.replace(/[*+?{}[\]()\\\/.^$-]/g, '\\$&');
};
