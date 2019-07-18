import * as webpack from 'webpack';
import hash from './hash';
import { getAntdSerials } from './utils';
import getCssCode from './utils/getCssCode';
import * as adapters from './adapter';
import Extractor from './Extractor';
import config from './config';

export interface AntdColorReplacerOptions {
  antd?: boolean;
  primaryColor?: string;
  colors?: string[];
  filename?: string;
  hash?: boolean;
  // 是否是宽松模式 即: 如果含有 color border outline box-shadow 属性 且含有 #ffffff 类似亮色值 不对该声明进行处理
  // rgba 会提取 rgb
  // 此时如果包含上面属性 不会调用 selectAdapter
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

const defaultOptions: AntdColorReplacerOptions = {
  filename: config.cssFilename,
  antd: true,
  primaryColor: config.primaryColor,
  colors: [],
  loose: true,
  looseProps: config.looseProps,
  luminance: config.luminance,
  // selectorAdapter: adapters.antdSelectorAdapter,
};

/**
 * 获取配置信息
 * @param options
 */
export const getOptions = (
  options: AntdColorReplacerOptions,
  defaults: AntdColorReplacerOptions = defaultOptions
): AntdColorReplacerOptions => {
  if (options !== undefined && typeof options !== 'object') {
    throw new TypeError('AntdColorReplacer required a object options');
  }

  let colors = options.colors;

  options.primaryColor = options.primaryColor || defaultOptions.primaryColor;

  if (!('antd' in options) || options.antd) {
    colors = getAntdSerials(options.primaryColor);

    if (!options.selectorAdapter) {
      options.selectorAdapter = adapters.antdSelectorAdapter;
    }
  }

  options.loose = true;
  if ('loose' in options) {
    // options.loose = !!options.loose;

    if (!('looseProps' in options)) {
      options.looseProps = defaultOptions.looseProps;
    }

    if (!('luminance' in options)) {
      options.luminance = defaultOptions.luminance;
    }
  }

  if (!options.filename) {
    options.filename = defaultOptions.filename;
  }

  return {
    ...defaults,
    ...options,
    colors,
  };
};

class AntdColorReplacer {
  private options: AntdColorReplacerOptions;

  constructor(options: AntdColorReplacerOptions = defaultOptions) {
    this.options = getOptions(options);
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tapAsync('AntdColorReplacer', (compilation, callback) => {
      const tasks: Promise<string>[] = [];
      const parser = /\.(?:js|css)$/;
      const options = this.options;

      const extrator = new Extractor(options);

      compilation.chunks.forEach(chunk => {
        chunk.files.forEach(filename => {
          if (parser.test(filename)) {
            tasks.push(extrator.exec(this.getAssets(filename, compilation)));
          }
        });
      });

      Promise.all(tasks)
        .then(assets => {
          this.handleAssets(compilation, assets.join(''));
          callback();
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  getAssets(filename: string, compilation) {
    const assets = compilation.assets[filename].source();
    // ToDo js文件代码 获取的优化

    if (/\.js/.test(filename)) {
      return getCssCode(assets);
    }

    return assets;
  }

  handleAssets(compilation, assets) {
    const options = this.options;
    // 是否 hash 如果没有配置 生产环境采用 其它不采用
    const isHash =
      compilation.options.mode === 'production' && ('hash' in options ? options.hash : true);

    let assetsFilename = options.filename!;

    if (compilation.options.mode === 'production' && isHash) {
      const h = hash(assets);
      assetsFilename = assetsFilename.replace(/\.css/, () => `.${h.slice(0, 8)}.css`);
    }

    compilation.assets[assetsFilename] = {
      source() {
        return assets;
      },
      size() {
        return assets.length;
      },
    };

    this.generateThemeMeta(compilation, assetsFilename);
  }

  generateThemeMeta(compilation, assetsFilename) {
    const options = this.options;
    const webpackOptions = compilation.options;

    const publicPath = webpackOptions.output.publicPath || '';

    const meta: AntdColorReplacerMeta = {
      filename: publicPath + assetsFilename,
      isDev: compilation.options.mode !== 'production',
      antd: options.antd!,
      colors: options.colors!,
      primaryColor: options.primaryColor!,
    };

    const meatFilename = config.metaFilename;
    const content = JSON.stringify(meta);

    compilation.assets[meatFilename.replace(/^\//, '')] = {
      source() {
        return content;
      },
      size() {
        return content.length;
      },
    };
  }
}

export default AntdColorReplacer;
