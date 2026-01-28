/**
 * 进度条工具函数
 */

/**
 * 将进度条位置（0-100%）映射到步骤索引
 * @param progressPercent 进度百分比 (0-100)
 * @param totalSteps 总步骤数
 * @returns 步骤索引
 */
export function progressToStep(progressPercent: number, totalSteps: number): number {
  if (totalSteps <= 0) return 0;
  if (totalSteps === 1) return 0;
  
  // 确保进度在有效范围内
  const clampedProgress = Math.max(0, Math.min(100, progressPercent));
  
  // 计算步骤索引
  const step = Math.floor((clampedProgress / 100) * totalSteps);
  
  // 确保不超过最大步骤
  return Math.min(step, totalSteps - 1);
}

/**
 * 将步骤索引映射到进度条位置（0-100%）
 * @param step 当前步骤索引
 * @param totalSteps 总步骤数
 * @returns 进度百分比 (0-100)
 */
export function stepToProgress(step: number, totalSteps: number): number {
  if (totalSteps <= 1) return 0;
  
  // 确保步骤在有效范围内
  const clampedStep = Math.max(0, Math.min(step, totalSteps - 1));
  
  return (clampedStep / (totalSteps - 1)) * 100;
}
