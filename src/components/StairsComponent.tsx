import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

// 楼梯容器，增强3D效果
const StairsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
  overflow: hidden;
  background: radial-gradient(circle at 50% 50%, rgba(250, 250, 250, 0.3) 0%, rgba(200, 200, 200, 0.1) 100%);
`;

// 楼梯包装器，负责3D旋转
const StairsWrapper = styled.div`
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(30deg) rotateY(-5deg);
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    transform: rotateX(35deg) rotateY(-8deg);
  }
`;

// 单个阶梯样式，增强3D质感和交互效果
interface StairStepProps {
  index: number;
  totalSteps: number;
  status: 'uncalculated' | 'calculating' | 'calculated';
  isCurrentStep: boolean;
}

const StairStep = styled.div<StairStepProps>`
  position: absolute;
  transform-style: preserve-3d;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  width: ${props => props.totalSteps <= 5 ? '160px' : props.totalSteps <= 10 ? '140px' : '120px'};
  height: ${props => props.totalSteps <= 5 ? '40px' : props.totalSteps <= 10 ? '30px' : '20px'};
  background-color: ${props => {
    if (props.isCurrentStep) return '#4CAF50';
    switch (props.status) {
      case 'calculated': return '#81C784';
      case 'calculating': return '#A5D6A7';
      default: return '#E0E0E0';
    }
  }};
  opacity: ${props => props.status === 'uncalculated' ? 0.7 : 1};
  box-shadow: ${props => 
    props.isCurrentStep 
      ? '0 0 20px #A5D6A7, 0 8px 20px rgba(0,0,0,0.4)' 
      : props.status === 'calculated'
        ? '0 0 15px rgba(129, 199, 132, 0.5), 0 8px 15px rgba(0,0,0,0.3)'
        : '0 8px 15px rgba(0,0,0,0.2)'
  };
  border: ${props => props.isCurrentStep ? '2px solid #A5D6A7' : 'none'};
  filter: ${props => props.isCurrentStep ? 'saturate(1.8) brightness(1.2)' : props.status === 'calculated' ? 'saturate(1.3)' : 'saturate(0.5)'};
  transform: ${props => `translateY(${-props.index * (props.totalSteps <= 5 ? 60 : props.totalSteps <= 10 ? 50 : 40)}px) translateZ(${props.index * 2}px)`};
  animation: ${props => props.isCurrentStep ? 'pulseBorder 1.5s infinite' : props.index < 3 ? 'none' : 'float 3s ease-in-out infinite'};
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: ${props => (props.totalSteps <= 5 ? 20 : props.totalSteps <= 10 ? 15 : 10)}px;
    background-color: ${props => {
      const baseColor = props.isCurrentStep ? '#4CAF50' : 
                       props.status === 'calculated' ? '#81C784' :
                       props.status === 'calculating' ? '#A5D6A7' : '#E0E0E0';
      // 侧面比正面暗30%
      return d3.color(baseColor)?.darker(0.8).toString() || baseColor;
    }};
    transform: translateY(100%) rotateX(-90deg);
    transform-origin: top;
    box-shadow: inset 0 -3px 8px rgba(0,0,0,0.2);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 100%;
    right: -20px;
    background-color: ${props => {
      const baseColor = props.isCurrentStep ? '#4CAF50' : 
                      props.status === 'calculated' ? '#81C784' :
                      props.status === 'calculating' ? '#A5D6A7' : '#E0E0E0';
      // 右侧面比正面暗20%
      return d3.color(baseColor)?.darker(0.5).toString() || baseColor;
    }};
    transform: rotateY(90deg);
    transform-origin: left;
    box-shadow: inset 3px 0 8px rgba(0,0,0,0.1);
  }
  
  @keyframes pulseBorder {
    0%, 100% { border-color: rgba(165, 214, 167, 0.7); box-shadow: 0 0 20px rgba(165, 214, 167, 0.5), 0 8px 20px rgba(0,0,0,0.4); }
    50% { border-color: rgba(165, 214, 167, 1); box-shadow: 0 0 30px rgba(165, 214, 167, 0.8), 0 8px 20px rgba(0,0,0,0.4); }
  }
  
  animation: ${props => props.isCurrentStep ? 'pulseBorder 1.5s infinite' : props.index < 3 ? 'none' : 'float 3s ease-in-out infinite'};
  
  &:hover {
    filter: brightness(1.1);
    z-index: 10;
  }
