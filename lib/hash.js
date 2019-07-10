"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
function hash(content, digest = 'hex') {
    const m = crypto.createHash('md5');
    m.update(content);
    return m.digest(digest);
}
exports.default = hash;
