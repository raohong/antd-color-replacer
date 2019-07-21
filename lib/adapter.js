'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
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
  if (selector === '.ant-calendar-today .ant-calendar-date') {
    const calendarAdapter = (node, postCss) => {
      const newNode = postCss.rule({
        selector:
          ':not(.ant-calendar-week):not(.ant-calendar-range).ant-calendar .ant-calendar-today:not(.ant-calendar-disabled-cell) .ant-calendar-date:active',
      });
      newNode.append({
        prop: 'color',
        value: '#ffffff',
      });
      // 弱国要额外添加 rule node , 一定要先 append  新的 rule 因为后面的会被遍历 属性得到过滤
      node.before(newNode);
    };
    return calendarAdapter;
  }
  // dark Menu
  if (selector === '.ant-menu') {
    return ':not(.ant-menu-dark).ant-menu';
  }
};
