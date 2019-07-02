import * as webpack from 'webpack';
import hash from './hash';
import { getAntdSerials } from './utils';
import getCssCode from './utils/getCssCode';
import * as adapters from './adapter';
import Extractor from './Extractor';
import config from './config';
export { clientCompiler as AntdColorReplacerClient } from './client'


export interface AntdColorReplacerOptions {
  antd?: boolean;
  primaryColor?: string;
  colors?: string[];
  filename?: string;
  hash?: boolean;
  selectorAdapter?: adapters.AntdColorReplacerAdapter;
}

export interface AntdColorReplacerMeta {
  filename: string;
  antd: boolean;
  colors: string[];
  primaryColor: string;
}

const defaultOptions: AntdColorReplacerOptions = {
  filename: config.cssFilename,
  antd: true,
  primaryColor: config.primaryColor,
  colors: [],
  // selectorAdapter: adapters.antdSelectorAdapter,
};

class AntdColorReplacer {
  private options: AntdColorReplacerOptions;

  constructor(options = defaultOptions) {
    if (options !== undefined && typeof options !== 'object') {
      throw new TypeError('AntdColorReplacer required a object params');
    }

    let colors = options.colors;

    options.primaryColor = options.primaryColor || defaultOptions.primaryColor;

    if (!('antd' in options) || options.antd) {
      colors = getAntdSerials(options.primaryColor);

      if (!options.selectorAdapter) {
        options.selectorAdapter = adapters.antdSelectorAdapter;
      }
    }

    if (!options.filename) {
      options.filename = defaultOptions.filename;
    }

    this.options = Object.assign({}, options, {
      colors,
    });
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tapAsync('AntdColorReplacer', (compilation, callback) => {
      const tasks: Promise<string>[] = [];
      const parser = /\.(?:js|css)$/;
      const options = this.options;

      compilation.chunks.forEach(chunk => {
        chunk.files.forEach(filename => {
          if (parser.test(filename)) {
            tasks.push(Extractor(this.getAssets(filename, compilation), options));
          }
        });
      });

      Promise.all(tasks).then(assets => {
        this.handleAssets(compilation, assets.join(''));
        callback();
      }).catch(err => {
        console.log(err)
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

    const publicPath = webpackOptions.output.publicPath || '/';

    const meta: AntdColorReplacerMeta = {
      filename: publicPath + assetsFilename,

      antd: options.antd!,
      colors: options.colors!,
      primaryColor: options.primaryColor!,
    };

    const meatFilename = config.metaFilename;
    const content = JSON.stringify(meta);

    compilation.assets[meatFilename] = {
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
