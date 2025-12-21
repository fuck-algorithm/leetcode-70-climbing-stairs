import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AnimationState, AnimationTimeline } from '../state/animationSlice';

// 主容器 - 使用蓝色主题
const VisualizerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  padding: 20px;
  overflow: auto;
  background: radial-gradient(circle at 50% 50%, rgba(227, 242, 253, 0.3), rgba(187, 222, 251, 0.1));
`;

// 算法步骤区域
const StepSection = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 矩阵外容器 - 提供3D效果
const Matrix3DContainer = styled.div<{ active?: boolean }>`
  perspective: 1000px;
  margin: 15px;
  transform-style: preserve-3d;
  transition: all 0.5s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  
  ${props => props.active && `
    filter: drop-shadow(0 8px 16px rgba(33, 150, 243, 0.4));
    transform: scale(1.05);
  `}
`;

// 矩阵容器 - 使用蓝色
const MatrixWrapper = styled.div<{ isPowered?: boolean; power?: number }>`
  display: inline-grid;
  grid-template-columns: repeat(2, 50px);
  grid-template-rows: repeat(2, 50px);
  gap: 2px;
  padding: 10px;
  border-radius: 8px;
  background-color: ${props => props.isPowered ? '#1976D2' : '#42A5F5'};
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(10deg) rotateY(-5deg);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    transform: rotateX(5deg) rotateY(0deg);
  }
  
  &:before {
    content: ${props => props.isPowered ? `"M^${props.power}"` : '"M"'};
    position: absolute;
    top: -25px;
    left: 0;
    font-size: 16px;
    font-weight: bold;
    color: #1565C0;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }
`;

// 矩阵单元格
const MatrixCell = styled.div<{ highlight?: boolean; calculating?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${props => props.highlight ? '#BBDEFB' : 'white'};
  border-radius: 4px;
  font-weight: ${props => props.highlight ? 'bold' : 'normal'};
  font-size: 16px;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.calculating && `
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.2), transparent);
      animation: calculating 1.5s infinite;
    }
    
    @keyframes calculating {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `}
`;

// 二进制表示区域
const BinarySection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  width: 100%;
  max-width: 600px;
`;

// 二进制位容器
const BinaryContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0;
  width: 100%;
`;

// 单个二进制位 - 使用蓝色
const BinaryBit = styled.div<{ active?: boolean; index: number }>`
  width: 40px;
  height: 40px;
  margin: 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.active ? '#1976D2' : '#E0E0E0'};
  color: ${props => props.active ? 'white' : '#616161'};
  border-radius: 50%;
  font-weight: bold;
  font-size: 16px;
  box-shadow: ${props => props.active ? '0 4px 8px rgba(33, 150, 243, 0.4)' : '0 2px 4px rgba(0,0,0,0.1)'};
  transition: all 0.3s ease;
  position: relative;
  
  &:after {
    content: '2^${props => props.index}';
    position: absolute;
    bottom: -20px;
    font-size: 12px;
    color: #9E9E9E;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.active ? '0 6px 12px rgba(33, 150, 243, 0.5)' : '0 4px 8px rgba(0,0,0,0.2)'};
  }
`;

// 矩阵乘法区域
const MatrixMultiplicationArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  width: 100%;
`;

// 乘法操作符
const OperatorSign = styled.div`
  font-size: 24px;
  margin: 0 15px;
  color: #1565C0;
  font-weight: bold;
`;

// 结果箭头
const ResultArrow = styled.div`
  width: 50px;
  height: 30px;
  margin: 0 10px;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: #1565C0;
    transform: translateY(-50%);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    width: 12px;
    height: 12px;
    border-top: 4px solid #1565C0;
    border-right: 4px solid #1565C0;
    transform: translateY(-50%) rotate(45deg);
  }
`;

// 说明面板
const ExplanationPanel = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 15px;
  margin: 20px 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: left;
`;

// 步骤标题
const StepTitle = styled.h3`
  font-size: 18px;
  color: #1565C0;
  margin-bottom: 10px;
`;

// 步骤描述
const StepDescription = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #616161;
`;

// 代码块
const CodeBlock = styled.pre`
  background-color: #F5F5F5;
  padding: 10px;
  border-radius: 4px;
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  overflow-x: auto;
  margin: 10px 0;
`;

// 进度条
const ProgressIndicator = styled.div`
  width: 100%;
  max-width: 800px;
  height: 6px;
  background-color: #E0E0E0;
  border-radius: 3px;
  margin-bottom: 30px;
  overflow: hidden;
`;

const Progress = styled.div<{ percent: number }>`
  height: 100%;
  width: ${props => props.percent}%;
  background-color: #2196F3;
  border-radius: 3px;
  transition: width 0.3s ease;
