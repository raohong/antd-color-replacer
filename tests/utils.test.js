import { regExcape, checkColorLuminance, extractColorFromValue } from '../src/utils';

describe('Utils test', () => {
  it('get escaped str', () => {
    const list = ['.', '?', '*', '{', '}', '(', ')', '[', ']', '+', '^', '$', '\\', '/', '-'];

    const special = ['s.', 's?'];

    list.forEach(str => {
      expect(regExcape(str)).toEqual(`\\${str}`);
    });

    special.forEach(str => {
      expect(regExcape(str)).toEqual(`${str.slice(0, 1)}\\${str.slice(1)}`);
    });
  });

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
});
