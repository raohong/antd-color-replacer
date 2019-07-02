"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 从 js  文件提取 css
const getCssCode = (assets) => {
    const matcher = /push\(\[\w+\.\w+,\s*"(?=[\s\S]*?})([\s\S]+?)(?:\\.)?"\s*,\s*['"]['"]\]\)/g;
    const decl = /\w+\s*:\s*[^\s;]+?;/;
    const ret = [];
    let match;
    while ((match = matcher.exec(assets))) {
        if (decl.test(match[1])) {
            ret.push(match[1].replace(/\\n/g, ''));
        }
    }
    return ret.join('\n');
};
exports.default = getCssCode;