`;

// 优化的编号标签样式
const StepNumber = styled.div<{ isCurrentStep: boolean }>`
  position: absolute;
  left: -35px;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: ${props => props.isCurrentStep ? 'bold' : 'normal'};
  box-shadow: ${props => props.isCurrentStep ? '0 0 12px rgba(255, 255, 255, 0.8)' : '0 2px 5px rgba(0,0,0,0.3)'};
  text-shadow: ${props => props.isCurrentStep ? '0 0 3px white' : 'none'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.9);
  }
`;

// 增强计数器样式
const ValueCounter = styled.div<{ status: 'uncalculated' | 'calculating' | 'calculated', isCurrentStep: boolean }>`
  position: absolute;
  right: -35px;
  top: 50%;
  transform: translateY(-50%);
  background: ${props => {
    if (props.status === 'uncalculated') return 'radial-gradient(circle, #F5F5F5, #E0E0E0)';
    if (props.isCurrentStep) return 'radial-gradient(circle, #4CAF50, #2E7D32)';
    return 'radial-gradient(circle, #81C784, #43A047)';
  }};
  color: ${props => props.status === 'uncalculated' ? '#9E9E9E' : 'white'};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  border: 3px solid ${props => props.status === 'uncalculated' ? '#BDBDBD' : props.isCurrentStep ? '#2E7D32' : '#43A047'};
  box-shadow: 
    inset 0 0 8px rgba(0, 0, 0, 0.2),
    0 0 ${props => props.isCurrentStep ? '15px rgba(76, 175, 80, 0.7)' : '8px rgba(0, 0, 0, 0.2)'};
  transition: all 0.3s ease;
  animation: ${props => props.isCurrentStep ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% { transform: translateY(-50%) scale(1); }
    50% { transform: translateY(-50%) scale(1.08); }
    100% { transform: translateY(-50%) scale(1); }
  }
  
  &:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 
      inset 0 0 8px rgba(0, 0, 0, 0.2),
      0 0 ${props => props.isCurrentStep ? '20px rgba(76, 175, 80, 0.9)' : '12px rgba(0, 0, 0, 0.3)'};
  }
`;

// 增强目标标识样式
const TargetMarker = styled.div`
  position: absolute;
  width: 45px;
  height: 45px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: gold;
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
  animation: rotateStar 6s infinite linear, pulseStar 3s infinite ease-in-out;
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  @keyframes rotateStar {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
  
  @keyframes pulseStar {
    0%, 100% { transform: translate(-50%, -50%) scale(1); filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); }
    50% { transform: translate(-50%, -50%) scale(1.2); filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9)); }
  }
`;

// 路径箭头组件
const PathArrow = styled.div<{ type: 'one' | 'two' }>`
  position: absolute;
  left: ${props => props.type === 'one' ? '50%' : '30%'};
  bottom: 100%;
  width: 4px;
  height: ${props => props.type === 'one' ? '50px' : '80px'};
  background-color: ${props => props.type === 'one' ? '#2196F3' : '#FF9800'};
  opacity: 0.7;
  transform: translateX(-50%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    width: 12px;
    height: 12px;
    border-left: 4px solid ${props => props.type === 'one' ? '#2196F3' : '#FF9800'};
    border-top: 4px solid ${props => props.type === 'one' ? '#2196F3' : '#FF9800'};
  }
  
  &::after {
    content: '${props => props.type === 'one' ? '爬1阶' : '爬2阶'}';
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: ${props => props.type === 'one' ? '#2196F3' : '#FF9800'};
    background-color: rgba(255, 255, 255, 0.7);
    padding: 2px 5px;
    border-radius: 10px;
    font-size: 12px;
    white-space: nowrap;
  }
