import * as postcss from 'postcss';

export type AntdColorReplacerAdapterCustomHandle = (
  node: postcss.Rule,
  postCss: typeof postcss
) => void;

type IAdapterResult = string | false | AntdColorReplacerAdapterCustomHandle | void;

export type AntdColorReplacerAdapter = (selector: string) => IAdapterResult;

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
  // 日期选择 disabled .ant-calendar-date:active 样式
  if (selector === '.ant-calendar-date:active') {
    return ':not(.ant-calendar-disabled-cell).ant-calendar-cell .ant-calendar-date:active';
  }

  //  日期选择 disabled .ant-calendar-today background-color 样式
  if (selector === '.ant-calendar-selected-day .ant-calendar-date') {
    return ':not(.ant-calendar-disabled-cell).ant-calendar-selected-day .ant-calendar-date';
  }

  // Date RangePicker
  if (
    selector ===
      '.ant-calendar-selected-date .ant-calendar-date, .ant-calendar-selected-start-date .ant-calendar-date, .ant-calendar-selected-end-date .ant-calendar-date' ||
    selector ===
      '.ant-calendar-selected-date .ant-calendar-date, .ant-calendar-selected-end-date .ant-calendar-date, .ant-calendar-selected-start-date .ant-calendar-date'
  ) {
    return selector
      .split(',')
      .map(item => `:not(.ant-calendar-disabled-cell)${item}`)
      .join(',');
  }

  // Date RangePicker :hover
  if (
    selector ===
    '.ant-calendar-selected-date .ant-calendar-date:hover, .ant-calendar-selected-start-date .ant-calendar-date:hover, .ant-calendar-selected-end-date .ant-calendar-date:hover'
  ) {
    return selector
      .split(',')
      .map(item => `:not(.ant-calendar-disabled-cell)${item}`)
      .join(',');
  }
};
