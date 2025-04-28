import styled from 'styled-components';

// 容器样式
export const VisualizerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const VisualizationArea = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding: 20px;
  gap: 20px;
  
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const StairsArea = styled.div`
  flex: 1;
  min-width: 320px;
  border-radius: 8px;
  background-color: #FAFAFA;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ExplanationArea = styled.div`
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// 进度条样式
export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: #E0E0E0;
  position: relative;
  margin-bottom: 10px;
`;

export const Progress = styled.div<{ percent: number }>`
  height: 100%;
  background-color: #4CAF50;
  width: ${props => `${props.percent}%`};
  transition: width 0.3s ease;
  border-radius: 0 3px 3px 0;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    right: 0;
    top: -2px;
    width: 10px;
    height: 10px;
    background-color: #4CAF50;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
    display: ${props => props.percent > 0 ? 'block' : 'none'};
  }
`;

// 动画区域
export const AnimationArea = styled.div`
  display: flex;
  width: 100%;
  height: 550px;
  position: relative;
  background-color: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 5px;
`;

// 步骤描述
export const StepDescription = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  font-size: 14px;
  color: #333;
  z-index: 10;
`;

// 详细解释面板
export const ExplanationPanel = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(249, 249, 249, 0.95);
  border-left: 3px solid #3498db;
  border-radius: 0 4px 4px 0;
  
  h4 {
    margin-top: 0;
    margin-bottom: 8px;
    color: #2980b9;
    font-size: 14px;
  }
  
  p {
    margin: 0 0 8px 0;
    font-size: 13px;
    line-height: 1.5;
    white-space: pre-line;
  }
`;

// 公式显示
export const FormulaText = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-family: "Courier New", monospace;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 10;
`; 