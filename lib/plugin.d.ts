import * as webpack from 'webpack';
import * as adapters from './adapter';
export interface AntdColorReplacerOptions {
  antd?: boolean;
  primaryColor?: string;
  colors?: string[];
  filename?: string;
  hash?: boolean;
  loose?: boolean;
  looseProps?: string[];
  luminance?: [number, number];
  selectorAdapter?: adapters.AntdColorReplacerAdapter;
}
export interface AntdColorReplacerMeta {
  filename: string;
  antd: boolean;
  colors: string[];
  primaryColor: string;
  isDev: boolean;
}
/**
 * 获取配置信息
 * @param options
 */
export declare const getOptions: (options: AntdColorReplacerOptions) => AntdColorReplacerOptions;
declare class AntdColorReplacer {
  private options;
  constructor(options?: AntdColorReplacerOptions);
  apply(compiler: webpack.Compiler): void;
  getAssets(filename: string, compilation: any): any;
  handleAssets(compilation: any, assets: any): void;
  generateThemeMeta(compilation: any, assetsFilename: any): void;
}
export default AntdColorReplacer;
