/**
 * 代码行映射模块
 * 用于将算法步骤与代码行进行关联
 */

export type Language = 'java' | 'python' | 'golang' | 'javascript';
export type AlgorithmType = 'dp' | 'matrix' | 'formula';

export interface CodeLineMapping {
  stepIndex: number;
  lineNumbers: Record<Language, number[]>;
  variables?: {
    name: string;
    value: string | number;
    line: Record<Language, number>;
  }[];
}

/**
 * DP 算法的代码行映射
 * 根据步骤索引返回对应的代码行
 */
export function getDPCodeLineMapping(stepIndex: number, n: number): CodeLineMapping {
  // 基础步骤映射
  const baseMapping: Record<number, Record<Language, number[]>> = {
    0: { // 问题介绍
      java: [1, 2],
      python: [1, 2],
      golang: [1],
      javascript: [1],
    },
    1: { // 状态转移方程解释
      java: [2],
      python: [2],
      golang: [1],
      javascript: [1],
    },
    2: { // 状态转移方程详解
      java: [2],
      python: [2],
      golang: [1],
      javascript: [1],
    },
    3: { // 初始化 dp[0]=1, dp[1]=1
      java: [5, 6, 7],
      python: [6, 7, 8],
      golang: [5, 6, 7],
      javascript: [5, 6, 7],
    },
  };

  // 如果是基础步骤，直接返回
  if (stepIndex < 4) {
    return {
      stepIndex,
      lineNumbers: baseMapping[stepIndex] || { java: [], python: [], golang: [], javascript: [] },
    };
  }

  // 计算循环步骤
  // 步骤 4 开始是循环，每个 i 有两个步骤（准备计算和计算完成）
  const loopStepOffset = stepIndex - 4;
  const i = Math.floor(loopStepOffset / 2) + 2; // 从 i=2 开始
  const isPreparingStep = loopStepOffset % 2 === 0;

  if (i <= n) {
    if (isPreparingStep) {
      // 准备计算步骤 - 高亮 for 循环行
      return {
        stepIndex,
        lineNumbers: {
          java: [9],
          python: [10],
          golang: [9],
          javascript: [9],
        },
        variables: [
          { name: 'i', value: i, line: { java: 9, python: 10, golang: 9, javascript: 9 } },
        ],
      };
    } else {
      // 计算完成步骤 - 高亮赋值行
      return {
        stepIndex,
        lineNumbers: {
          java: [10],
          python: [11],
          golang: [10],
          javascript: [10],
        },
        variables: [
          { name: 'i', value: i, line: { java: 9, python: 10, golang: 9, javascript: 9 } },
          { name: `dp[${i}]`, value: `dp[${i-1}] + dp[${i-2}]`, line: { java: 10, python: 11, golang: 10, javascript: 10 } },
        ],
      };
    }
  }

  // 结果和优化步骤
  const resultStepStart = 4 + (n - 1) * 2;
  const resultStepIndex = stepIndex - resultStepStart;

  const resultMappings: Record<number, Record<Language, number[]>> = {
    0: { // 返回结果
      java: [13],
      python: [13],
      golang: [13],
      javascript: [13],
    },
    1: { // 空间优化解释
      java: [1, 2, 3],
      python: [1, 2, 3],
      golang: [1, 2, 3],
      javascript: [1, 2, 3],
    },
    2: { // 滚动数组
      java: [1, 2, 3, 4, 5, 6, 7, 8],
      python: [1, 2, 3, 4, 5, 6, 7, 8],
      golang: [1, 2, 3, 4, 5, 6, 7, 8],
      javascript: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    3: { // 复杂度分析
      java: [],
      python: [],
      golang: [],
      javascript: [],
    },
  };

  return {
    stepIndex,
    lineNumbers: resultMappings[resultStepIndex] || { java: [], python: [], golang: [], javascript: [] },
  };
}

/**
 * 矩阵快速幂算法的代码行映射
 */
export function getMatrixCodeLineMapping(stepIndex: number): CodeLineMapping {
  // 简化的映射，实际应用中需要更详细的映射
  return {
    stepIndex,
    lineNumbers: {
      java: [stepIndex + 1],
      python: [stepIndex + 1],
      golang: [stepIndex + 1],
      javascript: [stepIndex + 1],
    },
  };
}

/**
 * 通项公式算法的代码行映射
 */
export function getFormulaCodeLineMapping(stepIndex: number): CodeLineMapping {
  // 简化的映射
  return {
    stepIndex,
    lineNumbers: {
      java: [stepIndex + 1],
      python: [stepIndex + 1],
      golang: [stepIndex + 1],
      javascript: [stepIndex + 1],
    },
  };
}

/**
 * 获取指定算法和步骤的代码行映射
 */
export function getCodeLineMapping(
  algorithm: AlgorithmType,
  stepIndex: number,
  n: number = 6
): CodeLineMapping {
  switch (algorithm) {
    case 'dp':
      return getDPCodeLineMapping(stepIndex, n);
    case 'matrix':
      return getMatrixCodeLineMapping(stepIndex);
    case 'formula':
      return getFormulaCodeLineMapping(stepIndex);
    default:
      return {
        stepIndex,
        lineNumbers: { java: [], python: [], golang: [], javascript: [] },
      };
  }
}