`;

interface MatrixFastPowerProps {
  n: number;
  state: AnimationState;
  currentTimeline: AnimationTimeline | null;
}

const MatrixFastPower: React.FC<MatrixFastPowerProps> = ({ n, state, currentTimeline }) => {
  // 基础矩阵 [[1,1],[1,0]]
  const baseMatrix = [[1, 1], [1, 0]];
  
  // 二进制展示
  const [binaryBits, setBinaryBits] = useState<number[]>([]);
  
  // 计算过程中的矩阵
  const [intermediateMatrix, setIntermediateMatrix] = useState<number[][]>(baseMatrix);
  
  // 结果矩阵
  const [resultMatrix, setResultMatrix] = useState<number[][]>([[1, 0], [0, 1]]);
  
  // 计算进度百分比
  const progressPercent = state.totalSteps > 0 
    ? ((state.currentStep + 1) / state.totalSteps) * 100 
    : 0;
  
  // 每当n改变时，更新二进制位
  useEffect(() => {
    // 将n转换为二进制字符串，去掉前缀'0b'
    const binaryStr = n.toString(2);
    
    // 将每一位转换为数字
    const bits = binaryStr.split('').map(bit => parseInt(bit, 10));
    
    setBinaryBits(bits);
  }, [n]);
  
  // 根据当前步骤更新显示
  useEffect(() => {
    if (currentTimeline) {
      // 可以根据currentTimeline.visualChanges更新矩阵状态
      // 这里简单模拟一下
      if (state.currentStep > 0) {
        // 假设步骤对应一些矩阵计算过程
        const step = state.currentStep;
        if (step % 3 === 0) {
          // 更新中间矩阵
          const power = Math.floor(step / 3) + 1;
          const newMatrix = matrixPower(baseMatrix, Math.pow(2, power - 1));
          setIntermediateMatrix(newMatrix);
        } else if (step % 3 === 1) {
          // 中间计算步骤
        } else {
          // 更新结果矩阵
          const power = Math.floor(step / 3);
          if (power < binaryBits.length && binaryBits[binaryBits.length - 1 - power] === 1) {
            setResultMatrix(prev => matrixMultiply(prev, intermediateMatrix));
          }
        }
      }
    }
  }, [state.currentStep, currentTimeline, binaryBits, baseMatrix, intermediateMatrix]);
  
  // 辅助函数：矩阵乘法
  const matrixMultiply = (a: number[][], b: number[][]) => {
    const result = [
      [0, 0],
      [0, 0]
    ];
    
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 2; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    
    return result;
  };
  
  // 辅助函数：矩阵快速幂
  const matrixPower = (matrix: number[][], power: number): number[][] => {
    if (power === 0) {
      return [[1, 0], [0, 1]]; // 单位矩阵
    }
    
    if (power === 1) {
      return matrix;
    }
    
    const halfPower = Math.floor(power / 2);
    const halfResult = matrixPower(matrix, halfPower);
    
    let result = matrixMultiply(halfResult, halfResult);
    
    if (power % 2 === 1) {
      result = matrixMultiply(result, matrix);
    }
    
    return result;
  };
  
  // 渲染矩阵
  const renderMatrix = (matrix: number[][], isPowered: boolean = false, power: number = 0, isHighlighted: boolean = false) => {
    return (
      <Matrix3DContainer active={isHighlighted}>
        <MatrixWrapper isPowered={isPowered} power={power}>
          {matrix.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <MatrixCell 
                key={`${rowIndex}-${colIndex}`} 
                highlight={isHighlighted && rowIndex === colIndex && rowIndex === 0}
                calculating={isHighlighted && state.isPlaying}
              >
                {cell}
              </MatrixCell>
            ))
          )}
        </MatrixWrapper>
      </Matrix3DContainer>
    );
  };
  
  // 渲染二进制表示
  const renderBinaryRepresentation = () => {
    return (
      <BinarySection>
        <StepTitle>二进制拆分: {n} = {binaryBits.join('')}<sub>2</sub></StepTitle>
        <BinaryContainer>
          {binaryBits.map((bit, index) => (
            <BinaryBit 
              key={index} 
              active={bit === 1} 
              index={binaryBits.length - 1 - index}
            >
              {bit}
            </BinaryBit>
          ))}
        </BinaryContainer>
      </BinarySection>
    );
  };
  
  return (
    <VisualizerContainer>
      {/* 进度指示器 */}
      <ProgressIndicator>
        <Progress percent={progressPercent} />
      </ProgressIndicator>
      
      {/* 标题和步骤说明 */}
      <StepTitle>矩阵快速幂解法 - 爬楼梯问题</StepTitle>
      
      {/* 当前步骤说明 */}
      {currentTimeline && (
        <ExplanationPanel>
          <StepTitle>{currentTimeline.description}</StepTitle>
          <StepDescription>
            {currentTimeline.explanation?.simple || "这是矩阵快速幂算法的一个步骤。"}
          </StepDescription>
          {currentTimeline.code && (
            <CodeBlock>{currentTimeline.code}</CodeBlock>
          )}
        </ExplanationPanel>
      )}
      
      {/* 二进制表示 */}
      {renderBinaryRepresentation()}
      
      {/* 矩阵计算区域 */}
      <StepSection>
        <StepTitle>矩阵计算过程</StepTitle>
        
        <MatrixMultiplicationArea>
          {/* 基础矩阵 */}
          {renderMatrix(baseMatrix, false, 0, state.currentStep === 0)}
          
          {/* 中间计算矩阵 */}
          {state.currentStep > 0 && (
            <>
              <OperatorSign>→</OperatorSign>
              {renderMatrix(intermediateMatrix, true, Math.pow(2, Math.floor(state.currentStep / 3)), 
                state.currentStep % 3 === 0)}
            </>
          )}
          
          {/* 结果矩阵 */}
          {state.currentStep > 1 && (
            <>
              <ResultArrow />
              {renderMatrix(resultMatrix, true, n, state.currentStep % 3 === 2)}
            </>
          )}
        </MatrixMultiplicationArea>
        
        {/* 矩阵解释 */}
        <StepDescription>
          矩阵 M = [[1,1],[1,0]] 的 {n} 次幂的 [0,0] 位置元素即为 F({n+1})，
          也就是爬到第 {n} 阶楼梯的方法数。
        </StepDescription>
      </StepSection>
    </VisualizerContainer>
  );
};

export default MatrixFastPower;