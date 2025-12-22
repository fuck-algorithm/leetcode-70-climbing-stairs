import React, { useCallback, useEffect, useState } from 'react';
import { ControlPanelProps } from './types';
import styled from 'styled-components';

// 播放速度存储键
const SPEED_STORAGE_KEY = 'playback_speed';

// 从localStorage获取播放速度
const getStoredSpeed = (): number => {
  try {
    const stored = localStorage.getItem(SPEED_STORAGE_KEY);
    return stored ? parseFloat(stored) : 1.0;
  } catch {
    return 1.0;
  }
};

// 保存播放速度到localStorage
const storeSpeed = (speed: number): void => {
  try {
    localStorage.setItem(SPEED_STORAGE_KEY, speed.toString());
  } catch {
    // 忽略存储错误
  }
};

// 样式组件
const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const ButtonsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ControlButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'primary',
})<{ primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.primary ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : '#fff'};
  color: ${props => props.primary ? '#fff' : '#333'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ShortcutHint = styled.span`
  font-size: 10px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-left: 4px;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  
  small {
    color: #4CAF50;
    font-weight: 600;
  }
`;

const ProgressSlider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #4CAF50 0%, #4CAF50 var(--progress), #ddd var(--progress), #ddd 100%);
  appearance: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(76, 175, 80, 0.4);
    transition: transform 0.2s ease;
  }
  
  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SpeedSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  appearance: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #2196F3;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.4);
  }
`;

const ErrorMessage = styled.div`
  color: red;
  padding: 10px;
`;

const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  onReset,
  onPlayPause,
  onPreviousStep,
  onNextStep,
  onStepChange,
  onSpeedChange
}) => {
  const [localSpeed, setLocalSpeed] = useState(getStoredSpeed());
  
  // 为了防止totalSteps出错导致进度条无效，添加安全检查
  const totalSteps = state?.totalSteps > 0 ? state.totalSteps : (state?.timeline?.length || 1);
  const progress = totalSteps > 1 ? ((state?.currentStep || 0) / (totalSteps - 1)) * 100 : 0;
  const isValidState = state && typeof state.currentStep === 'number' && typeof state.totalSteps === 'number';

  // 使用useCallback包装按钮事件处理器
  const handleNextStepClick = useCallback((e?: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Next step button clicked");
    if (e) onNextStep(e);
    else onNextStep();
  }, [onNextStep]);

  const handlePreviousStepClick = useCallback((e?: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Previous step button clicked");
    if (e) onPreviousStep(e);
    else onPreviousStep();
  }, [onPreviousStep]);
  
  const handlePlayPauseClick = useCallback((e?: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Play/Pause button clicked");
    if (e) onPlayPause(e);
    else onPlayPause();
  }, [onPlayPause]);
  
  const handleResetClick = useCallback((e?: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Reset button clicked");
    if (e) onReset(e);
    else onReset();
  }, [onReset]);
  
  // 处理速度变化
  const handleSpeedChangeLocal = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseFloat(e.target.value);
    setLocalSpeed(speed);
    storeSpeed(speed);
    onSpeedChange(e);
  }, [onSpeedChange]);

  // 初始化时设置保存的速度
  useEffect(() => {
    const storedSpeed = getStoredSpeed();
    setLocalSpeed(storedSpeed);
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果焦点在输入框中，不处理快捷键
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (!isValidState) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (state.currentStep > 0) {
            handlePreviousStepClick();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (state.currentStep < totalSteps - 1) {
            handleNextStepClick();
          }
          break;
        case ' ':
          e.preventDefault();
          handlePlayPauseClick();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleResetClick();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state?.currentStep, state?.isPlaying, totalSteps, isValidState, handlePreviousStepClick, handleNextStepClick, handlePlayPauseClick, handleResetClick]);

  // 确保state中有所需的属性
  if (!isValidState) {
    console.error("ControlPanel 收到无效的state:", state);
    return (
      <ControlsContainer>
        <ErrorMessage>错误：控制面板接收到无效数据</ErrorMessage>
      </ControlsContainer>
    );
  }

  return (
    <ControlsContainer>
      <ButtonsRow>
        <ControlButton onClick={handleResetClick} title="重置动画 (R)" type="button">
          🔄 重置
          <ShortcutHint>R</ShortcutHint>
        </ControlButton>
        <ControlButton 
          onClick={handlePreviousStepClick}
          disabled={state.currentStep <= 0}
          title="上一步 (←)"
          type="button"
        >
          ⬅️ 上一步
          <ShortcutHint>←</ShortcutHint>
        </ControlButton>
        <ControlButton 
          onClick={handlePlayPauseClick}
          primary
          title={state.isPlaying ? "暂停 (空格)" : "播放 (空格)"}
          type="button"
        >
          {state.isPlaying ? "⏸️ 暂停" : "▶️ 播放"}
          <ShortcutHint>空格</ShortcutHint>
        </ControlButton>
        <ControlButton 
          onClick={handleNextStepClick}
          disabled={state.currentStep >= totalSteps - 1}
          title="下一步 (→)"
          type="button"
        >
          下一步 ➡️
          <ShortcutHint>→</ShortcutHint>
        </ControlButton>
      </ButtonsRow>
      
      <SliderContainer>
        <SliderLabel>
          <span>播放进度</span>
          <small>{state.currentStep + 1} / {totalSteps}</small>
        </SliderLabel>
        <ProgressSlider
          type="range"
          min={0}
          max={totalSteps > 0 ? totalSteps - 1 : 0}
          value={state.currentStep}
          onChange={onStepChange}
          disabled={totalSteps <= 1}
          style={{ '--progress': `${progress}%` } as React.CSSProperties}
        />
      </SliderContainer>
      
      <SliderContainer>
        <SliderLabel>
          <span>播放速度</span>
          <small>{localSpeed.toFixed(1)}x</small>
        </SliderLabel>
        <SpeedSlider
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={localSpeed}
          onChange={handleSpeedChangeLocal}
        />
      </SliderContainer>
    </ControlsContainer>
  );
};

export default ControlPanel;