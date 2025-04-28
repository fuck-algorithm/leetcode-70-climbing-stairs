import React, { useMemo } from 'react';
import { PathDiagramProps } from './types';
import {
  PathDiagram,
  StairStep,
  StairLabel,
  StairValue,
  ClimbingPath,
  PathLabel,
  StairLine,
  ActionIndicator,
  ClimberIcon,
  ClimberPath,
  GuideTitle
} from './path-styles';
import { useClimberPosition } from './hooks/useClimberPosition';

const PathDiagramComponent: React.FC<PathDiagramProps> = ({ n, state, currentTimeline }) => {
  if (!state.values || state.values.length === 0) return null;
  
  // 使用钩子获取小人位置和状态
  const { climberPosition, climberEmoji, actionText, currentCalcIndex } = useClimberPosition(state, currentTimeline);
  console.log('PathDiagram渲染, 当前计算阶梯:', currentCalcIndex);
  
  // 创建要显示的楼梯步骤
  const stepsToShow = useMemo(() => {
    const steps = [];
    const maxStepsToShow = Math.min(n, 6); // 限制显示的最大阶梯数
    
    for (let i = maxStepsToShow; i >= 0; i--) {
      const isPreviousToCurrentCalc = i === currentCalcIndex - 1;
      const isPreviousTwoToCurrentCalc = i === currentCalcIndex - 2;
      const isCurrentStep = i === currentCalcIndex;
      
      // 确定每个阶梯的状态样式
      const stepStatus = state.stepStatuses?.[i] || 'uncalculated';
      const stepValue = state.values?.[i] !== undefined ? `${state.values[i]}种方法` : '未计算';
      
      steps.push(
        <div key={i} style={{ position: 'relative', marginBottom: '15px' }}>
          <StairStep 
            active={stepStatus === 'calculated'} 
            current={isCurrentStep}
          >
            <StairLabel>第{i}阶:</StairLabel>
            <StairValue highlight={isCurrentStep}>
              {stepValue}
            </StairValue>
            
            {/* 显示爬1阶路径 - 当前阶梯和前一阶梯之间 */}
            {isCurrentStep && isPreviousToCurrentCalc && (
              <ClimbingPath type="one" active={true}>
                <PathLabel active={true}>爬1阶</PathLabel>
              </ClimbingPath>
            )}
            
            {/* 显示爬2阶路径 - 当前阶梯和前两阶梯之间 */}
            {isCurrentStep && isPreviousTwoToCurrentCalc && (
              <ClimbingPath type="two" active={true}>
                <PathLabel active={true}>爬2阶</PathLabel>
              </ClimbingPath>
            )}
            
            {/* 增加更明显的阶梯线 */}
            <StairLine style={{ bottom: '15px', height: '3px' }} />
          </StairStep>
          
          {/* 添加动作指示器 */}
          {i === currentCalcIndex - 1 && climberPosition === 'step1' && (
            <ActionIndicator 
              show={true}
              style={{ 
                bottom: '40px', 
                backgroundColor: '#E3F2FD', 
                border: '2px solid #2196F3',
                fontWeight: 'bold'
              }}
            >
              {actionText}
            </ActionIndicator>
          )}
          
          {i === currentCalcIndex - 2 && climberPosition === 'step2' && (
            <ActionIndicator 
              show={true}
              style={{ 
                bottom: '40px', 
                backgroundColor: '#F3E5F5', 
                border: '2px solid #9C27B0',
                fontWeight: 'bold'
              }}
            >
              {actionText}
            </ActionIndicator>
          )}
        </div>
      );
    }
    
    return steps;
  }, [n, state.values, state.stepStatuses, currentCalcIndex, climberPosition, actionText]);
  
  return (
    <PathDiagram>
      <GuideTitle>
        楼梯爬法可视化 
        <span style={{ 
          fontSize: '12px', 
          color: '#FF5722', 
          fontWeight: 'bold',
          backgroundColor: '#FFF3E0',
          padding: '2px 8px',
          borderRadius: '10px',
          marginLeft: '8px'
        }}>
          （👀 观察小人如何爬楼梯！）
        </span>
      </GuideTitle>
      
      {/* 添加容器并设置更清晰的背景和边框 */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#FAFAFA', 
        borderRadius: '8px',
        border: '1px solid #E0E0E0',
        position: 'relative'
      }}>
        {stepsToShow}
        
        {/* 添加小人轨迹线 - 更明显的线条 */}
        {climberPosition === 'step1' && <ClimberPath position="step1" />}
        {climberPosition === 'step2' && <ClimberPath position="step2" />}
        
        {/* 更大、更明显的小人图标 */}
        <ClimberIcon 
          position={climberPosition}
          style={{ 
            fontSize: '24px',
            filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))'
          }}
        >
          {climberEmoji}
        </ClimberIcon>
      </div>
    </PathDiagram>
  );
};

export default PathDiagramComponent; 