"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 从 js  文件提取 css
const getCssCode = (assets) => {
    // 这里采用 " 减少匹配范围
    const matcher = /push\(\[\w+\.\w+,\s*"(?=[\s\S]*?})([\s\S]+?)(?:\\.)?"\s*,\s*['"]['"]\]\)/g;
    const decl = /\w+\s*:\s*[^\s;]+?;/;
    const ret = [];
    let match;
    // tslint:disable-next-line: no-conditional-assignment
    while ((match = matcher.exec(assets))) {
        if (decl.test(match[1])) {
            ret.push(match[1].replace(/\\n/g, ''));
        }
    }
    return ret.join('\n');
};
exports.default = getCssCode;
