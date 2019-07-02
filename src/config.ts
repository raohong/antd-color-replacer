export interface AntdColorReplacerConfig {
  // 默认主色
  primaryColor: string;
  // 默认 css  文件名称
  cssFilename: string;
  // 默认 配置资源 json 名称
  metaFilename: string;
}


export default {
  primaryColor: '#1890ff',
  cssFilename: 'css/theme-color.css',
  metaFilename: '/js/theme-color-meta.json',
} as AntdColorReplacerConfig;
