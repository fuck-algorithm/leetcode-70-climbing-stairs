/**
 * 二进制分解工具函数
 */

/**
 * 将数字转换为二进制位数组
 * @param n 要转换的数字
 * @returns 二进制位数组（从高位到低位）
 */
export function toBinaryBits(n: number): number[] {
  if (n <= 0) return [0];
  
  const bits: number[] = [];
  let num = Math.floor(n);
  
  while (num > 0) {
    bits.unshift(num & 1);
    num = num >> 1;
  }
  
  return bits;
}

/**
 * 将二进制位数组转换回数字
 * @param bits 二进制位数组（从高位到低位）
 * @returns 对应的十进制数字
 */
export function fromBinaryBits(bits: number[]): number {
  return bits.reduce((acc, bit) => (acc << 1) | bit, 0);
}

/**
 * 验证二进制分解的正确性
 * @param n 原始数字
 * @param bits 二进制位数组
 * @returns 是否正确
 */
export function verifyBinaryDecomposition(n: number, bits: number[]): boolean {
  return fromBinaryBits(bits) === Math.floor(n);
}
