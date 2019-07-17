'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const react_1 = require('react');
const react_dom_1 = require('react-dom');
const index_less_1 = require('./styles/index.less');
const client_1 = require('../lib/client');
const primaryColor = '#0081ff';
const colorList = ['#0081ff', '#1890ff', '#F5222D', '#52C41A'];
const getColors = color => {
  return [color];
};
const ColorTag = ({ color, onClick, _ }) =>
  react_1.default.createElement('div', {
    onClick: onClick,
    className: index_less_1.default.tag,
    style: {
      width: 50,
      height: 50,
      backgroundColor: color,
      position: 'relative',
    },
  });
const ColorList = props => {
  const onClick = color => {
    props.onChange(color);
  };
  return react_1.default.createElement(
    'div',
    { style: { display: 'flex', flexWrap: 'wrap' } },
    colorList.map(color =>
      // @ts-ignore
      react_1.default.createElement(ColorTag, {
        checked: color === props.color,
        onClick: () => onClick(color),
        color: color,
        key: color,
      })
    )
  );
};
const App = () => {
  const [color, setColor] = react_1.default.useState(primaryColor);
  react_1.default.useEffect(() => {
    client_1.default.compile({
      primaryColor: color,
      colors: getColors(color),
      antd: false,
    });
  });
  return react_1.default.createElement(
    'div',
    { className: index_less_1.default.root },
    react_1.default.createElement(ColorList, { color: color, onChange: setColor }),
    react_1.default.createElement(
      'p',
      { className: index_less_1.default.text },
      'Introducing the initial release of Firefox Preview (GitHub), an entire browser built from the ground up with GeckoView and Mozilla Android Components. Firefox Preview is our platform for building, testing, and delivering unique features. Though still an early preview, this is our first end-user product built completely with these new'
    ),
    react_1.default.createElement(
      'p',
      { className: index_less_1.default.text },
      'Introducing the initial release of Firefox Preview (GitHub), an entire browser built from the ground up with GeckoView and Mozilla Android Components. Firefox Preview is our platform for building, testing, and delivering unique features. Though still an early preview, this is our first end-user product built completely with these new'
    ),
    react_1.default.createElement('button', { className: index_less_1.default.dark }, 'Toggle Btn')
  );
};
react_dom_1.default.render(
  react_1.default.createElement(App, null),
  document.querySelector('#root')
);
