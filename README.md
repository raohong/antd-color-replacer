# 一个 webpack 主题切换器

## 食用方法

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
   import { AntdColorReplacerClient } from '../lib';
   AntdColorReplacerClient.compile(nePrimaryColor);
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

import { AntdColorReplacerClient } from '.lib';

AntdColorReplacerClient.compile(nePrimaryColor);
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
  // css 选择适配器 参照 antd-color-replacer/src/adapter.antdSelectorAdapter]
  selectorAdapter?: AntdColorReplacerAdapter;
}

interface AntdColorReplacerAdapterCustomHandle {
  (node: postcss.Rule, postCss: typeof postcss): void;
}

type IAdapterResult = string | false | AntdColorReplacerAdapterCustomHandle | void;

interface AntdColorReplacerAdapter {
  (selector: string): IAdapterResult;
}
```

2. AntdColorReplacerClient.compile:

```ts

AntdColorReplacerClient.compile:  (options?: string | AntdColorReplacerClientOptions) => Promise<void>;

interface IMeatFilenameCustomHandle {
  (metaFilename: string): string;
}
interface AntdColorReplacerClientOptions {
  metaFilename?: string | IMeatFilenameCustomHandle;
  primaryColor?: string;
  colors?: string[];
  antd?: boolean;
}


```
