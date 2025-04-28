import React, { useEffect, useState } from 'react';
import StairsComponent from '../StairsComponent';
import StepExplanation from '../StepExplanation';
import { AnimationTimeline, playPause, resetAnimation, setCurrentStep, setPlaybackSpeed } from '../../state/animationSlice';
import { generateDPSolution } from '../../algorithms/dpAlgorithm';
import { DynamicProgrammingVisualizerProps } from './types';
import { 
  VisualizerContainer, 
  VisualizationArea, 
  StairsArea, 
  ExplanationArea, 
  ProgressBar, 
  Progress 
} from './styles';
import GuidePanel from './GuidePanel';
import ControlPanel from './ControlPanel';
import PathDiagramComponent from './PathDiagramComponent';
import { getSimplifiedDescription } from './utils';
import AnimatedClimber from './AnimatedClimber';

const DynamicProgrammingVisualizer: React.FC<DynamicProgrammingVisualizerProps> = ({ 
  n, 
  state, 
  onGenerateSolution,
  dispatch
}) => {
  const [currentTimeline, setCurrentTimeline] = useState<AnimationTimeline | null>(null);
  const [showingGuide, setShowingGuide] = useState(true);
  
  // 生成解决方案
  useEffect(() => {
    if (n > 0) {
      console.log("生成DP解决方案，n =", n);
      const solution = generateDPSolution(n);
      console.log("生成的解决方案:", solution);
      onGenerateSolution(solution);
    }
  }, [n, onGenerateSolution]);
  
  // 更新当前时间线
  useEffect(() => {
    if (state.timeline && state.timeline.length > 0 && state.currentStep < state.timeline.length) {
      console.log("更新时间线, 当前步骤:", state.currentStep, "总步骤:", state.totalSteps);
      setCurrentTimeline(state.timeline[state.currentStep]);
    } else {
      setCurrentTimeline(null);
    }
  }, [state.timeline, state.currentStep, state.totalSteps]);
  
  // 控制按钮处理函数
  const handlePlayPause = () => {
    console.log("播放/暂停按钮点击");
    dispatch(playPause());
  };
  
  const handleReset = () => {
    console.log("重置按钮点击");
    dispatch(resetAnimation());
  };
  
  const handlePreviousStep = () => {
    if (state.currentStep > 0) {
      console.log("上一步按钮点击");
      dispatch(setCurrentStep(state.currentStep - 1));
      // 如果正在播放，则暂停
      if (state.isPlaying) {
        dispatch(playPause());
      }
    }
  };
  
  const handleNextStep = () => {
    if (state.currentStep < state.totalSteps - 1) {
      console.log("下一步按钮点击");
      dispatch(setCurrentStep(state.currentStep + 1));
      // 如果正在播放，则暂停
      if (state.isPlaying) {
        dispatch(playPause());
      }
    }
  };
  
  const handleStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const step = parseInt(e.target.value, 10);
    console.log("步骤变更:", step);
    dispatch(setCurrentStep(step));
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseFloat(e.target.value);
    console.log("速度变更:", speed);
    dispatch(setPlaybackSpeed(speed));
  };
  
  // 计算进度百分比
  const progressPercent = state.totalSteps > 0 
    ? ((state.currentStep + 1) / state.totalSteps) * 100 
    : 0;
  
  // 添加调试信息
  console.log("渲染DynamicProgrammingVisualizer:", {
    currentStep: state.currentStep,
    stepStatuses: state.stepStatuses?.length,
    values: state.values?.length,
    hasTimeline: !!currentTimeline
  });
  
  return (
    <VisualizerContainer>
      <ProgressBar>
        <Progress percent={progressPercent} />
      </ProgressBar>
      
      <GuidePanel showingGuide={showingGuide} setShowingGuide={setShowingGuide} />
      
      <VisualizationArea>
        <StairsArea>
          <AnimatedClimber 
            n={n}
            currentStep={state.currentStep}
            stepStatuses={state.stepStatuses}
            values={state.values}
            currentTimeline={currentTimeline}
            width={400}
            height={300}
          />
          <StairsComponent 
            n={n}
            currentStep={state.currentStep}
            stepStatuses={state.stepStatuses || []}
            values={state.values || []}
          />
        </StairsArea>
        
        <ExplanationArea>
          <PathDiagramComponent 
            n={n}
            state={state}
            currentTimeline={currentTimeline}
          />
          
          {currentTimeline && (
            <StepExplanation
              currentStep={state.currentStep}
              totalSteps={state.totalSteps}
              description={getSimplifiedDescription(currentTimeline, state.values, state.stepStatuses)}
              formula={currentTimeline.visualChanges.formulaUpdate || undefined}
              code={currentTimeline.code || undefined}
            />
          )}
          
          <ControlPanel 
            state={state}
            dispatch={dispatch}
            onReset={handleReset}
            onPlayPause={handlePlayPause}
            onPreviousStep={handlePreviousStep}
            onNextStep={handleNextStep}
            onStepChange={handleStepChange}
            onSpeedChange={handleSpeedChange}
          />
        </ExplanationArea>
      </VisualizationArea>
    </VisualizerContainer>
  );
};

export default DynamicProgrammingVisualizer; 