import React from 'react';
import { AnimationState } from '../state/animationSlice';

interface CodePanelProps {
  state: AnimationState;
}

// 为每个算法步骤预定义代码片段
const DP_CODE_STEPS = [
  {
    title: "问题定义",
    code: `/**
 * 爬楼梯问题：假设你正在爬楼梯，需要n阶才能到达楼顶。
 * 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶？
 * @param {number} n - 楼梯的阶数
 * @return {number} - 爬到楼顶的方法数
 */`
  },
  {
    title: "动态规划思路",
    code: `// 动态规划解法
// 1. 定义状态：dp[i] 表示爬到第i阶的方法数
// 2. 状态转移方程：dp[i] = dp[i-1] + dp[i-2]
// 3. 初始条件：dp[0] = 1, dp[1] = 1
// 4. 计算顺序：从小到大推导`
  },
  {
    title: "基本情况处理",
    code: `function climbStairs(n: number): number {
  // 处理边界情况
  if (n <= 0) return 0;
  if (n === 1) return 1;`
  },
  {
    title: "初始化",
    code: `  // 初始化DP数组
  const dp: number[] = new Array(n + 1).fill(0);
  dp[0] = 1; // 不爬楼梯，只有1种方法
  dp[1] = 1; // 爬1阶楼梯，只有1种方法（一次爬1阶）`
  },
  {
    title: "状态转移",
    code: `  // 状态转移
  for (let i = 2; i <= n; i++) {
    // 爬到第i阶的方法 = 从第i-1阶爬1阶的方法数 + 从第i-2阶爬2阶的方法数
    dp[i] = dp[i-1] + dp[i-2];
  }`
  },
  {
    title: "返回结果",
    code: `  // 返回爬到第n阶的方法数
  return dp[n];
}`
  },
  {
    title: "空间优化",
    code: `// 空间优化版本 O(1)空间复杂度
function climbStairsOptimized(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  
  let p = 1; // dp[0]
  let q = 1; // dp[1]
  let r = 0; // dp[i]
  
  // 滚动数组计算
  for (let i = 2; i <= n; i++) {
    r = p + q; // dp[i] = dp[i-2] + dp[i-1]
    p = q;     // dp[i-2] = dp[i-1]
    q = r;     // dp[i-1] = dp[i]
  }
  
  return r;
}`
  }
];

const MATRIX_CODE_STEPS = [
  {
    title: "矩阵快速幂解法",
    code: `/**
 * 矩阵快速幂解法爬楼梯问题
 * 利用斐波那契数列的性质，用矩阵乘法优化
 */`
  },
  // ... 可以根据需要添加更多矩阵算法的代码步骤
];

const FORMULA_CODE_STEPS = [
  {
    title: "数学公式解法",
    code: `/**
 * 通项公式解法爬楼梯问题
 * 利用斐波那契数列的通项公式直接计算结果
 */`
  },
  // ... 可以根据需要添加更多公式算法的代码步骤
];

const CodePanel: React.FC<CodePanelProps> = ({ state }) => {
  // 根据当前算法和步骤选择代码
  const getCodeByStep = () => {
    const { currentAlgorithm, currentStep } = state;
    let codeSteps;

    switch (currentAlgorithm) {
      case 'dp':
        codeSteps = DP_CODE_STEPS;
        break;
      case 'matrix':
        codeSteps = MATRIX_CODE_STEPS;
        break;
      case 'formula':
        codeSteps = FORMULA_CODE_STEPS;
        break;
      default:
        codeSteps = DP_CODE_STEPS;
    }
    
    // 计算当前应该显示哪个代码段
    let stepIndex = 0;
    const totalSteps = state.timeline.length;
    
    if (totalSteps > 0) {
      // 将当前步骤映射到代码步骤
      const stepRatio = currentStep / totalSteps;
      stepIndex = Math.min(Math.floor(stepRatio * codeSteps.length), codeSteps.length - 1);
    }
    
    return codeSteps[stepIndex];
  };
  
  const codeData = getCodeByStep();
  const description = state.timeline[state.currentStep]?.description || "";
  
  // 判断当前描述是否与代码相关
  const isCodeRelevant = description.toLowerCase().includes('初始化') || 
                          description.toLowerCase().includes('计算') ||
                          description.toLowerCase().includes('状态转移');
  
  return (
    <div className="code-panel" style={{ 
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '15px',
      backgroundColor: '#f5f5f5',
      height: '100%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
        {codeData.title}
      </div>
      
      <pre style={{ 
        backgroundColor: '#282c34', 
        color: '#abb2bf',
        padding: '10px',
        borderRadius: '4px',
        overflow: 'auto',
        flex: 1,
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <code>
          {codeData.code}
        </code>
      </pre>
      
      {isCodeRelevant && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '4px',
          borderLeft: '4px solid #2196f3'
        }}>
          <strong>当前步骤：</strong> {description}
        </div>
      )}
    </div>
  );
};

export default CodePanel; 