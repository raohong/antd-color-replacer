import * as postcss from 'postcss';
import { regExcape } from './utils';
import { AntdColorReplacerAdapter } from './adapter';
import { AntdColorReplacerOptions } from './index';

type IExtractRule =
  (
    assets: string,
    selectorAdapter: AntdColorReplacerAdapter,
    checker: (str: string) => boolean
  ) => string;


type IFilterNode = (node: postcss.AtRule) => void

type IWalker = (node: postcss.ContainerBase) => void;

type IExtractor = (assets: string, options: AntdColorReplacerOptions) => Promise<string>;


const check = (code: string, colorRegs: RegExp[]): boolean => {
  return colorRegs.some(reg => reg.test(code));
};

// 替换特殊的 selector
const nodeAdapter = (node: postcss.Rule, selectorAdapter: AntdColorReplacerAdapter) => {
  // 去除换行符
  let selector = node.selector.replace(/(?:\n|\r\n?)/g, '');

  // 格式化 >
  selector = selector.replace(/\s*>\s*/g, ' > ');

  // 格式化 ,
  selector = selector.replace(/\s*,\s*/g, ', ');

  /**
   * 返回 false 删除
   * 返回 Funciton 时 自定义处理 api 参考 postcss
   * 返回 string 且不为空 替换
   * 其它跳过
   */

  const result = selectorAdapter(selector);

  if (result === false) {
    node.remove();
  } else if (typeof result === 'function') {
    result(node, postcss);
    return;
  } else if (!result) {
    return;
  }

  const newNode = node.clone({
    selector: result,
  });

  node.replaceWith(newNode);
};

const extractRule: IExtractRule = (assets, selectorAdapter, checker) => {
  try {
    const root = postcss.parse(assets);
    const isFunction = typeof selectorAdapter === 'function';

    const filterNode: IFilterNode = node => {
      let flag = false;
      node.walkDecls(decl => {
        if (!flag) {
          flag = checker(decl.value);
        }
      });

      if (!flag) {
        node.remove();
      }
    };

    const walker: IWalker = parentNode => {
      parentNode.each(node => {
        // 删除注释
        if (node.type === 'comment') {
          node.remove();
          return;
        }

        // 普通 css 规则 和 除动画申明外 去除不满足条件的生命 当为空时 删除 node
        if (node.type === 'rule' || (node.type === 'atrule' && !/keyframes/.test(node.name))) {
          node.walk(subNode => {
            switch (subNode.type) {
              case 'decl':
                if (!checker(subNode.value)) {
                  subNode.remove();
                }
                break;
              case 'comment':
                subNode.remove();
                break;
            }
          });

          /**
           * 如果是 atrule 先递归处理过滤数据 再删掉没有 child  的节点
           */
          if (node.type === 'atrule' && node.nodes) {
            node.nodes.forEach(subNode => {
              if (subNode.type === 'rule' || subNode.type === 'atrule') {
                walker(subNode);
              }
            });

            node.walk(subNode => {
              if (subNode.type === 'rule' || subNode.type === 'atrule') {
                if (!subNode.nodes || !subNode.nodes.length) {
                  subNode.remove();
                }
              }
            });
          }

          // 空规则删除
          if (node.nodes && !node.nodes.length) {
            node.remove();
            // 自定义 selector 处理
          } else if (isFunction && node.type === 'rule') {
            nodeAdapter(node, selectorAdapter);
          }

          return;
        }

        if (node.type === 'atrule') {
          filterNode(node);
        }
      });
    };

    walker(root);

    return root.toString();
  } catch (error) {
    if (error.showSourceCode) {
      error.showSourceCode();
    }

    throw error;
  }
};

export const Extactor: IExtractor = (assets, options) => {
  if (!assets) {
    return Promise.resolve('');
  }

  const { primaryColor } = options;

  const colors = options.colors!.slice();

  // 将主色排在最前面检查
  if (colors.includes(primaryColor!)) {
    colors.unshift(...colors.splice(colors.indexOf(primaryColor!), 1));
  }

  const colorRegs = colors!.map(color => new RegExp(regExcape(color), 'i'));

  const ruleChecker = value => {
    return check(value, colorRegs);
  };

  return new Promise((resolve, reject) => {
    // 预先查找
    if (!check(assets, colorRegs)) {
      resolve('');
    }

    try {
      const result = extractRule(assets, options.selectorAdapter!, ruleChecker);

      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

export default Extactor;
