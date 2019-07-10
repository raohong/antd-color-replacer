"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Color = require("color");
/**
 * less tint 函数
 * @param {string} color
 * @param {number} weight
 */
exports.tint = (color, weight = 0) => {
    const baseColor = Color('#ffffff');
    return baseColor
        .mix(Color(color), 1 - weight)
        .hex()
        .toLowerCase();
};
exports.default = exports.tint;
