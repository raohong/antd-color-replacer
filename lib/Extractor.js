"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postcss = require("postcss");
const utils_1 = require("./utils");
const check = (code, colorRegs) => {
    return colorRegs.some(reg => reg.test(code));
};
// 替换特殊的 selector
const nodeAdapter = (node, selectorAdapter) => {
    // 去除换行符
    let selector = node.selector.replace(/(?:\n|\r\n?)/g, '');
    // 格式化 >
    selector = selector.replace(/\s*>\s*/g, ' > ');
    // 格式化 ,
    selector = selector.replace(/\s*,\s*/g, ', ');
    /**
     * 返回 false 删除
     * 返回 Funciton 时 自定义处理 api 参考 postcss
     * 返回 string 且不为空 替换
     * 其它跳过
     */
    const result = selectorAdapter(selector);
    if (result === false) {
        node.remove();
    }
    else if (typeof result === 'function') {
        result(node, postcss);
        return;
    }
    else if (!result) {
        return;
    }
    const newNode = node.clone({
        selector: result,
    });
    node.replaceWith(newNode);
};
/**
 * 过滤 非 keyframes atrule
 * @param node
 * @param checker
 */
const filterNode = (node, checker) => {
    let flag = false;
    node.walkDecls(decl => {
        if (!flag) {
            flag = checker(decl.value);
        }
    });
    if (!flag) {
        node.remove();
    }
};
const handleRule = (node, options, ruleChecker) => {
    if (!options.loose) {
        node.walk(subNode => {
            switch (subNode.type) {
                case 'decl':
                    if (!ruleChecker(subNode.value)) {
                        subNode.remove();
                    }
                    break;
                case 'comment':
                    subNode.remove();
                    break;
            }
        });
        return;
    }
    const { luminance, looseProps } = options;
    node.walkComments(subNode => {
        subNode.remove();
    });
    /**
     * 如果该 node  没有包含主色, 则不允许 loose prop
     */
    const hasThemeColor = node.some(subNode => {
        if (subNode.type !== 'decl') {
            return false;
        }
        return ruleChecker(subNode.value);
    });
    node.walkDecls(subNode => {
        const { prop, value } = subNode;
        if (!ruleChecker(value)) {
            if (!utils_1.loosePropCheck(prop, looseProps) ||
                (!utils_1.checkColorLuminance(value, luminance) || !hasThemeColor)) {
                subNode.remove();
            }
        }
    });
};
class Extactor {
    constructor(options) {
        this.colorRegs = [];
        this.options = options;
        const { primaryColor } = options;
        const colors = options.colors.slice();
        // 将主色排在最前面检查
        if (colors.includes(primaryColor)) {
            colors.unshift(...colors.splice(colors.indexOf(primaryColor), 1));
        }
        const colorRegs = colors.map(color => new RegExp(utils_1.regEscape(color), 'i'));
        this.colorRegs = colorRegs;
        this.ruleChecker = (val) => {
            return check(val, this.colorRegs);
        };
        this.exec = this.exec.bind(this);
    }
    exec(assets) {
        if (!assets) {
            return Promise.resolve('');
        }
        const colorRegs = this.colorRegs;
        // 预先查找
        if (!check(assets, colorRegs)) {
            return Promise.resolve('');
        }
        return new Promise((resolve, reject) => {
            try {
                const result = this.extractRule(assets);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    /**
     * 提取 rule
     * @param assets
     */
    extractRule(assets) {
        try {
            const { selectorAdapter } = this.options;
            const ruleChecker = this.ruleChecker;
            const root = postcss.parse(assets);
            const walker = parentNode => {
                parentNode.each(node => {
                    // 删除注释
                    if (node.type === 'comment') {
                        node.remove();
                        return;
                    }
                    // 普通 css 规则 和 除动画申明外 去除不满足条件的生命 当为空时 删除 node
                    if (node.type === 'rule' || (node.type === 'atrule' && !/keyframes/.test(node.name))) {
                        handleRule(node, this.options, ruleChecker);
                        /**
                         * 如果是 atrule 先递归处理过滤数据 再删掉没有 child  的节点
                         */
                        if (node.type === 'atrule' && node.nodes) {
                            node.nodes.forEach(subNode => {
                                if (subNode.type === 'rule' || subNode.type === 'atrule') {
                                    walker(subNode);
                                }
                            });
                            node.walk(subNode => {
                                if (subNode.type === 'rule' || subNode.type === 'atrule') {
                                    if (!subNode.nodes || !subNode.nodes.length) {
                                        subNode.remove();
                                    }
                                }
                            });
                        }
                        // 空规则删除
                        if (node.nodes && !node.nodes.length) {
                            node.remove();
                            // 自定义 selector 处理
                        }
                        else if (typeof selectorAdapter === 'function' && node.type === 'rule') {
                            nodeAdapter(node, selectorAdapter);
                        }
                        // 非 @keyframes atrule
                    }
                    else if (node.type === 'atrule') {
                        filterNode(node, ruleChecker);
                    }
                });
            };
            walker(root);
            return root.toString();
        }
        catch (error) {
            if (error.showSourceCode) {
                error.showSourceCode();
            }
            throw error;
        }
    }
}
exports.default = Extactor;
