import { useMemo } from 'react';
import { AnimationTimeline, AnimationState } from '../../../state/animationSlice';
import { ClimberPosition } from '../types';

/**
 * 确定小人的位置和动作状态
 */
export const useClimberPosition = (
  state: AnimationState,
  currentTimeline: AnimationTimeline | null
) => {
  return useMemo(() => {
    // 默认状态
    let climberPosition: ClimberPosition = 'bottom';
    let climberEmoji = '🧍';
    let actionText = '';
    
    // 当前实际计算的阶梯索引
    const currentCalcIndex = currentTimeline?.visualChanges?.nodeUpdates?.[0]?.index || 0;
    
    if (currentCalcIndex >= 2) {
      // 检查是否在爬1阶
      if (currentTimeline?.description?.includes('爬1阶') || 
          (state.stepStatuses?.[currentCalcIndex] === 'calculating' && 
           state.stepStatuses?.[currentCalcIndex-1] === 'calculated')) {
        climberPosition = 'step1';
        climberEmoji = '🏃';
        actionText = `从第${currentCalcIndex-1}阶爬1阶`;
        console.log('小人爬1阶:', actionText);
      } 
      // 检查是否在爬2阶
      else if (currentTimeline?.description?.includes('爬2阶') || 
               (state.stepStatuses?.[currentCalcIndex] === 'calculating' && 
                state.stepStatuses?.[currentCalcIndex-2] === 'calculated')) {
        climberPosition = 'step2';
        climberEmoji = '🧗';
        actionText = `从第${currentCalcIndex-2}阶爬2阶`;
        console.log('小人爬2阶:', actionText);
      }
    }
    
    return {
      climberPosition,
      climberEmoji,
      actionText,
      currentCalcIndex
    };
  }, [state.stepStatuses, currentTimeline]);
}; 