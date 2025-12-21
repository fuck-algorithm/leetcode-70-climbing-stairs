import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AnimationTimeline } from '../../state/animationSlice';
import { CLIMBER_STATE, ANIMATION_PHASE } from './constants';
import { drawStairs } from './drawers/StairDrawer';
import { SillyClimberDrawer } from './drawers/SillyClimberDrawer';
import { useClimberAnimation } from './hooks/useClimberAnimation';
import { useStairInitialization } from './hooks/useStairInitialization';
import { useClimberStateUpdate } from './hooks/useClimberStateUpdate';

interface AnimatedClimberProps {
  n: number;
  currentStep: number;
  values: number[] | undefined;
  stepStatuses: ('uncalculated' | 'calculating' | 'calculated')[] | undefined;
  currentTimeline: AnimationTimeline | null;
  width: number;
  height: number;
  animationInProgress: boolean;
  setAnimationInProgress: (inProgress: boolean) => void;
}

const AnimatedClimber: React.FC<AnimatedClimberProps> = ({
  n,
  currentStep,
  values,
  stepStatuses,
  currentTimeline,
  width,
  height,
  animationInProgress,
  setAnimationInProgress
}) => {
  const [climberState, setClimberState] = useState(CLIMBER_STATE.STANDING);
  // 初始位置设在底部
  const [climberPosition, setClimberPosition] = useState({ x: width / 2, y: height - 90 });
  const [, setTargetPosition] = useState({ x: width / 2, y: height - 90 });
  const [stairsPositions, setStairsPositions] = useState<{ x: number, y: number }[]>([]);
  const [calculatingStep, setCalculatingStep] = useState<number | null>(null);
  const [bubbleText, setBubbleText] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentStairIndex, setCurrentStairIndex] = useState(0); // 当前所在楼梯索引
  const [animationPhase, setAnimationPhase] = useState<ANIMATION_PHASE>(ANIMATION_PHASE.NONE); // 动画阶段
  const [climbType, setClimbType] = useState<1 | 2 | null>(null); // 爬1阶还是2阶
  const [animationProgress, setAnimationProgress] = useState(0); // 动画进度 0-1
  const [animationStartTime, setAnimationStartTime] = useState(0); // 动画开始时间
  const [climberPathPoints, setClimberPathPoints] = useState<{x: number, y: number}[]>([]); // 小人移动路径点
  // 保留setClimberPathPoints以备将来使用
  void setClimberPathPoints;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const forceRender = useRef<number>(0); // 强制渲染引用
  const prevStepRef = useRef<number>(currentStep); // 记录上一次的步骤，避免不必要的更新
  const rafIdRef = useRef<number | null>(null); // 用于存储requestAnimationFrame ID
  const renderTimeRef = useRef<number>(0); // 记录上次渲染时间，用于限制渲染频率

  // 绘制Canvas - 使用useMemo缓存绘制函数，减少不必要的重建
  const drawCanvas = useCallback(() => {
    // 限制渲染频率，避免连续多次渲染
    const now = Date.now();
    if (now - renderTimeRef.current < 16) { // 大约60fps
      // 如果距离上次渲染不足16ms，则安排下一帧渲染
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(drawCanvas);
      return;
    }
    renderTimeRef.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 创建沙雕风格的小人绘制器
    const climberDrawer = new SillyClimberDrawer(ctx);
    
    // 计算楼梯位置
    if (stairsPositions.length === 0) {
      return;
    }

    // 绘制楼梯
    drawStairs(
      ctx, 
      stairsPositions, 
      width, 
      height,
      stepStatuses, 
      values, 
      calculatingStep, 
      currentStep, 
      climberState,
      animationPhase,
      currentStairIndex,
      animationInProgress
    );

    // 绘制小人 - 使用沙雕绘制器
    const currentPosition = climberPosition || { x: stairsPositions[0].x, y: stairsPositions[0].y - 35 };
    
    // 使用新的SillyClimberDrawer
    climberDrawer.drawClimber(
      currentPosition,
      climberState, 
      animationPhase, 
      animationProgress, 
      showBubble, 
      bubbleText || ''
    );
  }, [
    width, 
    height, 
    stepStatuses, 
    values, 
    calculatingStep, 
    climberPosition, 
    climberState, 
    animationPhase, 
    showBubble, 
    bubbleText, 
    animationProgress, 
    currentStep,
    currentStairIndex,
    animationInProgress,
    stairsPositions
  ]);

  // 检测步骤变化，防止不必要的更新
  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      console.log(`步骤变化检测: ${prevStepRef.current} -> ${currentStep}`);
      prevStepRef.current = currentStep;
      
      // 立即触发绘制
      drawCanvas();
    }
  }, [currentStep, drawCanvas]);

  // 使用楼梯初始化钩子
  useStairInitialization({
    n,
    width,
    height,
    setStairsPositions,
    setClimberPosition,
    setTargetPosition,
    setIsInitialized,
    drawCanvas
  });

  // 使用小人状态更新钩子
  useClimberStateUpdate({
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
  });

  // 使用动画钩子
  useClimberAnimation({
    isInitialized,
    animationInProgress,
    animationPhase,
    climbType,
    climberPathPoints,
    animationStartTime,
    setAnimationProgress,
    setClimberPosition,
    setAnimationPhase,
    setClimberState,
    setShowBubble,
    setAnimationStartTime,
    setAnimationInProgress,
    setClimbType,
    drawCanvas
  });

  // 组件挂载后强制第一次渲染
  useEffect(() => {
    // 确保Canvas元素存在后进行初始绘制
    const canvas = canvasRef.current;
    if (canvas && isInitialized) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 立即绘制初始状态
        drawCanvas();
        
        // 如果当前时间线存在而且有nodeupdates，触发第一步的计算
        if (currentTimeline && currentTimeline.visualChanges?.nodeUpdates?.length > 0) {
          const currentCalcIndex = currentTimeline.visualChanges.nodeUpdates[0].index;
          if (currentCalcIndex !== undefined && stepStatuses && stepStatuses[currentCalcIndex]) {
            setCalculatingStep(currentCalcIndex);
            console.log("初始化时触发第一步计算，索引:", currentCalcIndex);
            // 强制重新渲染
            forceRender.current += 1;
            drawCanvas();
          }
        }
      }
    }
    
    return () => {
      // 组件卸载时清理任何挂起的动画帧请求
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isInitialized, currentTimeline, drawCanvas, stepStatuses]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height}
      style={{ border: '1px solid #eee', borderRadius: '8px' }}
    />
  );
};

// 使用 React.memo 包装组件，避免不必要的重渲染
export default React.memo(AnimatedClimber); 