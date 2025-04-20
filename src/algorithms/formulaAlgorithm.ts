import { AnimationTimeline } from '../state/animationSlice';

/**
 * 使用通项公式算法生成爬楼梯问题的解和动画时间线
 * @param n 楼梯的阶数
 * @returns 包含结果和动画时间线的对象
 */
export function generateFormulaSolution(n: number): {
  result: number;
  timeline: AnimationTimeline[];
} {
  // 初始化时间线
  const timeline: AnimationTimeline[] = [];
  let stepCounter = 0;
  
  // 处理边界情况
  if (n <= 0) {
    timeline.push({
      timestamp: stepCounter++ * 1000,
      description: "输入的阶数小于等于0，没有有效的爬楼梯方法",
      visualChanges: {
        nodeUpdates: [],
        matrixUpdates: [],
        formulaUpdate: "n <= 0，返回0"
      },
      interactionPoints: []
    });
    return { result: 0, timeline };
  }
  
  if (n === 1) {
    timeline.push({
      timestamp: stepCounter++ * 1000,
      description: "只有1阶楼梯，只有1种爬法",
      visualChanges: {
        nodeUpdates: [],
        matrixUpdates: [],
        formulaUpdate: "n = 1，返回1"
      },
      interactionPoints: []
    });
    return { result: 1, timeline };
  }
  
  // 特征方程推导阶段
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "特征方程推导",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: "f(n) = f(n-1) + f(n-2) 对应的特征方程：x² - x - 1 = 0"
    },
    interactionPoints: []
  });
  
  // 求解特征方程阶段
  const phi = (1 + Math.sqrt(5)) / 2;
  const psi = (1 - Math.sqrt(5)) / 2;
  
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "求解特征方程",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: `解得特征根：λ₁ = (1+√5)/2 ≈ ${phi.toFixed(3)}，λ₂ = (1-√5)/2 ≈ ${psi.toFixed(3)}`
    },
    interactionPoints: []
  });
  
  // 通项公式推导阶段
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "通项公式推导",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: "通项公式：f(n) = c₁λ₁ⁿ + c₂λ₂ⁿ = c₁((1+√5)/2)ⁿ + c₂((1-√5)/2)ⁿ"
    },
    interactionPoints: []
  });
  
  // 确定系数阶段
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "确定系数",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: "根据f(0)=1, f(1)=1，解得c₁=1/√5, c₂=-1/√5"
    },
    interactionPoints: []
  });
  
  // 最终公式阶段
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "最终公式",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: "f(n) = (1/√5)·((1+√5)/2)ⁿ - (1/√5)·((1-√5)/2)ⁿ"
    },
    interactionPoints: []
  });
  
  // 最终结果计算阶段
  const result = calculateBinetFormula(n);
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "计算结果",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: `代入n=${n}，得到结果：f(${n}) = ${result}`
    },
    interactionPoints: []
  });
  
  return {
    result,
    timeline
  };
}

/**
 * 使用比内公式（Binet's Formula）计算爬楼梯问题
 * @param n 楼梯的阶数
 * @returns 到达第n阶的方法数
 */
export function climbStairsFormula(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  
  return calculateBinetFormula(n);
}

/**
 * 计算比内公式 (Binet's Formula)
 * @param n 阶数
 * @returns 计算结果
 */
function calculateBinetFormula(n: number): number {
  const sqrt5 = Math.sqrt(5);
  const phi = (1 + sqrt5) / 2;
  const psi = (1 - sqrt5) / 2;
  
  // 使用精确计算，避免浮点数误差
  return Math.round((Math.pow(phi, n) - Math.pow(psi, n)) / sqrt5);
} 