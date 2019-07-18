import {
  regEscape,
  checkColorLuminance,
  extractColorFromValue,
  loosePropCheck,
  removeCssPrefix,
} from '../src/utils';

describe('regEscape test', () => {
  it('get escaped str', () => {
    const list = ['.', '?', '*', '{', '}', '(', ')', '[', ']', '+', '^', '$', '\\', '/', '-'];

    const special = ['s.', 's?'];

    list.forEach(str => {
      expect(regEscape(str)).toEqual(`\\${str}`);
    });

    special.forEach(str => {
      expect(regEscape(str)).toEqual(`${str.slice(0, 1)}\\${str.slice(1)}`);
    });
  });
});

describe('loosePropCheck test', () => {
  it('extract short hex from cssValue', () => {
    const cssValue = `border-top: 1px solid #fff`;
    expect(extractColorFromValue(cssValue)).toEqual('#fff');
  });

  it('extract  hex from cssValue', () => {
    const cssValue = `border-top: 1px solid #ffffff`;
    expect(extractColorFromValue(cssValue)).toEqual('#ffffff');
  });

  it('extract rgb from cssValue', () => {
    const cssValue = `border-top: 1px solid rgb(0, 0, 0)`;
    expect(extractColorFromValue(cssValue)).toEqual('rgb(0, 0, 0)');
  });

  it('extract rgba from cssValue', () => {
    const cssValue = `border-top: 1px solid rgba(0, 0, 0, 1)`;
    expect(extractColorFromValue(cssValue)).toEqual('rgba(0, 0, 0, 1)');
  });

  it('extract hsl from cssValue', () => {
    const cssValue = `border-top: 1px solid hsl(0, 100%, 100%)`;
    expect(extractColorFromValue(cssValue)).toEqual('hsl(0, 100%, 100%)');
  });

  it('extract hsla from cssValue', () => {
    const cssValue = `border-top: 1px solid hsla(0, 100%, 100%, 1)`;
    expect(extractColorFromValue(cssValue)).toEqual('hsla(0, 100%, 100%, 1)');
  });

  it('the color should be passed', () => {
    const cssValue = `border-top: 1px solid #fff`;
    expect(checkColorLuminance(cssValue, [1, 1])).toEqual(true);
  });

  it('prop "border" should passed width ["border"]', () => {
    expect(loosePropCheck('border', ['border'])).toEqual(true);
  });

  it('prop "border-top" should passed width ["border"]', () => {
    expect(loosePropCheck('border-top', ['border'])).toEqual(true);
  });

  it('prop "border-top" should  passed width ["border-top"]', () => {
    expect(loosePropCheck('border-top', ['border-top'])).toEqual(true);
  });

  it('prop "border-top" should not  passed width ["border-top-color"]', () => {
    expect(loosePropCheck('border-top', ['border-top-color'])).toEqual(false);
  });

  it('prop "border-top" should  passed width ["border-bottom"]', () => {
    expect(loosePropCheck('border-top', ['border-bottom'])).toEqual(false);
  });

  it('prop "border-top-color" should not passed with ["border-top-width"]', () => {
    expect(loosePropCheck('border-top-color', ['border-top-width'])).toEqual(false);
  });

  it('prop "border-top-color" should not passed with ["border-bottom-color"]', () => {
    expect(loosePropCheck('border-top-color', ['border-bottom-color'])).toEqual(false);
  });

  it('prop "background" should  passed with ["background"]', () => {
    expect(loosePropCheck('background', ['background'])).toEqual(true);
  });

  it('prop "background" should not  passed with ["background-color"]', () => {
    expect(loosePropCheck('background', ['background-color'])).toEqual(false);
  });

  it('prop "background-image" should not  passed with ["background-color"]', () => {
    expect(loosePropCheck('background-image', ['background-color'])).toEqual(false);
  });

  it('prop "background-image" should not  passed with ["background"]', () => {
    expect(loosePropCheck('background-image', ['background'])).toEqual(true);
  });
});

describe('removeCssPrefix test', () => {
  const prefixs = ['-webkit-', '-moz-', '-ms-', '-o-'];
  it('remove normal prefix', () => {
    const props = ['background-clip', 'box-shadow', 'background-image'];

    props.forEach(prop => {
      prefixs.forEach(prefix => {
        expect(removeCssPrefix(`${prefix}${prop}`)).toEqual(prop);
      });
    });
  });
});
