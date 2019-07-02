"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var antdColorPalette_1 = require("./antdColorPalette");
exports.getAntdSerials = antdColorPalette_1.getAntdSerials;
var tint_1 = require("./tint");
exports.tint = tint_1.tint;
exports.regExcape = (str) => {
    return str.replace(/[*+?{}[\]()\\\/.^$-]/g, '\\$&');
};
