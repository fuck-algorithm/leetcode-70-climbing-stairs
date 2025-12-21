import { useEffect } from 'react';
import { AnimationTimeline } from '../../../state/animationSlice';
import { CLIMBER_STATE, ANIMATION_PHASE } from '../constants';

interface ClimberStateUpdateProps {
  currentTimeline: AnimationTimeline | null;
  stairsPositions: { x: number, y: number }[];
  currentStep: number;
  animationInProgress: boolean;
  setCalculatingStep: (step: number | null) => void;
  setClimberState: (state: number) => void;
  setBubbleText: (text: string) => void;
  setShowBubble: (show: boolean) => void;
  setAnimationInProgress: (inProgress: boolean) => void;
  setClimbType: (type: 1 | 2 | null) => void;
  setAnimationPhase: (phase: ANIMATION_PHASE) => void;
  setAnimationProgress: (progress: number) => void;
  setCurrentStairIndex: (index: number) => void;
  setClimberPosition: (position: { x: number, y: number }) => void;
  forceRender: React.MutableRefObject<number>;
}

// 小人状态更新钩子 - 完全重写以确保小人只受进度条控制
export const useClimberStateUpdate = ({
  currentTimeline,
  stairsPositions,
  currentStep,
  animationInProgress,
  setCalculatingStep,
  setClimberState,
  setBubbleText,
  setShowBubble,
  setAnimationInProgress,
  setClimbType,
  setAnimationPhase,
  setAnimationProgress,
  setCurrentStairIndex,
  setClimberPosition,
  forceRender
}: ClimberStateUpdateProps) => {
  
  // 唯一保留的useEffect：当步骤或时间线变化时，更新小人位置
  // 这是小人位置更新的唯一源头，确保它完全受进度条控制
  useEffect(() => {
    // 如果楼梯位置尚未计算或者没有时间线，则不处理
    if (stairsPositions.length === 0 || !currentTimeline) {
      return;
    }
    
    // 如果当前正在动画中，立即停止动画
    if (animationInProgress) {
      setAnimationInProgress(false);
      setAnimationPhase(ANIMATION_PHASE.NONE);
      setClimbType(null);
      setAnimationProgress(0);
      setShowBubble(false);
    }
    
    // 找出时间线中应该处于的楼梯阶数
    let targetStairIndex = 0;
    let shouldThink = false;
    
    // 从时间线获取信息
    if (currentTimeline.visualChanges?.nodeUpdates?.length > 0) {
      const currentCalcNode = currentTimeline.visualChanges.nodeUpdates[0];
      const currentCalcIndex = currentCalcNode.index;
      const nodeStatus = currentCalcNode.props?.status;
      
      if (currentCalcIndex !== undefined && nodeStatus) {
        // 根据节点状态决定小人状态
        if (nodeStatus === 'calculating') {
          targetStairIndex = currentCalcIndex;
          shouldThink = true; // 计算中的节点，小人应该处于思考状态
          
          // 设置当前正在计算的阶梯
          setCalculatingStep(currentCalcIndex);
        } 
        else if (nodeStatus === 'calculated') {
          targetStairIndex = currentCalcIndex;
        }
      }
    } else if (currentTimeline.description) {
      // 如果没有节点更新，从描述中提取阶梯信息
      const match = currentTimeline.description.match(/第(\d+)阶/);
      if (match && match[1]) {
        targetStairIndex = parseInt(match[1], 10);
      }
    }
    
    // 确保目标阶梯索引在有效范围内
    targetStairIndex = Math.min(targetStairIndex, stairsPositions.length - 1);
    
    // 每次步骤变化都更新小人位置，确保完全由进度条控制
    console.log(`进度条更新：小人移动到第${targetStairIndex}阶`);
    
    // 直接设置小人位置到目标楼梯上
    const newPosition = {
      x: stairsPositions[targetStairIndex].x,
      y: stairsPositions[targetStairIndex].y - 30 // 站在楼梯上方
    };
    
    // 更新小人状态
    setCurrentStairIndex(targetStairIndex);
    setClimberPosition(newPosition);
    
    // 根据是否需要思考来设置小人的状态
    if (shouldThink) {
      setClimberState(CLIMBER_STATE.THINKING);
      
      // 如果有解释文本，显示在对话气泡中
      if (currentTimeline.explanation && currentTimeline.explanation.simple) {
        setBubbleText(currentTimeline.explanation.simple);
        setShowBubble(true);
      }
    } else {
      setClimberState(CLIMBER_STATE.STANDING);
      setShowBubble(false);
    }
    
    // 强制重新渲染
    forceRender.current += 1;
  }, [currentStep, currentTimeline]); // 仅依赖于步骤和时间线变化，确保只由进度条控制
}; 