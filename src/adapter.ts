import * as postcss from 'postcss';

export interface AntdColorReplacerAdapterCustomHandle {
  (node: postcss.Rule, postCss: typeof postcss): void;
}

type IAdapterResult = string | false | AntdColorReplacerAdapterCustomHandle | void;

export interface AntdColorReplacerAdapter {
  (selector: string): IAdapterResult;
}

/**
 *
 * @param {string} selector
 * @returns {Function | string | false}
 * 返回 false 删除
 * 返回 Funciton 时 自定义处理 api 参考 postcss
 * 返回 string 且不为空 替换
 * 其它跳过
 */

export const antdSelectorAdapter: AntdColorReplacerAdapter = selector => {
  if (
    selector === '.ant-btn:hover, .ant-btn:focus' ||
    selector === '.ant-btn:active, .ant-btn.active' ||
    selector === '.ant-btn:focus, .ant-btn:hover' ||
    selector === '.ant-btn.active, .ant-btn:active'
  ) {
    return selector.replace(/\.ant-btn/g, '$&:not(.ant-btn-primary)');
  }

  if (
    selector === '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon' ||
    selector ===
      '.ant-steps-item-custom.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon'
  ) {
    return false;
  }

  if (selector === '.ant-calendar-today .ant-calendar-date') {
    const calendarAdapter: AntdColorReplacerAdapterCustomHandle = (node, postCss) => {
      const newNode = node.clone({
        selector: ':not(.ant-calendar-selected-date).ant-calendar-today .ant-calendar-date',
      });

      const target = postCss.rule({
        selector: ':not(.ant-calendar-selected-date).ant-calendar-today .ant-calendar-date:active',
      });

      target.append({ prop: 'color', value: '#ffffff' });

      // 一定要先 append  新的 rule 因为后面的会被遍历 属性得到过滤
      node.before(target);
      node.replaceWith(newNode);
    };

    return calendarAdapter;
  }
};