`;

// 单独定义Float动画组件
const floatAnimation = (index: number, totalSteps: number) => {
  const baseY = -index * (totalSteps <= 5 ? 60 : totalSteps <= 10 ? 50 : 40);
  const baseZ = index * 2;
  
  return `
    @keyframes float${index} {
      0%, 100% { transform: translateY(${baseY}px) translateZ(${baseZ}px); }
      50% { transform: translateY(${baseY - 5}px) translateZ(${baseZ}px); }
    }
  `;
};

interface StairsComponentProps {
  n: number;
  currentStep: number;
  stepStatuses: ('uncalculated' | 'calculating' | 'calculated')[];
  values: number[];
}

const StairsComponent: React.FC<StairsComponentProps> = ({ 
  n, 
  currentStep, 
  stepStatuses, 
  values 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 调整楼梯大小和位置
  useEffect(() => {
    if (containerRef.current) {
      // 适配容器大小的逻辑
      const container = containerRef.current;
      const wrapper = container.querySelector('[data-stairs-wrapper]') as HTMLElement;
      
      if (wrapper) {
        // 根据n调整3D透视效果
        const perspective = Math.min(1500, Math.max(800, 1000 + n * 50));
        container.style.perspective = `${perspective}px`;
        
        // 调整旋转角度使整个楼梯可见
        const rotateX = Math.min(45, Math.max(15, 30 - n * 0.5));
        const rotateY = Math.min(0, Math.max(-15, -5 - n * 0.2));
        wrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    }
  }, [containerRef, n]);
  
  // 渲染楼梯路径
  const renderPaths = (stepIndex: number) => {
    // 只为第3步及以上显示路径
    if (stepIndex < 3) return null;
    
    return (
      <>
        <PathArrow type="one" />
        <PathArrow type="two" />
      </>
    );
  };
  
  return (
    <StairsContainer ref={containerRef}>
      <StairsWrapper data-stairs-wrapper>
        {/* 起点平台（0阶） */}
        <StairStep 
          index={0}
          totalSteps={n}
          status={stepStatuses[0] || 'uncalculated'}
          isCurrentStep={currentStep === 0}
        >
          <StepNumber isCurrentStep={currentStep === 0}>0</StepNumber>
          <ValueCounter 
            status={stepStatuses[0] || 'uncalculated'} 
            isCurrentStep={currentStep === 0}
          >
            {values[0] || '?'}
          </ValueCounter>
        </StairStep>
        
        {/* 动态生成1至n阶楼梯 */}
        {Array.from({ length: n }).map((_, i) => {
          const stepIndex = i + 1; // 实际阶梯编号从1开始
          const isTargetStep = stepIndex === n;
          
          return (
            <StairStep 
              key={stepIndex}
              index={stepIndex}
              totalSteps={n}
              status={stepStatuses[stepIndex] || 'uncalculated'}
              isCurrentStep={currentStep === stepIndex}
            >
              <StepNumber isCurrentStep={currentStep === stepIndex}>{stepIndex}</StepNumber>
              <ValueCounter 
                status={stepStatuses[stepIndex] || 'uncalculated'} 
                isCurrentStep={currentStep === stepIndex}
              >
                {values[stepIndex] !== undefined ? values[stepIndex] : '?'}
              </ValueCounter>
              
              {/* 路径箭头 */}
              {renderPaths(stepIndex)}
              
              {/* 目标标识星标 */}
              {isTargetStep && (
                <TargetMarker>
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                  </svg>
                </TargetMarker>
              )}
            </StairStep>
          );
        })}
      </StairsWrapper>
    </StairsContainer>
  );
};

export default StairsComponent; 