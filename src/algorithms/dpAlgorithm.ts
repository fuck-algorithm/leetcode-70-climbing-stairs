import { AnimationTimeline } from '../state/animationSlice';

/**
 * 使用动态规划算法生成爬楼梯问题的解和动画时间线
 * @param n 楼梯的阶数
 * @returns 包含结果和动画时间线的对象
 */
export function generateDPSolution(n: number): {
  result: number;
  timeline: AnimationTimeline[];
} {
  // 处理边界情况
  if (n <= 0) {
    return {
      result: 0,
      timeline: [{
        timestamp: 0,
        description: "输入的阶数小于等于0，没有有效的爬楼梯方法",
        visualChanges: {
          nodeUpdates: [
            { index: 0, props: { x: 50, y: 300, value: 0 } }
          ],
          matrixUpdates: [],
          formulaUpdate: "n <= 0，返回0"
        },
        interactionPoints: []
      }]
    };
  }
  
  if (n === 1) {
    return {
      result: 1,
      timeline: [{
        timestamp: 0,
        description: "只有1阶楼梯，只有1种爬法",
        visualChanges: {
          nodeUpdates: [
            { index: 0, props: { x: 50, y: 300, value: 1 } },
            { index: 1, props: { x: 150, y: 260, value: 1 } }
          ],
          matrixUpdates: [],
          formulaUpdate: "n = 1，返回1"
        },
        interactionPoints: []
      }]
    };
  }
  
  // 初始化DP数组
  const dp: number[] = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;
  
  // 初始化时间线
  const timeline: AnimationTimeline[] = [];
  
  // 初始化阶段的时间线
  timeline.push({
    timestamp: 0,
    description: "初始化阶段，第 0 阶和第 1 阶各有 1 种爬法",
    visualChanges: {
      nodeUpdates: [
        { index: 0, props: { x: 50, y: 300, value: 1 } },
        { index: 1, props: { x: 150, y: 300, value: 1 } }
      ],
      matrixUpdates: [],
      formulaUpdate: "f(0)=1, f(1)=1"
    },
    interactionPoints: []
  });
  
  // 状态转移阶段
  for (let i = 2; i <= n; i++) {
    // 计算当前阶的值
    dp[i] = dp[i - 1] + dp[i - 2];
    
    // 添加到时间线
    timeline.push({
      timestamp: i * 1000, // 时间戳按步骤递增
      description: `计算第 ${i} 阶的爬法数量`,
      visualChanges: {
        nodeUpdates: [
          { 
            index: i, 
            props: { 
              x: 50 + i * 100, 
              y: 300 - Math.min(i * 50, 200), 
              value: dp[i] 
            } 
          }
        ],
        matrixUpdates: [],
        formulaUpdate: `f(${i})=f(${i-1})+f(${i-2})=${dp[i-1]}+${dp[i-2]}=${dp[i]}`
      },
      interactionPoints: []
    });
  }
  
  // 滚动数组优化阶段
  timeline.push({
    timestamp: (n + 1) * 1000,
    description: "通过滚动数组，我们将空间复杂度从 O(n) 优化到 O(1)",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: "空间优化：只需保存前两个状态，p=f(n-2), q=f(n-1), r=p+q"
    },
    interactionPoints: []
  });
  
  return {
    result: dp[n],
    timeline
  };
}

/**
 * 使用滚动数组优化的动态规划算法计算爬楼梯问题
 * @param n 楼梯的阶数
 * @returns 到达第n阶的方法数
 */
export function climbStairsDP(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  
  let p = 1; // f(0)
  let q = 1; // f(1)
  let r = 0;
  
  for (let i = 2; i <= n; i++) {
    r = p + q;
    p = q;
    q = r;
  }
  
  return r;
} 