import { AnimationTimeline } from '../state/animationSlice';

/**
 * 使用矩阵快速幂算法生成爬楼梯问题的解和动画时间线
 * @param n 楼梯的阶数
 * @returns 包含结果和动画时间线的对象
 */
export function generateMatrixSolution(n: number): {
  result: number;
  timeline: AnimationTimeline[];
} {
  let stepCounter = 0; // 初始化步骤计数器
  const timeline: AnimationTimeline[] = [];

  // 处理边界情况
  if (n <= 0) {
    timeline.push({
      timestamp: stepCounter++ * 1000, // 动态分配时间戳
      description: "输入的阶数小于等于0，没有有效的爬楼梯方法",
      visualChanges: {
        nodeUpdates: [],
        matrixUpdates: [{ row: 0, col: 0, value: 0 }],
        formulaUpdate: "n <= 0，返回0"
      },
      interactionPoints: []
    });
    return { result: 0, timeline };
  }

  if (n === 1) {
    timeline.push({
      timestamp: stepCounter++ * 1000, // 动态分配时间戳
      description: "只有1阶楼梯，只有1种爬法",
      visualChanges: {
        nodeUpdates: [],
        matrixUpdates: [{ row: 0, col: 0, value: 1 }],
        formulaUpdate: "n = 1，返回1"
      },
      interactionPoints: []
    });
    return { result: 1, timeline };
  }
  
  // 构造初始矩阵阶段
  const baseMatrix = [[1, 1], [1, 0]];
  timeline.push({
    timestamp: stepCounter++ * 1000, // 动态分配时间戳
    description: "构造基础矩阵 [[1,1],[1,0]]",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [
        { row: 0, col: 0, value: 1 },
        { row: 0, col: 1, value: 1 },
        { row: 1, col: 0, value: 1 },
        { row: 1, col: 1, value: 0 }
      ],
      formulaUpdate: "基础矩阵 M = [[1,1],[1,0]]"
    },
    interactionPoints: []
  });
  
  // 计算矩阵的n-1次幂并记录时间线
  const { result, matrixTimeline } = matrixPow(baseMatrix, n - 1);
  
  // 合并矩阵计算的时间线
  matrixTimeline.forEach(matrixStep => {
    timeline.push({
      timestamp: stepCounter++ * 1000, // 动态分配时间戳
      description: matrixStep.description,
      visualChanges: {
        nodeUpdates: [],
        matrixUpdates: matrixStep.updates,
        formulaUpdate: matrixStep.formula
      },
      interactionPoints: []
    });
  });
  
  // 最终结果提取阶段
  timeline.push({
    timestamp: stepCounter++ * 1000, // 动态分配时间戳
    description: "从矩阵结果中提取爬楼梯问题的解",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: `最终结果 M^(${n-1})[0][0] = ${result[0][0]}`
    },
    interactionPoints: []
  });
  
  return {
    result: result[0][0],
    timeline
  };
}

/**
 * 计算矩阵的n次幂，并记录计算过程
 * @param matrix 初始矩阵
 * @param n 幂次
 * @returns 结果矩阵和计算过程的时间线
 */
function matrixPow(matrix: number[][], n: number): {
  result: number[][];
  matrixTimeline: Array<{
    description: string;
    updates: Array<{ row: number; col: number; value: number }>;
    formula: string;
  }>;
} {
  // 初始化时间线
  const matrixTimeline: Array<{
    description: string;
    updates: Array<{ row: number; col: number; value: number }>;
    formula: string;
  }> = [];
  
  // 处理特殊情况
  if (n === 0) {
    return {
      result: [[1, 0], [0, 1]], // 单位矩阵
      matrixTimeline: [{
        description: "矩阵的0次幂是单位矩阵",
        updates: [
          { row: 0, col: 0, value: 1 },
          { row: 0, col: 1, value: 0 },
          { row: 1, col: 0, value: 0 },
          { row: 1, col: 1, value: 1 }
        ],
        formula: "M^0 = I (单位矩阵)"
      }]
    };
  }
  
  if (n === 1) {
    return {
      result: matrix,
      matrixTimeline: [{
        description: "矩阵的1次幂是矩阵本身",
        updates: [
          { row: 0, col: 0, value: matrix[0][0] },
          { row: 0, col: 1, value: matrix[0][1] },
          { row: 1, col: 0, value: matrix[1][0] },
          { row: 1, col: 1, value: matrix[1][1] }
        ],
        formula: "M^1 = M"
      }]
    };
  }
  
  // 使用快速幂算法计算
  if (n % 2 === 0) {
    // 如果n是偶数，计算(matrix^(n/2))^2
    const halfPow = matrixPow(matrix, n / 2);
    const result = multiplyMatrix(halfPow.result, halfPow.result);
    
    matrixTimeline.push(...halfPow.matrixTimeline);
    matrixTimeline.push({
      description: `计算 M^${n} = (M^${n/2})^2`,
      updates: [
        { row: 0, col: 0, value: result[0][0] },
        { row: 0, col: 1, value: result[0][1] },
        { row: 1, col: 0, value: result[1][0] },
        { row: 1, col: 1, value: result[1][1] }
      ],
      formula: `M^${n} = (M^${n/2})^2`
    });
    
    return { result, matrixTimeline };
  } else {
    // 如果n是奇数，计算(matrix^((n-1)/2))^2 * matrix
    const halfPow = matrixPow(matrix, (n - 1) / 2);
    const temp = multiplyMatrix(halfPow.result, halfPow.result);
    const result = multiplyMatrix(temp, matrix);
    
    matrixTimeline.push(...halfPow.matrixTimeline);
    matrixTimeline.push({
      description: `计算 M^${n} = (M^${(n-1)/2})^2 * M`,
      updates: [
        { row: 0, col: 0, value: result[0][0] },
        { row: 0, col: 1, value: result[0][1] },
        { row: 1, col: 0, value: result[1][0] },
        { row: 1, col: 1, value: result[1][1] }
      ],
      formula: `M^${n} = (M^${(n-1)/2})^2 * M`
    });
    
    return { result, matrixTimeline };
  }
}

/**
 * 矩阵乘法
 * @param a 矩阵a
 * @param b 矩阵b
 * @returns 乘积矩阵
 */
function multiplyMatrix(a: number[][], b: number[][]): number[][] {
  const result = Array(a.length).fill(0).map(() => Array(b[0].length).fill(0));
  
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b[0].length; j++) {
      for (let k = 0; k < a[0].length; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  
  return result;
}

/**
 * 使用矩阵快速幂算法计算爬楼梯问题
 * @param n 楼梯的阶数
 * @returns 到达第n阶的方法数
 */
export function climbStairsMatrix(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  
  const baseMatrix = [[1, 1], [1, 0]];
  const resultMatrix = matrixPow(baseMatrix, n - 1).result;
  
  return resultMatrix[0][0];
} 