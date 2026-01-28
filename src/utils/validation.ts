/**
 * 输入验证工具函数
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * 验证楼梯阶数输入
 * @param value 输入值
 * @param min 最小值（默认1）
 * @param max 最大值（默认45）
 */
export function validateStairsInput(
  value: string | number,
  min: number = 1,
  max: number = 45
): ValidationResult {
  // 空值检查
  if (value === '' || value === null || value === undefined) {
    return {
      isValid: false,
      errorMessage: '请输入楼梯阶数',
    };
  }

  // 转换为数字
  const num = typeof value === 'string' ? parseInt(value, 10) : value;

  // 非数字检查
  if (isNaN(num)) {
    return {
      isValid: false,
      errorMessage: '请输入有效数字',
    };
  }

  // 非整数检查
  if (!Number.isInteger(num)) {
    return {
      isValid: false,
      errorMessage: '请输入整数',
    };
  }

  // 范围检查
  if (num < min) {
    return {
      isValid: false,
      errorMessage: `最小值为 ${min}`,
    };
  }

  if (num > max) {
    return {
      isValid: false,
      errorMessage: `最大值为 ${max}`,
    };
  }

  return {
    isValid: true,
  };
}

/**
 * 生成指定范围内的随机整数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 */
export function generateRandomStairs(min: number = 1, max: number = 45): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
