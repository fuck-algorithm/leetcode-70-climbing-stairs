import { AnimationTimeline } from '../state/animationSlice';

export interface DPAnimationState {
  nodes: { id: number; status: 'uncalculated' | 'calculating' | 'calculated'; value: number }[];
  links: { source: number; target: number }[];
  currentStep: number;
}

// 为每个步骤添加多层次的解释（用于类型定义）
interface _StepExplanation {
  simple: string;
  detailed: string;
  expert: string;
}

// 导出类型以供其他模块使用
export type StepExplanation = _StepExplanation;

/**
 * 使用动态规划算法生成爬楼梯问题的解和动画时间线
 * @param n 楼梯的阶数
 * @returns 包含结果、时间线和可视化数据的对象
 */
export function generateDPSolution(n: number): {
  result: number;
  timeline: AnimationTimeline[];
  stepsData: {
    stepStatuses: ('uncalculated' | 'calculating' | 'calculated')[];
    values: number[];
  };
} {
  console.log("开始生成动态规划解决方案，n =", n);
  
  try {
  // 初始化时间线
  const timeline: AnimationTimeline[] = [];
  let stepCounter = 0;

  // 初始化步骤状态和值
  const stepStatuses: ('uncalculated' | 'calculating' | 'calculated')[] = Array(n + 1).fill('uncalculated');
  const values: number[] = Array(n + 1).fill(0);

  // 处理边界情况
  if (n <= 0) {
      console.log("处理边界情况 n <= 0");
    return {
      result: 0,
      timeline: [{
        timestamp: stepCounter++ * 1000,
        description: "输入的阶数小于等于0，没有有效的爬楼梯方法",
        visualChanges: {
          nodeUpdates: [
            { index: 0, props: { status: 'calculated', value: 0 } }
          ],
          matrixUpdates: [],
          formulaUpdate: "n <= 0，返回0"
        },
        interactionPoints: [],
        explanation: {
          simple: "当楼梯阶数为0或负数时，没有有效的爬楼梯方法，直接返回0。",
          detailed: "在爬楼梯问题中，我们需要计算爬到第n阶的方法数。如果n≤0，这表示没有楼梯或者一个无效的问题，因此答案是0。",
          expert: "边界条件处理：对于n≤0的情况，从问题定义来看不存在有效解，因此返回0。这种特殊情况处理是算法健壮性的一部分，确保在各种输入下都有合理的行为。"
        },
        code: "if (n <= 0) return 0;"
      }],
      stepsData: {
        stepStatuses: ['calculated'],
        values: [0]
      }
    };
  }
  
    console.log("生成DP解决方案，计算中...");
  
  // 初始化DP数组
  const dp: number[] = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;
  
  // 更新初始值的状态
  stepStatuses[0] = 'calculated';
  stepStatuses[1] = 'calculated';
  values[0] = 1;
  values[1] = 1;
  
  console.log("初始化DP基础状态，DP:", dp, "状态:", stepStatuses, "值:", values);
  
  // 引入基本概念
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "爬楼梯问题：每次可以爬1阶或2阶，问爬到第n阶有多少种方法？",
    visualChanges: {
      nodeUpdates: [],
      matrixUpdates: [],
      formulaUpdate: "动态规划解法"
    },
    interactionPoints: [],
    explanation: {
      simple: "这是一个经典的动态规划问题。我们需要找出爬到第n阶楼梯的不同方法数量。",
      detailed: "在这个问题中，每次我们可以选择爬1阶或2阶。我们的目标是计算出爬到第n阶楼梯总共有多少种不同的方法。这是一个典型的[concept]动态规划[/concept]问题，我们可以通过构建子问题的解来得到最终答案。",
      expert: "爬楼梯问题是[concept]动态规划[/concept]的经典案例，体现了最优子结构和重叠子问题的特性。这个问题也与[concept]斐波那契数列[/concept]有紧密联系，可以看作是一个实际应用场景下的斐波那契数列变种。解法涉及状态定义、转移方程推导和边界条件处理。"
    },
    code: null
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
    interactionPoints: [],
    explanation: {
      simple: "要找出到达第n阶的方法数，我们需要知道到达前面阶梯的方法数。",
      detailed: "[concept]动态规划[/concept]的关键是找到问题的[concept]状态转移方程[/concept]。在爬楼梯问题中，我们需要思考：要到达第n阶，我们可以从哪些位置出发？由于每次可以爬1阶或2阶，所以可以从第(n-1)阶或第(n-2)阶到达第n阶。",
      expert: "在构建[concept]动态规划[/concept]解法时，核心是找到[concept]状态定义[/concept]和[concept]状态转移方程[/concept]。本题中，状态f(n)定义为到达第n阶的不同方法数。由于每次可以爬1阶或2阶，考虑最后一步的来源，要么是从(n-1)爬1阶，要么是从(n-2)爬2阶。这就自然导出状态转移方程：f(n) = f(n-1) + f(n-2)。"
    },
    code: "// 状态定义：f(n)表示爬到第n阶的方法数\n// 状态转移方程：f(n) = f(n-1) + f(n-2)"
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
    interactionPoints: [],
    explanation: {
      simple: "爬到第n阶的方法数等于爬到第(n-1)阶的方法数加上爬到第(n-2)阶的方法数。",
      detailed: "思考为什么f(n) = f(n-1) + f(n-2)：要到达第n阶，我们可以从第(n-1)阶爬1阶到达，或者从第(n-2)阶爬2阶到达。所以，到达第n阶的方法数等于到达第(n-1)阶的方法数加上到达第(n-2)阶的方法数。",
      expert: "状态转移方程f(n) = f(n-1) + f(n-2)的推导基于[concept]决策树分析[/concept]：考虑到达第n阶的最后一步，只有两种可能：从(n-1)爬1阶或从(n-2)爬2阶。这两种情况互斥且完备，因此总方法数是这两种情况的方法数之和。这也解释了为什么该问题的解恰好是[concept]斐波那契数列[/concept]的形式。"
    },
    code: "// 从第(n-1)阶爬1阶到达第n阶的方法数：f(n-1)\n// 从第(n-2)阶爬2阶到达第n阶的方法数：f(n-2)\n// 总方法数：f(n) = f(n-1) + f(n-2)"
  });
  
  // 初始化阶段的时间线
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: "初始化：第0阶表示起点，有1种方法（不爬）；第1阶有1种方法（爬1阶）",
    visualChanges: {
      nodeUpdates: [
        { index: 0, props: { status: 'calculated', value: 1 } },
        { index: 1, props: { status: 'calculated', value: 1 } }
      ],
      matrixUpdates: [],
      formulaUpdate: "f(0)=1, f(1)=1"
    },
    interactionPoints: [],
    explanation: {
      simple: "我们先设定初始值：到达第0阶（起点）有1种方法，到达第1阶有1种方法。",
      detailed: "在开始使用状态转移方程之前，我们需要初始化基本情况。我们定义：\n- f(0) = 1：表示到达起点（第0阶）有1种方法，即不爬\n- f(1) = 1：表示到达第1阶有1种方法，即从起点爬1阶",
      expert: "动态规划的初始条件设定是算法的关键部分。对于本题：\n- f(0) = 1：将起点也视为一种有效到达，这是因为'不爬'也算作一种方法。有些题目可能会将此值设为0，取决于问题的具体定义。\n- f(1) = 1：只有一种方式到达第1阶，即直接爬1阶。\n这些初始值为后续的状态转移提供了基础。"
    },
    code: "const dp = new Array(n + 1).fill(0);\ndp[0] = 1; // 到达起点的方法数为1\ndp[1] = 1; // 到达第1阶的方法数为1"
  });
  
  // 创建节点之间的连接关系
  const links: { source: number; target: number }[] = [];
  
  // 状态转移阶段
  for (let i = 2; i <= n; i++) {
    // 计算当前阶的值
    dp[i] = dp[i - 1] + dp[i - 2];
    
    // 添加连接
    links.push({ source: i-1, target: i });
    links.push({ source: i-2, target: i });
    
    // 标记当前计算的阶梯
    const currentStepStatuses = [...stepStatuses];
    currentStepStatuses[i] = 'calculating';
    
    // 添加到时间线 - 状态转移前的解释
    timeline.push({
      timestamp: stepCounter++ * 1000,
      description: `准备计算第${i}阶的爬法数量，需要用到第${i-1}阶和第${i-2}阶的结果`,
      visualChanges: {
        nodeUpdates: [
          { index: i, props: { status: 'calculating', value: undefined } }
        ],
        matrixUpdates: [],
        formulaUpdate: `f(${i}) = f(${i-1}) + f(${i-2})`
      },
      interactionPoints: [],
      explanation: {
          simple: `我们现在要计算到达第${i}阶的方法数，需要从已知的第${i-1}阶和第${i-2}阶的结果推导出来。`,
          detailed: `根据状态转移方程f(n) = f(n-1) + f(n-2)，计算f(${i})需要已知f(${i-1})和f(${i-2})的值。我们已经计算出：\n- f(${i-1}) = ${dp[i-1]}：有${dp[i-1]}种方法爬到第${i-1}阶\n- f(${i-2}) = ${dp[i-2]}：有${dp[i-2]}种方法爬到第${i-2}阶\n现在我们可以推导出到达第${i}阶的方法数。`,
          expert: `应用状态转移方程f(n) = f(n-1) + f(n-2)计算f(${i})。已知：\n- f(${i-1}) = ${dp[i-1]}：表示有${dp[i-1]}种不同方法爬到第${i-1}阶\n- f(${i-2}) = ${dp[i-2]}：表示有${dp[i-2]}种不同方法爬到第${i-2}阶\n\n从第${i-1}阶爬1阶可以到达第${i}阶，从第${i-2}阶爬2阶也可以到达第${i}阶。这意味着到达第${i}阶的所有可能方法，要么是从第${i-1}阶爬1阶得到的（${dp[i-1]}种方法），要么是从第${i-2}阶爬2阶得到的（${dp[i-2]}种方法）。这体现了动态规划的核心思想——通过已解决的子问题来解决当前问题。`
      },
        code: `// 计算第${i}阶的爬法\n// 需要用到: f(${i-1}) = ${dp[i-1]}和f(${i-2}) = ${dp[i-2]}`
    });
    
    // 更新状态：计算完成
    stepStatuses[i] = 'calculated';
    values[i] = dp[i];
    
    // 添加到时间线 - 状态转移计算
    timeline.push({
      timestamp: stepCounter++ * 1000,
      description: `计算第${i}阶的爬法：从第${i-1}阶爬1阶的方法数(${dp[i-1]})加上从第${i-2}阶爬2阶的方法数(${dp[i-2]})`,
      visualChanges: {
        nodeUpdates: [
          { index: i, props: { status: 'calculated', value: dp[i] } }
        ],
        matrixUpdates: [],
        formulaUpdate: `f(${i})=f(${i-1})+f(${i-2})=${dp[i-1]}+${dp[i-2]}=${dp[i]}`
      },
      interactionPoints: [],
      explanation: {
          simple: `通过将从第${i-1}阶爬1阶的方法数(${dp[i-1]})和从第${i-2}阶爬2阶的方法数(${dp[i-2]})相加，我们计算出到达第${i}阶总共有${dp[i]}种不同的方法。`,
          detailed: `我们应用状态转移方程:\nf(${i}) = f(${i-1}) + f(${i-2})\n= ${dp[i-1]} + ${dp[i-2]}\n= ${dp[i]}\n\n这表示到达第${i}阶的方法总数是${dp[i]}，由两部分组成：\n1. 从第${i-1}阶爬1阶到达第${i}阶的${dp[i-1]}种方法\n2. 从第${i-2}阶爬2阶到达第${i}阶的${dp[i-2]}种方法`,
          expert: `f(${i}) = f(${i-1}) + f(${i-2}) = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}\n\n这个计算步骤可以通过图形化理解：想象一个人在楼梯上，他要到达第${i}阶，那么他最后一步有两种可能：\n\n1. 他可以从第${i-1}阶爬1阶到达，那么到达第${i-1}阶的每种方法都对应着一种到达第${i}阶的方法，共有${dp[i-1]}种\n2. 他可以从第${i-2}阶爬2阶到达，那么到达第${i-2}阶的每种方法也都对应着一种到达第${i}阶的方法，共有${dp[i-2]}种\n\n这一计算体现了[concept]动态规划[/concept]的几个关键特性：\n- 最优子结构：第${i}阶的解由第${i-1}阶和第${i-2}阶的最优解组成\n- 重叠子问题：更高阶梯的计算中，这些结果会被重复使用\n- 无后效性：一旦f(${i})计算完成，不会因后续计算而改变`
      },
      code: `dp[${i}] = dp[${i-1}] + dp[${i-2}]; // ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`
    });
  }
  
  // 结果展示
  timeline.push({
    timestamp: stepCounter++ * 1000,
    description: `得到结果：爬到第${n}阶总共有${dp[n]}种不同的方法`,
    visualChanges: {
      nodeUpdates: [
        { index: n, props: { status: 'calculated', value: dp[n] } }
      ],
      matrixUpdates: [],
      formulaUpdate: `f(${n})=${dp[n]}`
    },
    interactionPoints: [],
    explanation: {
      simple: `最终结果：爬到第${n}阶楼梯总共有${dp[n]}种不同的方法。`,
      detailed: `通过动态规划的方法，我们成功计算出爬到第${n}阶楼梯总共有${dp[n]}种不同的方法。这是通过逐步计算从第2阶到第${n}阶的方法数得出的。`,
      expert: `最终解：f(${n}) = ${dp[n]}。\n\n我们通过动态规划自底向上地求解，时间复杂度为O(n)，空间复杂度为O(n)。值得注意的是，这个结果正是斐波那契数列的第(n+1)项。对于更大的n值，可以考虑使用矩阵快速幂或通项公式进行优化，将时间复杂度降至O(logn)。`
    },
    code: `return dp[${n}]; // 返回最终结果: ${dp[n]}`
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
    interactionPoints: [],
    explanation: {
      simple: "我们可以只用三个变量来代替整个数组，节省空间。",
      detailed: "在计算过程中，我们发现每次只需要用到前两个状态的值。因此，我们可以只用三个变量p、q、r分别表示f(n-2)、f(n-1)和f(n)，这样就可以将空间复杂度从O(n)优化到O(1)。",
      expert: "动态规划中的[concept]滚动数组[/concept]技术：注意到状态转移只依赖于前两个状态，我们可以使用三个变量(p, q, r)分别表示(f(n-2), f(n-1), f(n))，在每次迭代后通过变量滚动(p←q, q←r)来复用存储空间。这将空间复杂度从O(n)优化到O(1)，是动态规划中常见的空间优化技巧。"
    },
    code: "let p = 1; // f(0)\nlet q = 1; // f(1)\nlet r = 0; // f(n)\n\nfor (let i = 2; i <= n; i++) {\n  r = p + q;\n  p = q;\n  q = r;\n}\n\nreturn r; // 返回最终结果"
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
    interactionPoints: [],
    explanation: {
      simple: "使用滚动变量，每次计算完成后更新变量值，达到复用空间的目的。",
      detailed: "滚动数组优化的具体步骤：\n1. 初始化p=1 (f(0)), q=1 (f(1))\n2. 对于i从2到n：\n   - 计算r = p + q\n   - 更新p = q (旧的f(n-1)变成新的f(n-2))\n   - 更新q = r (新计算的f(n)变成新的f(n-1))\n3. 最后返回r，即f(n)",
      expert: "滚动数组的实现细节：\n1. 初始状态：p=1, q=1分别代表f(0), f(1)\n2. 迭代计算：在每次迭代中\n   - r = p + q 计算当前状态\n   - p = q, q = r 变量滚动，为下一迭代准备\n3. 结果返回：最后r中存储的即为f(n)\n\n这种优化是[concept]空间-时间权衡[/concept]的典型案例，通过牺牲代码的直观性换取空间效率。在某些内存受限的环境中，这种优化尤为重要。"
    },
    code: "// 滚动数组优化\nlet p = 1; // 初始为f(0)\nlet q = 1; // 初始为f(1)\nlet r = 0;\n\nfor (let i = 2; i <= n; i++) {\n  r = p + q;    // 计算当前值\n  p = q;        // 更新f(n-2)\n  q = r;        // 更新f(n-1)\n}\n\nreturn r;       // 返回f(n)"
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
    interactionPoints: [],
    explanation: {
      simple: "这个优化后的算法时间复杂度为O(n)，空间复杂度为O(1)。",
      detailed: "算法复杂度分析：\n- 时间复杂度：O(n)，因为我们需要从2到n进行线性遍历，每步计算是常数时间的\n- 空间复杂度：使用滚动数组优化后为O(1)，只需要三个变量存储状态，不随n的增大而增加",
      expert: "算法复杂度的深入分析：\n- 时间复杂度：O(n)，这是通过动态规划方法求解斐波那契数列的最优时间复杂度，除非使用特殊的公式计算\n- 空间复杂度：使用滚动数组优化后为O(1)，常数级空间\n- 渐进性能：对于较大的n值，可以考虑使用矩阵快速幂(O(logn))或通项公式(O(1))，但需要处理浮点数精度问题\n- 算法稳定性：该方法数值稳定，不会产生大数溢出（除非n非常大）\n\n这种[concept]线性动态规划[/concept]是最基础也是最广泛应用的动态规划形式。"
    },
    code: "// 时间复杂度：O(n) - 一次遍历\n// 空间复杂度：O(1) - 使用滚动数组，常数空间"
  });
    
    console.log("完成DP解决方案生成，时间线长度:", timeline.length);
    
    // 验证生成的数据
    if (!timeline || timeline.length === 0) {
      console.error("错误：生成的时间线为空");
      // 添加一个默认的时间线项以防止UI崩溃
      timeline.push({
        timestamp: 0,
        description: "算法生成出错，请刷新页面重试",
        visualChanges: {
          nodeUpdates: [],
          matrixUpdates: [],
          formulaUpdate: "发生错误"
        },
        interactionPoints: [],
        explanation: {
          simple: "生成动态规划解决方案时发生错误。",
          detailed: "算法执行过程中出现了问题，无法生成完整的解决方案步骤。",
          expert: "程序在运行时遇到了异常，可能是由于内存限制或代码逻辑问题导致的。"
        },
        code: "// 出错了，请刷新页面"
      });
    }
  
  return {
      result: n > 0 ? (n === 1 ? 1 : (n === 2 ? 2 : calculateDP(n))) : 0,
    timeline,
    stepsData: {
      stepStatuses,
      values
    }
  };
  } catch (error) {
    console.error("生成DP解决方案时发生异常:", error);
    // 返回一个最小可用的响应，包含错误信息
    return {
      result: 0,
      timeline: [{
        timestamp: 0,
        description: "生成解决方案时发生错误",
        visualChanges: {
          nodeUpdates: [],
          matrixUpdates: [],
          formulaUpdate: "发生错误: " + String(error)
        },
        interactionPoints: [],
        explanation: {
          simple: "生成动态规划解决方案时发生错误。",
          detailed: "算法执行过程中出现了异常，无法生成完整的解决方案步骤。",
          expert: "捕获到异常: " + String(error)
        },
        code: "// 出错了，请刷新页面"
      }],
      stepsData: {
        stepStatuses: ['uncalculated'],
        values: [0]
      }
    };
  }
}

// 辅助函数：计算DP结果
function calculateDP(n: number): number {
  const dp = new Array(n + 1);
  dp[0] = 1;
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  
  return dp[n];
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