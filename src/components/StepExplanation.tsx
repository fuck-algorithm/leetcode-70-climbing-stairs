import React from 'react';
import styled from 'styled-components';

// 解释组件容器
const ExplanationContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border-left: 4px solid #2196F3;
  max-width: 800px;
  width: 100%;
  transition: all 0.3s ease;
`;

// 步骤标题样式
const StepTitle = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  color: #1976D2;
`;

// 步骤计数器样式
const StepCounter = styled.div`
  background-color: #2196F3;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(33, 150, 243, 0.3);
`;

// 解释内容容器
const ExplanationContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin-left: 34px; // 与步骤计数器对齐
`;

interface StepExplanationProps {
  currentStep: number;
  totalSteps: number;
  description: string;
  code?: string;
  formula?: string;
}

const StepExplanation: React.FC<StepExplanationProps> = ({ 
  currentStep, 
  totalSteps, 
  description,
  code, 
  formula 
}) => {
  return (
    <ExplanationContainer>
      <StepTitle>
        <StepCounter>{currentStep + 1}</StepCounter>
        {description}
      </StepTitle>
      
      <ExplanationContent>
        {formula && (
          <div style={{ 
            fontFamily: 'Cambria Math, Times New Roman, serif',
            backgroundColor: '#E3F2FD',
            padding: '8px 12px',
            borderRadius: '4px',
            margin: '10px 0',
            fontSize: '16px',
            textAlign: 'center',
            borderLeft: '3px solid #90CAF9'
          }}>
            {formula}
          </div>
        )}
        
        {code && (
          <pre style={{
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            padding: '10px',
            margin: '10px 0',
            fontFamily: 'Source Code Pro, monospace',
            fontSize: '13px',
            overflowX: 'auto',
            borderLeft: '3px solid #2196F3'
          }}>
            {code}
          </pre>
        )}
      </ExplanationContent>
    </ExplanationContainer>
  );
};

export default StepExplanation; 