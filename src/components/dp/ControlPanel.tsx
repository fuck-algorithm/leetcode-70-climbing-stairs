import React, { useCallback } from 'react';
import { ControlPanelProps } from './types';
import { 
  ControlsContainer, 
  ButtonsRow, 
  SliderContainer, 
  SliderLabel, 
  StepSlider,
  SpeedSlider,
  ControlButton,
  PlayButton
} from './styles/control-panel';

const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  onReset,
  onPlayPause,
  onPreviousStep,
  onNextStep,
  onStepChange,
  onSpeedChange
}) => {
  // 确保state中有所需的属性
  if (!state || typeof state.currentStep !== 'number' || typeof state.totalSteps !== 'number') {
    console.error("ControlPanel 收到无效的state:", state);
    return (
      <ControlsContainer>
        <div style={{color: 'red'}}>错误：控制面板接收到无效数据</div>
      </ControlsContainer>
    );
  }

  // 使用useCallback包装按钮事件处理器
  const handleNextStepClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Next step button clicked");
    onNextStep(e);
  }, [onNextStep]);

  const handlePreviousStepClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Previous step button clicked");
    onPreviousStep(e);
  }, [onPreviousStep]);
  
  const handlePlayPauseClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Play/Pause button clicked");
    onPlayPause(e);
  }, [onPlayPause]);
  
  const handleResetClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Reset button clicked");
    onReset(e);
  }, [onReset]);

  // 为了防止totalSteps出错导致进度条无效，添加安全检查
  const totalSteps = state.totalSteps > 0 ? state.totalSteps : (state.timeline?.length || 1);

  return (
    <ControlsContainer>
      <ButtonsRow>
        <ControlButton onClick={handleResetClick} title="重置动画" type="button">
          重置
        </ControlButton>
        <ControlButton 
          onClick={handlePreviousStepClick}
          disabled={state.currentStep <= 0}
          title="上一步"
          type="button"
        >
          上一步
        </ControlButton>
        <PlayButton 
          onClick={handlePlayPauseClick}
          isPlaying={state.isPlaying}
          primary
          title={state.isPlaying ? "暂停" : "播放"}
          type="button"
        >
          {state.isPlaying ? "暂停" : "播放"}
        </PlayButton>
        <ControlButton 
          onClick={handleNextStepClick}
          disabled={state.currentStep >= totalSteps - 1}
          title="下一步"
          type="button"
        >
          下一步
        </ControlButton>
      </ButtonsRow>
      
      <SliderContainer>
        <SliderLabel>
          <span>步骤进度</span>
          <small>{state.currentStep + 1} / {totalSteps}</small>
        </SliderLabel>
        <StepSlider
          type="range"
          min={0}
          max={totalSteps > 0 ? totalSteps - 1 : 0}
          value={state.currentStep}
          onChange={onStepChange}
          disabled={totalSteps <= 1}
        />
      </SliderContainer>
      
      <SliderContainer>
        <SliderLabel>
          <span>播放速度</span>
          <small>{state.playbackSpeed}x</small>
        </SliderLabel>
        <SpeedSlider
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={state.playbackSpeed}
          onChange={onSpeedChange}
        />
      </SliderContainer>
    </ControlsContainer>
  );
};

export default ControlPanel; 