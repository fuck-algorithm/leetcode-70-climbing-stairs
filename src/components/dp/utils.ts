import { AnimationTimeline } from '../../state/animationSlice';

/**
 * 获取简化描述文本，使算法过程更加通俗易懂
 */
export const getSimplifiedDescription = (
  currentTimeline: AnimationTimeline | null,
  values: number[] | undefined,
  stepStatuses: ('uncalculated' | 'calculating' | 'calculated')[] | undefined
): string => {
  if (!currentTimeline) return "";
  
  // 提取当前步骤中正在计算的索引
  const currentIndex = currentTimeline.visualChanges?.nodeUpdates?.[0]?.index;
  
  if (currentIndex === undefined) {
    return currentTimeline.description;
  }
  
  // 根据不同情况给出更通俗的描述
  if (currentIndex === 0 || currentIndex === 1) {
    return `基本规则：爬到第${currentIndex}阶有${values?.[currentIndex]}种方法`;
  } else if (stepStatuses?.[currentIndex] === 'calculating') {
    return `现在计算爬到第${currentIndex}阶的方法数，需要知道爬到第${currentIndex-1}阶和第${currentIndex-2}阶的方法数`;
  } else if (stepStatuses?.[currentIndex] === 'calculated') {
    const prev1 = values?.[currentIndex-1] || 0;
    const prev2 = values?.[currentIndex-2] || 0;
    return `爬到第${currentIndex}阶的方法数 = 爬到第${currentIndex-1}阶的方法数(${prev1}) + 爬到第${currentIndex-2}阶的方法数(${prev2}) = ${prev1 + prev2}`;
  }
  
  return currentTimeline.description;
};

// 二次缓动函数，使动画更自然
export const easeInOutQuad = (t: number): number => {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};

// 绘制圆角矩形辅助函数
export const roundRect = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  radius: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}; 