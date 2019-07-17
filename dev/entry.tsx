import React from 'react';
import ReactDOM from 'react-dom';

import styles from './styles/index.less';
import { AntdColorReplacerClient } from '../lib';

const primaryColor = '#0081ff';
const colorList = ['#0081ff', '#1890ff', '#F5222D', '#52C41A'];

const getColors = (color: string) => {
  return [color];
};

const ColorTag = ({ color, onClick, checked }) => (
  <div
    onClick={onClick}
    className={styles.tag}
    style={{
      width: 50,
      height: 50,
      backgroundColor: color,
      position: 'relative',
    }}
  />
);

const ColorList = props => {
  const onClick = color => {
    props.onChange(color);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {colorList.map(color => (
        // @ts-ignore
        <ColorTag
          checked={color === props.color}
          onClick={() => onClick(color)}
          color={color}
          key={color}
        />
      ))}
    </div>
  );
};

const App = () => {
  const [color, setColor] = React.useState(primaryColor);

  React.useEffect(() => {
    AntdColorReplacerClient.compile({
      primaryColor: color,
      colors: getColors(color),
      antd: false,
    });
  });

  return (
    <div className={styles.root}>
      <ColorList color={color} onChange={setColor} />
      <p className={styles.text}>
        Introducing the initial release of Firefox Preview (GitHub), an entire browser built from
        the ground up with GeckoView and Mozilla Android Components. Firefox Preview is our platform
        for building, testing, and delivering unique features. Though still an early preview, this
        is our first end-user product built completely with these new
      </p>

      <p className={styles.text}>
        Introducing the initial release of Firefox Preview (GitHub), an entire browser built from
        the ground up with GeckoView and Mozilla Android Components. Firefox Preview is our platform
        for building, testing, and delivering unique features. Though still an early preview, this
        is our first end-user product built completely with these new
      </p>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
