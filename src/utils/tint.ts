import * as Color from 'color';

/**
 * less tint 函数
 * @param {string} color
 * @param {number} weight
 */
export const tint = (color: string, weight: number = 0): string => {
  const baseColor = Color('#ffffff');

  return baseColor
    .mix(Color(color), 1 - weight)
    .hex()
    .toLowerCase();
};

export default tint;
