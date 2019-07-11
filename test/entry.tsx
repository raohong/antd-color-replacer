import React from 'react';
import ReactDOM from 'react-dom';

import { AntdColorReplacerClient } from '../lib';
import styles from './styles/index.less';

const primaryColor = '#1890ff';

const getColors = primaryColor => {
  return [primaryColor];
};

const colors = [primaryColor, '#52c41a', '#13c2c2'];

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

const setup = App => ReactDOM.render(<App />, document.querySelector('#root'));

setup(App);
