import { AnimationTimeline } from '../state/animationSlice';

/**
 * 使用动态规划算法生成爬楼梯问题的解和动画时间线
 * @param n 楼梯的阶数
 * @returns 包含结果、时间线和可视化数据的对象
 */
export function generateDPSolution(n: number): {
  result: number;
  timeline: AnimationTimeline[];
  staircase?: {
    nodes: { id: number; x: number; y: number; value: number }[];
    links: { source: number; target: number }[];
  };
} {
  // 初始化时间线
  const timeline: AnimationTimeline[] = [];
  let stepCounter = 0; // 添加步骤计数器

  // 处理边界情况
  if (n <= 0) {
    return {
      result: 0,
      timeline: [{
        timestamp: stepCounter++ * 1000,
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
        timestamp: stepCounter++ * 1000,
        description: "只有1阶楼梯，只有1种爬法（一次爬1阶）",
        visualChanges: {
          nodeUpdates: [
            { index: 0, props: { x: 50, y: 300, value: 1 } },
            { index: 1, props: { x: 150, y: 260, value: 1 } }
          ],
          matrixUpdates: [],
          formulaUpdate: "f(1) = 1"
        },
        interactionPoints: []
      }]
    };
  }
  
  // 初始化DP数组
  const dp: number[] = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;
  
  // 引入基本概念
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "爬楼梯问题：每次可以爬1阶或2阶，问爬到第n阶有多少种方法？",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: "动态规划解法"
    },
    interactionPoints: []
  });
  
  // 解释动态规划思路
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "动态规划的关键是找到状态转移方程，我们需要思考如何到达第n阶",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: "f(n) = f(n-1) + f(n-2)"
    },
    interactionPoints: []
  });
  
  // 解释状态转移方程
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "想要到达第n阶，可以从第n-1阶爬1阶，或从第n-2阶爬2阶，所以f(n) = f(n-1) + f(n-2)",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: "f(n) = f(n-1) + f(n-2)"
    },
    interactionPoints: []
  });
  
  // 初始化阶段的时间线
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "初始化：第0阶表示起点，有1种方法（不爬）；第1阶有1种方法（爬1阶）",
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
  
  // 创建节点之间的连接关系
  const links = [];
  
  // 状态转移阶段
  for (let i = 2; i <= n; i++) {
    // 计算当前阶的值
    dp[i] = dp[i - 1] + dp[i - 2];
    
    // 添加连接
    links.push({ source: i-1, target: i });
    links.push({ source: i-2, target: i });
    
    // 添加到时间线 - 状态转移前的解释
    timeline.push({
      timestamp: stepCounter++ * 1000,
      description: `准备计算第${i}阶的爬法数量，需要用到第${i-1}阶和第${i-2}阶的结果`,
      visualChanges: {
        nodeUpdates: [
          { index: i-1, props: { x: 50 + (i-1) * 100, y: 300 - Math.min((i-1) * 50, 200), value: dp[i-1] } },
          { index: i-2, props: { x: 50 + (i-2) * 100, y: 300 - Math.min((i-2) * 50, 200), value: dp[i-2] } }
        ],
        matrixUpdates: [],
        formulaUpdate: `f(${i}) = f(${i-1}) + f(${i-2})`
      },
      interactionPoints: []
    });
    
    // 添加到时间线 - 状态转移计算
    timeline.push({
      timestamp: stepCounter++ * 1000,
      description: `计算第${i}阶的爬法：从第${i-1}阶爬1阶的方法数(${dp[i-1]})加上从第${i-2}阶爬2阶的方法数(${dp[i-2]})`,
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
  
  // 结果展示
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: `得到结果：爬到第${n}阶总共有${dp[n]}种不同的方法`,
    visualChanges: {
      nodeUpdates: [
        { index: n, props: { x: 50 + n * 100, y: 300 - Math.min(n * 50, 200), value: dp[n] } }
      ],
      matrixUpdates: [],
      formulaUpdate: `f(${n})=${dp[n]}`
    },
    interactionPoints: []
  });
  
  // 空间优化解释
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "动态规划优化：我们只需要保存前两个状态，可以将空间复杂度从O(n)优化到O(1)",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: "滚动数组：p=f(n-2), q=f(n-1), r=p+q"
    },
    interactionPoints: []
  });
  
  // 空间优化过程
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "使用三个变量p, q, r分别表示f(n-2), f(n-1), f(n)，计算完一个状态后向前滚动",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: "p←q, q←r, r=p+q"
    },
    interactionPoints: []
  });
  
  // 时间复杂度分析
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "算法分析：时间复杂度O(n)，空间复杂度O(1)，这是爬楼梯问题的最优解法",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: "时间O(n)，空间O(1)"
    },
    interactionPoints: []
  });
  
  return {
    result: dp[n],
    timeline,
    staircase: {
      nodes: Array.from({length: n+1}, (_, i) => ({
        id: i,
        x: 50 + i * 100,
        y: 300 - Math.min(i * 50, 200),
        value: dp[i]
      })),
      links: links
    }
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