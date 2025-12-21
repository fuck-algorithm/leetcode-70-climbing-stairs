import React, { useEffect, useState, useRef } from 'react';
import { setAnimationState } from '../../state/animationSlice';
import { generateDPSolution } from '../../algorithms/dpAlgorithm';
import AnimatedClimber from './AnimatedClimber';
import styled from 'styled-components';
import ControlPanel from './ControlPanel';
import { useControlHandlers } from './hooks/useControlHandlers';
import { 
  VisualizerContainer, 
  ProgressBar, 
  Progress, 
  AnimationArea,
  StepDescription,
  FormulaText,
  ExplanationPanel
} from './styles/layout';

interface SimpleDPVisualizerProps {
  n: number;
  state: any;
  onGenerateSolution: (data: any) => void;
  dispatch: (action: any) => void;
}

const SimpleDPVisualizer: React.FC<SimpleDPVisualizerProps> = ({
  n,
  state,
  onGenerateSolution,
  dispatch
}) => {
  // 显示详细解释开关
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false);
  // 记录上一次的步骤，用于检测步骤变化
  const lastStepRef = useRef<number>(state.currentStep);
  const [forceUpdate, setForceUpdate] = useState(0); // 添加强制更新状态
  
  // 生成解决方案
  useEffect(() => {
    if (n > 0) {
      console.log("生成DP解决方案，n =", n);
      try {
      const solution = generateDPSolution(n);
      console.log("生成的解决方案:", solution);
      console.log("步骤状态数组:", solution.stepsData.stepStatuses);
      console.log("值数组:", solution.stepsData.values);
        console.log("时间线长度:", solution.timeline.length);
        
        // 检查时间线是否为空
        if (!solution.timeline || solution.timeline.length === 0) {
          console.error("警告：生成的时间线为空！");
        }
        
      onGenerateSolution(solution);
      } catch (error) {
        console.error("生成DP解决方案时发生错误:", error);
      }
    }
  }, [n, onGenerateSolution]);

  // 监听步骤变化，确保停止任何正在进行的动画并触发更新
  useEffect(() => {
    if (state.currentStep !== lastStepRef.current) {
      console.log(`步骤变化: ${lastStepRef.current} -> ${state.currentStep}，重置动画状态`);
      
      // 强制重置所有动画状态
      // 1. 停止动画
      dispatch(setAnimationState({ animationInProgress: false }));
      
      // 2. 确保没有残留的动画状态 - 通过自定义动作
      dispatch({ 
        type: 'animation/resetAllAnimations', 
        payload: {} 
      });
      
      // 3. 强制执行一次额外的状态重置，防止任何状态残留
      setTimeout(() => {
        dispatch(setAnimationState({ animationInProgress: false }));
        // 添加强制重新渲染触发器
        setForceUpdate(prev => prev + 1);
      }, 0);
      
      // 更新上一步的引用
      lastStepRef.current = state.currentStep;
    }
  }, [state.currentStep, dispatch]);

  // 新增：监听当前时间线变化以强制更新小人位置
  useEffect(() => {
    // 当时间线发生变化时，强制触发一次更新
    setForceUpdate(prev => prev + 1);
    console.log("当前时间线变化，强制更新小人位置");
  }, [state.timeline, state.currentStep]);

  // 计算进度百分比
  const progressPercent = state.totalSteps > 0 
    ? ((state.currentStep + 1) / state.totalSteps) * 100 
    : 0;

  // 获取当前时间线
  const currentTimeline = state.timeline && state.timeline.length > 0 && state.currentStep < state.timeline.length
    ? state.timeline[state.currentStep]
    : null;
    
  console.log("SimpleDPVisualizer 当前状态:", {
    currentStep: state.currentStep,
    totalSteps: state.totalSteps,
    timelineLength: state.timeline?.length,
    stepStatuses: state.stepStatuses?.length,
    values: state.values?.length,
    hasTimeline: !!currentTimeline,
    forceUpdate: forceUpdate // 添加日志输出
  });

  // 使用控制处理钩子
  const {
    handlePlayPause,
    handleReset,
    handlePreviousStep,
    handleNextStep,
    handleStepChange,
    handleSpeedChange
  } = useControlHandlers(state, dispatch);

  // 切换详细解释
  const toggleDetailedExplanation = () => {
    setShowDetailedExplanation(!showDetailedExplanation);
  };

  return (
    <VisualizerContainer>
      <ProgressBar>
        <Progress percent={progressPercent} />
      </ProgressBar>
      
      <AnimationArea>
        <AnimatedClimber
          n={n}
          currentStep={state.currentStep}
          values={state.values}
          stepStatuses={state.stepStatuses}
          currentTimeline={currentTimeline}
          width={800}
          height={550}
          animationInProgress={state.animationInProgress}
          setAnimationInProgress={(inProgress) => dispatch(setAnimationState({ animationInProgress: inProgress }))}
          key={`climber-${state.currentStep}-${forceUpdate}`} // 添加key以强制重新渲染
        />
        
        {/* 在动画区域内直接显示步骤描述 */}
        {currentTimeline && (
          <>
            <StepDescription>
              <strong>{currentTimeline.description}</strong>
              <ToggleButton onClick={toggleDetailedExplanation}>
                {showDetailedExplanation ? '收起详细解释' : '查看详细解释'} ▼
              </ToggleButton>
              {showDetailedExplanation && currentTimeline.explanation && (
                <ExplanationPanel>
                  <h4>详细解释</h4>
                  <p>{currentTimeline.explanation.detailed}</p>
                  {currentTimeline.code && (
                    <CodeSnippet>
                      {currentTimeline.code}
                    </CodeSnippet>
                  )}
                </ExplanationPanel>
              )}
            </StepDescription>
            
            {currentTimeline.visualChanges.formulaUpdate && (
              <FormulaText>
                {currentTimeline.visualChanges.formulaUpdate}
              </FormulaText>
            )}
          </>
        )}
      </AnimationArea>

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
    </VisualizerContainer>
  );
};

// 切换按钮样式
const ToggleButton = styled.button`
  background: transparent;
  border: 1px solid #3498db;
  border-radius: 4px;
  color: #3498db;
  padding: 3px 8px;
  font-size: 12px;
  margin-left: 10px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #3498db;
    color: white;
  }
`;

// 代码片段样式
const CodeSnippet = styled.pre`
  background: #282c34;
  color: #abb2bf;
  padding: 10px;
  border-radius: 4px;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  overflow-x: auto;
  margin-top: 10px;
`;

export default SimpleDPVisualizer; 