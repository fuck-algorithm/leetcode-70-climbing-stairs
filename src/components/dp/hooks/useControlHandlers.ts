import { useCallback } from 'react';
import { 
  playPause, 
  resetAnimation, 
  setCurrentStep, 
  setPlaybackSpeed 
} from '../../../state/animationSlice';

/**
 * 控制面板事件处理钩子
 * 从SimpleDPVisualizer组件中提取事件处理逻辑
 */
export const useControlHandlers = (
  state: any,
  dispatch: (action: any) => void
) => {
  // 播放/暂停按钮处理函数
  const handlePlayPause = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    console.log("播放/暂停处理, 当前状态:", state.isPlaying);
    dispatch(playPause());
  }, [dispatch, state.isPlaying]);
  
  // 重置按钮处理函数
  const handleReset = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    console.log("重置处理");
    
    // 先调度重置动作
    dispatch(resetAnimation());
    
    // 重置任何可能正在进行的动画状态 (通过自定义动作)
    dispatch({ 
      type: 'animation/updateStepData', 
      payload: {
        stepStatuses: state.stepStatuses?.map((s: string, i: number) => 
          i <= 1 ? 'calculated' : 'uncalculated'),
        values: state.values
      }
    });
    
    // 重置动画状态
    dispatch({
      type: 'animation/setAnimationState',
      payload: {
        animationInProgress: false
      }
    });
    
  }, [dispatch, state.stepStatuses, state.values]);
  
  // 上一步按钮处理函数
  const handlePreviousStep = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    if (state.currentStep > 0) {
      console.log("前一步处理, 当前步骤:", state.currentStep);
      
      // 停止任何正在进行的动画
      dispatch({
        type: 'animation/setAnimationState',
        payload: {
          animationInProgress: false
        }
      });
      
      // 设置当前步骤并重置任何进行中的动画
      dispatch(setCurrentStep(state.currentStep - 1));
      
      // 如果正在播放，则暂停
      if (state.isPlaying) {
        dispatch(playPause());
      }
    }
  }, [dispatch, state.currentStep, state.isPlaying]);
  
  // 下一步按钮处理函数
  const handleNextStep = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    if (state.currentStep < state.totalSteps - 1) {
      console.log("下一步处理, 当前步骤:", state.currentStep);
      
      // 停止任何正在进行的动画
      dispatch({
        type: 'animation/setAnimationState',
        payload: {
          animationInProgress: false
        }
      });
      
      // 设置当前步骤
      dispatch(setCurrentStep(state.currentStep + 1));
      
      // 如果正在播放，则暂停
      if (state.isPlaying) {
        dispatch(playPause());
      }
    }
  }, [dispatch, state.currentStep, state.totalSteps, state.isPlaying]);
  
  // 步骤滑块变更处理函数
  const handleStepChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newStep = parseInt(e.target.value, 10);
    console.log("步骤滑块变化, 新步骤:", newStep);
    
    if (newStep >= 0 && newStep < state.totalSteps) {
      // 停止任何正在进行的动画
      dispatch({
        type: 'animation/setAnimationState',
        payload: {
          animationInProgress: false
        }
      });
      
      // 设置当前步骤
      dispatch(setCurrentStep(newStep));
      
      // 如果正在播放，则暂停
      if (state.isPlaying) {
        dispatch(playPause());
      }
    }
  }, [dispatch, state.totalSteps, state.isPlaying]);
  
  // 速度滑块变更处理函数
  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    console.log("速度滑块变化, 新速度:", newSpeed);
    
    if (newSpeed >= 0.5 && newSpeed <= 2) {
      dispatch(setPlaybackSpeed(newSpeed));
    }
  }, [dispatch]);

  return {
    handlePlayPause,
    handleReset,
    handlePreviousStep,
    handleNextStep,
    handleStepChange,
    handleSpeedChange
  };
}; 