"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = require("@ant-design/colors");
const tint_1 = require("./tint");
/**
 *
 * @param {string} primaryColor 主色
 * @param {number} tintModulus less tint 最小增加系数
 */
exports.getAntdSerials = (primaryColor, tintModulus = 0.1) => {
    const num = Math.floor(1 / tintModulus) - 1;
    const tintColors = Array.from({ length: num }, (_, i) => tint_1.default(primaryColor, i * tintModulus));
    return tintColors.concat(colors_1.generate(primaryColor));
};
exports.default = exports.getAntdSerials;
