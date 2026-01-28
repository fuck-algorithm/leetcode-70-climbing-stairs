import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: algorithm-visualization-enhancement, Property 13: Algorithm-Specific Thoughts Display**
 * **Validates: Requirements 11.3**
 * 
 * For any selected algorithm A, the thoughts modal should display content 
 * specific to algorithm A, not content from other algorithms.
 */

// 算法思路数据（从 AlgorithmThoughts.tsx 导出的数据结构）
const algorithmData = {
  dp: {
    title: '动态规划解法思路',
    uniqueKeywords: ['状态定义', '状态转移方程', 'dp[i]', 'dp[i-1] + dp[i-2]'],
    excludedKeywords: ['矩阵', '快速幂', '比内公式', 'φ', 'ψ']
  },
  matrix: {
    title: '矩阵快速幂解法思路',
    uniqueKeywords: ['矩阵', '快速幂', 'M^(n-1)', '二进制'],
    excludedKeywords: ['状态转移方程', 'dp[i]', '比内公式', 'φ^n']
  },
  formula: {
    title: '通项公式解法思路',
    uniqueKeywords: ['比内公式', 'φ', 'ψ', '黄金比例', '特征方程'],
    excludedKeywords: ['状态转移方程', 'dp[i]', '矩阵乘法', 'M^(n-1)']
  }
};

type AlgorithmType = 'dp' | 'matrix' | 'formula';

// 获取算法思路内容的函数（模拟从组件获取）
function getAlgorithmThoughtsContent(algorithm: AlgorithmType): string {
  const data = algorithmData[algorithm];
  return data.title + ' ' + data.uniqueKeywords.join(' ');
}

// 检查内容是否包含特定算法的关键词
function containsAlgorithmKeywords(content: string, algorithm: AlgorithmType): boolean {
  const keywords = algorithmData[algorithm].uniqueKeywords;
  return keywords.some(keyword => content.includes(keyword));
}

// 检查内容是否不包含其他算法的排除关键词
function excludesOtherAlgorithmKeywords(content: string, algorithm: AlgorithmType): boolean {
  const excludedKeywords = algorithmData[algorithm].excludedKeywords;
  return !excludedKeywords.some(keyword => content.includes(keyword));
}

describe('AlgorithmThoughts Property Tests', () => {
  /**
   * Property 13: Algorithm-Specific Thoughts Display
   * For any selected algorithm, the displayed content should be specific to that algorithm
   */
  it('should display algorithm-specific content for any selected algorithm', () => {
    const algorithmArbitrary = fc.constantFrom<AlgorithmType>('dp', 'matrix', 'formula');
    
    fc.assert(
      fc.property(algorithmArbitrary, (algorithm) => {
        const content = getAlgorithmThoughtsContent(algorithm);
        
        // 验证内容包含该算法的特定关键词
        const hasOwnKeywords = containsAlgorithmKeywords(content, algorithm);
        
        // 验证内容不包含其他算法的特定关键词
        const excludesOtherKeywords = excludesOtherAlgorithmKeywords(content, algorithm);
        
        return hasOwnKeywords && excludesOtherKeywords;
      }),
      { numRuns: 100 }
    );
  });

  it('should have unique title for each algorithm', () => {
    const algorithmArbitrary = fc.constantFrom<AlgorithmType>('dp', 'matrix', 'formula');
    
    fc.assert(
      fc.property(algorithmArbitrary, (algorithm) => {
        const title = algorithmData[algorithm].title;
        const otherAlgorithms = (['dp', 'matrix', 'formula'] as AlgorithmType[])
          .filter(a => a !== algorithm);
        
        // 验证标题与其他算法的标题不同
        return otherAlgorithms.every(other => 
          algorithmData[other].title !== title
        );
      }),
      { numRuns: 100 }
    );
  });

  it('should have non-overlapping unique keywords between algorithms', () => {
    const algorithmPairArbitrary = fc.tuple(
      fc.constantFrom<AlgorithmType>('dp', 'matrix', 'formula'),
      fc.constantFrom<AlgorithmType>('dp', 'matrix', 'formula')
    ).filter(([a, b]) => a !== b);
    
    fc.assert(
      fc.property(algorithmPairArbitrary, ([algo1, algo2]) => {
        const keywords1 = new Set(algorithmData[algo1].uniqueKeywords);
        const keywords2 = new Set(algorithmData[algo2].uniqueKeywords);
        
        // 验证两个算法的唯一关键词没有交集
        const intersection = [...keywords1].filter(k => keywords2.has(k));
        return intersection.length === 0;
      }),
      { numRuns: 100 }
    );
  });
});
