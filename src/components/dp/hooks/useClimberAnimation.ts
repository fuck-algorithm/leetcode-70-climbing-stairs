import { useRef, useEffect } from 'react';
import { ANIMATION_PHASE, CLIMBER_STATE } from '../constants';
import { easeInOutQuad } from '../utils';

interface AnimationProps {
  isInitialized: boolean;
  animationInProgress: boolean;
  animationPhase: ANIMATION_PHASE;
  climbType: 1 | 2 | null;
  climberPathPoints: { x: number, y: number }[];
  animationStartTime: number;
  setAnimationProgress: (progress: number) => void;
  setClimberPosition: (position: { x: number, y: number }) => void;
  setAnimationPhase: (phase: ANIMATION_PHASE) => void;
  setClimberState: (state: number) => void;
  setShowBubble: (show: boolean) => void;
  setAnimationStartTime: (time: number) => void;
  setAnimationInProgress: (inProgress: boolean) => void;
  setClimbType: (type: 1 | 2 | null) => void;
  drawCanvas: () => void;
}

// 动画钩子
export const useClimberAnimation = ({
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
}: AnimationProps) => {
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  // 记录小人是否已经到达终点，防止多次设置
  const hasReachedDestination = useRef<boolean>(false);
  // 跟踪上一次的animationInProgress状态
  const prevAnimationInProgressRef = useRef<boolean>(false);
  // 防抖动计时器
  const debounceTimerRef = useRef<number | null>(null);
  // 上一次的小人位置
  const prevPositionRef = useRef<{x: number, y: number} | null>(null);

  // 更新爬楼梯动画 - 防抖动版本
  const updateAnimation = (now: number) => {
    // 如果动画状态突然变成false，立即终止动画
    if (!animationInProgress && prevAnimationInProgressRef.current) {
      console.log("动画被外部中断，重置动画状态");
      prevAnimationInProgressRef.current = false;
      
      // 重置动画相关状态
      setAnimationPhase(ANIMATION_PHASE.NONE);
      setClimberState(CLIMBER_STATE.STANDING);
      hasReachedDestination.current = false;
      return;
    }
    
    // 更新状态引用
    prevAnimationInProgressRef.current = animationInProgress;
    
    // 如果动画未在进行中，不执行后续逻辑
    if (!animationInProgress) return;
    
    switch (animationPhase) {
      case ANIMATION_PHASE.PREPARE_TO_CLIMB:
        // 准备阶段持续0.3秒
        if (now - animationStartTime > 300) {
          console.log("进入爬楼梯阶段");
          setAnimationPhase(ANIMATION_PHASE.CLIMBING);
          setAnimationStartTime(now);
          hasReachedDestination.current = false;
        }
        break;
        
      case ANIMATION_PHASE.CLIMBING: {
        // 爬楼梯阶段
        // 动画持续时间：爬1阶=0.8秒，爬2阶=1.2秒
        const duration = climbType === 1 ? 800 : 1200;
        const elapsed = now - animationStartTime;
        let progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数使动画更自然
        progress = easeInOutQuad(progress);
        setAnimationProgress(progress);
        
        // 根据路径点更新小人位置
        if (climberPathPoints.length > 0) {
          // 使用进度计算当前路径索引
          const lastIndex = climberPathPoints.length - 1;
          const exactIndex = progress * lastIndex;
          const index1 = Math.floor(exactIndex);
          const index2 = Math.min(index1 + 1, lastIndex);
          const indexFraction = exactIndex - index1;
          
          // 插值计算位置，使动画更平滑
          const x = climberPathPoints[index1].x + (climberPathPoints[index2].x - climberPathPoints[index1].x) * indexFraction;
          const y = climberPathPoints[index1].y + (climberPathPoints[index2].y - climberPathPoints[index1].y) * indexFraction;
          
          // 设置新位置 - 只有当位置有明显变化时才更新
          const newPosition = { x, y };
          const prevPos = prevPositionRef.current;
          
          // 检查位置是否有足够的变化
          const shouldUpdatePosition = !prevPos || 
            Math.abs(prevPos.x - newPosition.x) > 1 || 
            Math.abs(prevPos.y - newPosition.y) > 1;
            
          if (shouldUpdatePosition) {
            prevPositionRef.current = newPosition;
            setClimberPosition(newPosition);
          }
          
          // 根据爬楼梯类型和进度更新状态
          if (progress < 0.3) {
            setClimberState(climbType === 1 ? CLIMBER_STATE.CLIMBING_ONE : CLIMBER_STATE.CLIMBING_TWO);
          } else if (progress < 0.7) {
            // 在爬楼梯中间用力状态
            setClimberState(climbType === 1 ? CLIMBER_STATE.CLIMBING_ONE : CLIMBER_STATE.CLIMBING_TWO);
          } else if (progress < 1.0) {
            // 接近顶部状态
            setClimberState(climbType === 1 ? CLIMBER_STATE.CLIMBING_ONE : CLIMBER_STATE.CLIMBING_TWO);
          }
        }
        
        // 动画完成
        if (progress >= 1 && !hasReachedDestination.current) {
          console.log("爬楼梯完成，进入到达顶部阶段");
          setAnimationPhase(ANIMATION_PHASE.REACHED_TOP);
          setAnimationStartTime(now);
          
          // 到达目标位置后开始庆祝
          setClimberState(CLIMBER_STATE.CELEBRATING);
          hasReachedDestination.current = true;
          
          // 确保小人位置是终点位置
          if (climberPathPoints.length > 0) {
            const endPosition = climberPathPoints[climberPathPoints.length - 1];
            prevPositionRef.current = endPosition;
            setClimberPosition(endPosition);
          }
        }
        break;
      }
        
      case ANIMATION_PHASE.REACHED_TOP:
        // 到达顶部后庆祝0.8秒
        if (now - animationStartTime > 800) {
          console.log("进入庆祝阶段");
          setAnimationPhase(ANIMATION_PHASE.CELEBRATING);
          setAnimationStartTime(now);
        }
        break;
        
      case ANIMATION_PHASE.CELEBRATING:
        // 庆祝阶段持续1秒
        if (now - animationStartTime > 1000) {
          console.log("动画结束");
          // 动画结束
          setAnimationPhase(ANIMATION_PHASE.NONE);
          setClimberState(CLIMBER_STATE.STANDING);
          setShowBubble(false);
          setAnimationInProgress(false);
          setClimbType(null);
          
          // 重置标记
          hasReachedDestination.current = false;
        }
        break;
    }
  };

  // 创建防抖动版的更新动画函数
  const debouncedUpdateAnimation = (now: number) => {
    // 使用防抖动机制，避免短时间内多次更新
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    
    // 立即执行一次更新
    updateAnimation(now);
    
    // 设置一个定时器，确保下一次更新不会太快发生
    debounceTimerRef.current = window.setTimeout(() => {
      debounceTimerRef.current = null;
    }, 16); // 约60fps
  };

  // 动画循环
  useEffect(() => {
    if (!isInitialized) {
      console.log("尚未初始化，不启动动画循环");
      return;
    }
    
    const animateClimber = (_time: number) => {
      const now = Date.now();
      void _time; // 保留参数以符合requestAnimationFrame签名
      
      // 更新动画状态 - 使用防抖动版本
      debouncedUpdateAnimation(now);
      
      // 重绘画布
      drawCanvas();
      
      animationRef.current = requestAnimationFrame(animateClimber);
    };
    
    // 启动动画循环
    console.log("启动动画循环");
    animationRef.current = requestAnimationFrame(animateClimber);
    
    // 初始绘制
    drawCanvas();
    
    // 清理函数
    return () => {
      console.log("清理动画循环");
      
      // 取消任何正在进行的动画帧请求
      cancelAnimationFrame(animationRef.current);
      
      // 清除可能存在的防抖动定时器
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      
      // 重置各种引用
      lastTimeRef.current = 0;
      prevAnimationInProgressRef.current = false;
      hasReachedDestination.current = false;
    };
  }, [
    isInitialized, 
    drawCanvas
  ]);
  
  // 添加一个监听animationInProgress变化的副作用
  useEffect(() => {
    // 当animationInProgress从true变为false时，立即重置所有状态
    if (!animationInProgress && prevAnimationInProgressRef.current) {
      console.log("动画被停止，重置所有状态");
      setAnimationPhase(ANIMATION_PHASE.NONE);
      setClimberState(CLIMBER_STATE.STANDING);
      setShowBubble(false);
      hasReachedDestination.current = false;
      
      // 清除可能存在的防抖动定时器
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    }
    
    prevAnimationInProgressRef.current = animationInProgress;
  }, [animationInProgress, setAnimationPhase, setClimberState, setShowBubble]);
  
  return { animationRef };
}; 