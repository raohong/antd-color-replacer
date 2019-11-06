"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = require("./hash");
const utils_1 = require("./utils");
const getCssCode_1 = require("./utils/getCssCode");
const adapters = require("./adapter");
const Extractor_1 = require("./Extractor");
const config_1 = require("./config");
const defaultOptions = {
    filename: config_1.default.cssFilename,
    antd: true,
    primaryColor: config_1.default.primaryColor,
    colors: [],
    loose: true,
    looseProps: config_1.default.looseProps,
    luminance: config_1.default.luminance,
};
/**
 * 获取配置信息
 * @param options
 */
exports.getOptions = (options, defaults = defaultOptions) => {
    if (options !== undefined && typeof options !== 'object') {
        throw new TypeError('AntdColorReplacer required a object options');
    }
    let colors = options.colors;
    options.primaryColor = options.primaryColor || defaultOptions.primaryColor;
    if (!('antd' in options) || options.antd) {
        colors = utils_1.getAntdSerials(options.primaryColor);
        if (!options.selectorAdapter) {
            options.selectorAdapter = adapters.antdSelectorAdapter;
        }
    }
    options.loose = true;
    if ('loose' in options) {
        // options.loose = !!options.loose;
        if (!('looseProps' in options)) {
            options.looseProps = defaultOptions.looseProps;
        }
        if (!('luminance' in options)) {
            options.luminance = defaultOptions.luminance;
        }
    }
    if (!options.filename) {
        options.filename = defaultOptions.filename;
    }
    return Object.assign({}, defaults, options, { colors });
};
class AntdColorReplacer {
    constructor(options = defaultOptions) {
        this.options = exports.getOptions(options);
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync('AntdColorReplacer', (compilation, callback) => {
            const tasks = [];
            const parser = /\.(?:js|css)$/;
            const options = this.options;
            const extrator = new Extractor_1.default(options);
            compilation.chunks.forEach(chunk => {
                chunk.files.forEach(filename => {
                    if (parser.test(filename)) {
                        tasks.push(extrator.exec(this.getAssets(filename, compilation)));
                    }
                });
            });
            Promise.all(tasks)
                .then(assets => {
                this.handleAssets(compilation, assets.join(''));
                callback();
            })
                .catch(err => {
                console.log(err);
            });
        });
    }
    getAssets(filename, compilation) {
        const assets = compilation.assets[filename].source();
        // ToDo js文件代码 获取的优化
        if (/\.js/.test(filename)) {
            return getCssCode_1.default(assets);
        }
        return assets;
    }
    handleAssets(compilation, assets) {
        const options = this.options;
        // 是否 hash 如果没有配置 生产环境采用 其它不采用
        const isHash = compilation.options.mode === 'production' && ('hash' in options ? options.hash : true);
        let assetsFilename = options.filename;
        if (compilation.options.mode === 'production' && isHash) {
            const h = hash_1.default(assets);
            assetsFilename = assetsFilename.replace(/\.css/, () => `.${h.slice(0, 8)}.css`);
        }
        compilation.assets[assetsFilename] = {
            source() {
                return assets;
            },
            size() {
                return assets.length;
            },
        };
        this.generateThemeMeta(compilation, assetsFilename);
    }
    generateThemeMeta(compilation, assetsFilename) {
        const options = this.options;
        const webpackOptions = compilation.options;
        const publicPath = webpackOptions.output.publicPath || '';
        const meta = {
            filename: publicPath + assetsFilename,
            isDev: compilation.options.mode !== 'production',
            antd: options.antd,
            colors: options.colors,
            primaryColor: options.primaryColor,
        };
        const meatFilename = config_1.default.metaFilename;
        const content = JSON.stringify(meta);
        compilation.assets[meatFilename.replace(/^\//, '')] = {
            source() {
                return content;
            },
            size() {
                return content.length;
            },
        };
    }
}
exports.default = AntdColorReplacer;
