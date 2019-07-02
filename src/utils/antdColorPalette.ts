import { generate } from '@ant-design/colors';
import tint from './tint';

/**
 *
 * @param {string} primaryColor 主色
 * @param {number} tintModulus less tint 最小增加系数
 */
export const getAntdSerials = (primaryColor, tintModulus = 0.1): string[] => {
  const num = Math.floor(1 / tintModulus) - 1;

  const tintColors = Array.from({ length: num }, (_, i) =>
    tint(primaryColor, i * tintModulus)
  ) as string[];

  return tintColors.concat(generate(primaryColor));
};

export default getAntdSerials;
