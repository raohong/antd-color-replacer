"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const config_1 = require("./config");
const defaultOptions = {
    metaFilename: config_1.default.metaFilename,
    primaryColor: config_1.default.primaryColor,
    colors: [],
    antd: true,
};
const fetch = (url, cache = false) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 304 || (xhr.status >= 200 && xhr.status <= 204)) {
                    resolve(xhr.responseText);
                }
            }
        };
        xhr.onabort = reject;
        xhr.onerror = reject;
        // 增加 random
        xhr.open('GET', `${url}${!cache ? `?_ct=${Date.now()}` : ''}`);
        xhr.send();
    });
};
const getOptions = options => {
    const ret = {
        primaryColor: config_1.default.primaryColor,
        colors: [],
        metaFilename: config_1.default.metaFilename,
        antd: true,
    };
    // 如果传入字符串  默认是 primaryColor
    if (typeof options === 'string') {
        ret.primaryColor = options;
    }
    else {
        if (options.primaryColor) {
            ret.primaryColor = options.primaryColor;
        }
        if (Array.isArray(options.colors)) {
            ret.colors = options.colors;
        }
        if ('antd' in options) {
            ret.antd = options.antd;
        }
        if (options.metaFilename === undefined) {
            ret.metaFilename = config_1.default.metaFilename;
        }
        if (typeof options.metaFilename === 'function') {
            ret.metaFilename = options.metaFilename(config_1.default.metaFilename);
        }
    }
    if (ret.antd) {
        ret.colors = utils_1.getAntdSerials(ret.primaryColor);
    }
    return ret;
};
class AntdColorReplacerClient {
    constructor() {
        this.id = Date.now();
        this.compile = this.compile.bind(this);
    }
    compile(options = defaultOptions) {
        const compileOptions = getOptions(options);
        const isDev = this.meta ? this.meta.isDev : false;
        if (!isDev &&
            this.lastCompileOptions &&
            this.lastCompileOptions.primaryColor === compileOptions.primaryColor) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            let chain = new Promise(r => setTimeout(r, 0));
            // 请求 meta 数据
            if (!this.meta) {
                const metaFilename = compileOptions.metaFilename;
                chain = chain
                    .then(() => fetch(metaFilename))
                    .then(meta => {
                    try {
                        const defaultMeta = JSON.parse(meta);
                        this.meta = defaultMeta;
                        this.lastCompileOptions = {
                            primaryColor: defaultMeta.primaryColor,
                            colors: defaultMeta.colors,
                            antd: defaultMeta.antd,
                        };
                        // 缓存以供开发者模式调用
                        this.initialCompileOptions = Object.assign({}, this.lastCompileOptions);
                    }
                    catch (_) {
                        reject();
                    }
                });
            }
            let cssText = this.getCssText();
            // 如果没有则请求
            if (cssText === null) {
                chain = chain.then(() => {
                    return fetch(this.meta.filename).then(css => {
                        cssText = this.formatCssText(css);
                        return css;
                    });
                });
            }
            else {
                chain = chain.then(() => cssText);
            }
            // 得到 css 替换 colors
            chain = chain.then(text => {
                this.setCssText(this.replaceColors(text, compileOptions.colors));
            });
            // 保存上一次的配置
            chain.then(() => {
                this.lastCompileOptions = compileOptions;
                resolve();
            }, reject);
        });
    }
    replaceColors(cssText, colors) {
        const targetColors = this.meta.isDev
            ? this.initialCompileOptions.colors
            : this.lastCompileOptions.colors;
        const colorRegs = targetColors.map(color => new RegExp(utils_1.regEscape(color), 'gi'));
        return colorRegs.reduce((str, reg, index) => {
            const target = colors[index];
            return target ? str.replace(reg, target) : str;
        }, cssText);
    }
    setCssText(css) {
        let el = document.querySelector(`style[id="${this.id}"]`);
        if (el === null) {
            el = document.createElement('style');
            el.id = String(this.id);
            el.setAttribute('type', 'text/css');
            const task = () => {
                document.body.insertBefore(el, document.body.firstChild);
            };
            if (!document.body) {
                window.addEventListener('DOMContentLoaded', task);
            }
            else {
                task();
            }
        }
        el.innerHTML = css;
    }
    getCssText() {
        const meta = this.meta;
        // 开发模式下取消缓存
        if (meta !== undefined && meta.isDev) {
            return null;
        }
        const el = document.querySelector(`style[id="${this.id}"]`);
        if (!el) {
            return null;
        }
        return el.innerHTML;
    }
    formatCssText(css) {
        // 可能出现 br 等字符
        return css.replace(/(:\n|\r\n?)/g, '');
    }
}
exports.clientCompiler = {
    compile: new AntdColorReplacerClient().compile,
};
exports.default = exports.clientCompiler;
