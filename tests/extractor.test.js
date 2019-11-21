import * as postcss from 'postcss';
import Extractor from '../src/Extractor';
import { getOptions } from '../src/plugin';

const primaryColor = '#2486ff';

const colors = [primaryColor];

describe('Extractor test not in loose mode', () => {
  const options = getOptions({
    loose: false,
    antd: false,
    primaryColor,
    colors,
  });

  const extractor = new Extractor(options);

  it('contains target', async () => {
    const cssCode = `body{
      color:${primaryColor};
      font-size: 14px;
      border-top: 1px solid ${primaryColor};
    }
    .test {
      color: #fff;
    }
    `;

    const ret = await extractor.exec(cssCode);

    const root = postcss.parse(ret);

    let hasExpectedDecl = false;

    root.walkDecls(node => {
      if (!hasExpectedDecl) {
        hasExpectedDecl = node.prop === 'color' || node.prop === 'boder-top';
      }
    });

    const hasExpectedRule = root.some(node => {
      if (node.type === 'rule') {
        return node.selector === 'body';
      }
      return false;
    });

    const containRule = root.some(node => {
      if (node.type === 'rule') {
        return node.selector === '.test';
      }
      return false;
    });

    expect(hasExpectedDecl).toEqual(true);
    expect(hasExpectedRule).toEqual(true);

    // #fff passed
    expect(containRule).toEqual(false);
  });
});

describe('Extractor test  in loose mode', () => {
  const defaultOptions = getOptions({
    loose: true,
    antd: false,
    primaryColor,
    colors,
  });

  it('contains target', async () => {
    const options = {
      ...defaultOptions,
      looseProps: ['color', 'border-top'],
      luminance: [1, 1],
    };

    const extractor = new Extractor(options);

    const cssCode = `
      body {
        background: ${primaryColor};
        color: #fff;
      }

      body:hover {
        background: #fff;
        color: ${primaryColor};
      }
     `;

    const ret = await extractor.exec(cssCode);

    const root = postcss.parse(ret);

    const expectHasBodyColorDecl = root.some(node => {
      if (node.selector === 'body') {
        return node.nodes.some(subNode => subNode.prop === 'color' && subNode.value === '#fff');
      }

      return false;
    });

    expect(expectHasBodyColorDecl).toEqual(true);
  });
});
