# 一个 webpack 主题切换器

[![Build Status](https://travis-ci.org/raohong/antd-color-replacer.svg?branch=master)](https://travis-ci.org/raohong/antd-color-replacer)

## 食用方法

[ant pro demo](https://raohong.github.io/antd-color-replacer-example-antpro/dist/#/formbasicform)

1. `npm i antd-color-replacer`

2) 如果你使用 `ant-pro`

   1. 在 config/plugin 文件

   ```js
   import AntdColorReplacer from 'antd-color-replacer';
   import defaultSettings from '../src/defaultSettings';

   config.plugin('antd-color-replacer').use(AntdColorReplacer, [
     {
       primaryColor: defaultSettings.primaryColor,
     },
   ]);
   ```

   替换原来引入的插件

   2.

   ```js
   import AntdColorReplacerClient from 'AntdColorReplacerClient/lib/client';
   ```

3. 其它

```js
import AntdColorReplacer from 'antd-color-replacer';

const webpackConfig = {
  plugins: [
    new AntdColorReplacer({
      primaryColor: primaryColor,
    }),
  ],
};

import AntdColorReplacerClient from 'AntdColorReplacerClient/lib/client';

AntdColorReplacerClient.compile(newPrimaryColor);
```

## 配置项

1. AntdColorReplacer

```ts
class AntdColorReplacer {
  constructor(options?: AntdColorReplacerOptions);
}

interface AntdColorReplacerOptions {
  // 是否是 antd 使用 默认 true , 此时 colors 已经生成
  antd?: boolean;
  // 主色
  primaryColor?: string;
  // 要替换的颜色数组
  colors?: string[];
  // 生成的 css 名称 默认是 css/theme-color.css
  filename?: string;
  // production 环境时 filename  是否生成 hash 默认是 即 css/theme-color.[hash].css
  hash?: boolean;
  // 是否开启宽松模式 即 不在符合主题颜色的情况下 颜色亮度值 在 luminance 设定的范围内 即可保留
  readonly loose: boolean;
  // 目标 css prop  default ['border', 'color', 'background', 'outline', 'box-shadow']
  looseProps: string[];
  // 参照 https://github.com/misund/get-relative-luminance
  luminance: [number, number];
  // css 选择适配器 参照 antd-color-replacer/src/adapter.antdSelectorAdapter]
  selectorAdapter?: AntdColorReplacerAdapter;
}

/**
 * 自定义 css node 节点处理器
 * 参考 postcss api
 * Tips: 如果要增加新的节点 请添加在当前节点前面
 */
type AntdColorReplacerAdapterCustomHandle = (node: postcss.Rule, postCss: typeof postcss) => void;

type IAdapterResult = string | false | AntdColorReplacerAdapterCustomHandle | void;

type AntdColorReplacerAdapter = (selector: string) => IAdapterResult;
```

2. AntdColorReplacerClient.compile:

```ts

AntdColorReplacerClient.compile:  (options?: string | AntdColorReplacerClientOptions) => Promise<void>;

type IMeatFilenameCustomHandle = (metaFilename: string) => string;

interface AntdColorReplacerClientOptions {
  // 保存编译时的数据 json 文件路径
  metaFilename?: string | IMeatFilenameCustomHandle;
  // 主色
  primaryColor?: string;
  // 颜色数组
  colors?: string[];
  // 是否是 antd
  antd?: boolean;
}


```
