import styled from 'styled-components';

// 引导面板样式
export const GuidePanelContainer = styled.div<{ showing: boolean }>`
  background-color: #E8F5E9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  position: relative;
  border-left: 4px solid #4CAF50;
  transition: all 0.3s ease;
  max-height: ${props => props.showing ? '1000px' : '0'};
  overflow: ${props => props.showing ? 'visible' : 'hidden'};
  opacity: ${props => props.showing ? 1 : 0};
  padding: ${props => props.showing ? '15px' : '0'};
  margin: ${props => props.showing ? '0 0 20px 0' : '0'};
`;

export const CloseGuideButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #757575;
  
  &:hover {
    color: #D32F2F;
  }
`;

export const GuideTitle = styled.h3`
  color: #2E7D32;
  margin-top: 0;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

export const GuideContent = styled.div`
  font-size: 14px;
  color: #424242;
  line-height: 1.5;
`;

export const GuideStep = styled.div`
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const StepNumber = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #4CAF50;
  color: white;
  text-align: center;
  line-height: 24px;
  margin-right: 8px;
  font-weight: bold;
  font-size: 12px;
`;

export const StepText = styled.span`
  font-weight: 500;
`; 