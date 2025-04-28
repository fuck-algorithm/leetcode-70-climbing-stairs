import React from 'react';
import { GuidePanelProps } from './types';
import { 
  GuidePanelContainer, 
  CloseGuideButton, 
  GuideTitle, 
  GuideContent,
  GuideStep,
  StepNumber,
  StepText
} from './styles/guide-panel';

const GuidePanel: React.FC<GuidePanelProps> = ({ showingGuide, setShowingGuide }) => {
  const toggleGuide = () => {
    setShowingGuide(!showingGuide);
  };
  
  return (
    <GuidePanelContainer showing={showingGuide}>
      <CloseGuideButton onClick={toggleGuide}>×</CloseGuideButton>
      <GuideTitle>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#2E7D32">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
        动态规划爬楼梯解法指南
      </GuideTitle>
      <GuideContent>
        <GuideStep>
          <StepNumber>1</StepNumber>
          <StepText>使用控制面板的播放按钮可以自动播放整个算法过程</StepText>
        </GuideStep>
        <GuideStep>
          <StepNumber>2</StepNumber>
          <StepText>或者使用"上一步"/"下一步"按钮手动控制演示进度</StepText>
        </GuideStep>
        <GuideStep>
          <StepNumber>3</StepNumber>
          <StepText>观察小人如何爬1阶或2阶到达每个阶梯，理解动态规划的状态转移</StepText>
        </GuideStep>
        <GuideStep>
          <StepNumber>4</StepNumber>
          <StepText>注意每个阶梯显示的数字，表示到达该阶梯的不同方法数量</StepText>
        </GuideStep>
        <GuideStep>
          <StepNumber>5</StepNumber>
          <StepText>右侧的代码和公式展示了当前步骤的关键计算过程</StepText>
        </GuideStep>
      </GuideContent>
    </GuidePanelContainer>
  );
};

export default GuidePanel; 