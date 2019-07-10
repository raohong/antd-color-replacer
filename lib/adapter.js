"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param {string} selector
 * @returns {Function | string | false}
 * 返回 false 删除
 * 返回 Funciton 时 自定义处理 api 参考 postcss
 * 返回 string 且不为空 替换
 * 其它跳过
 */
exports.antdSelectorAdapter = selector => {
    if (selector === '.ant-btn:hover, .ant-btn:focus' ||
        selector === '.ant-btn:active, .ant-btn.active' ||
        selector === '.ant-btn:focus, .ant-btn:hover' ||
        selector === '.ant-btn.active, .ant-btn:active') {
        return selector.replace(/\.ant-btn/g, '$&:not(.ant-btn-primary)');
    }
    if (selector === '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon' ||
        selector ===
            '.ant-steps-item-custom.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon') {
        return false;
    }
    if (selector === '.ant-calendar-today .ant-calendar-date') {
        const calendarAdapter = (node, postCss) => {
            const newNode = node.clone({
                selector: ':not(.ant-calendar-selected-date).ant-calendar-today .ant-calendar-date',
            });
            const target = postCss.rule({
                selector: ':not(.ant-calendar-selected-date).ant-calendar-today .ant-calendar-date:active',
            });
            target.append({
                prop: 'color',
                value: '#ffffff',
            });
            // 一定要先 append  新的 rule 因为后面的会被遍历 属性得到过滤
            node.before(target);
            node.replaceWith(newNode);
        };
        return calendarAdapter;
    }
    // https://github.com/ant-design/ant-design-pro/issues/4710
    if (selector ===
        '.ant-menu.ant-menu-dark .ant-menu-item-selected, .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected') {
        const darkmenuAdapter = (node, _) => {
            const newNode = node.clone({
                color: '#fff',
            });
            node.replaceWith(newNode);
        };
        return darkmenuAdapter;
    }
};
