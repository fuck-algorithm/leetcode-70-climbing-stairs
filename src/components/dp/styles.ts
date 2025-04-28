import styled from 'styled-components';
import { ClimberPosition } from './types';

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

// 控制面板样式
export const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #FAFAFA;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-top: 10px;
  width: 100%;
`;

export const ButtonsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

export const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
`;

export const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span {
    font-size: 14px;
    color: #424242;
    font-weight: 500;
  }
  
  small {
    color: #757575;
    font-size: 12px;
    font-weight: 500;
  }
`;

export const StepSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 4px;
  background: #E0E0E0;
  outline: none;
  margin: 5px 0;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #2196F3;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #1976D2;
      transform: scale(1.2);
    }
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #2196F3;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    
    &:hover {
      background: #1976D2;
      transform: scale(1.2);
    }
  }
`;

export const SpeedSlider = styled(StepSlider)`
  &::-webkit-slider-thumb {
    background: #FF9800;
    
    &:hover {
      background: #F57C00;
    }
  }
  
  &::-moz-range-thumb {
    background: #FF9800;
    
    &:hover {
      background: #F57C00;
    }
  }
`;

// 控制按钮基础样式
export const ControlButton = styled.button`
  background-color: #F5F5F5;
  color: #424242;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #E0E0E0;
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background-color: #EEEEEE;
    color: #BDBDBD;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// 播放/暂停按钮样式
export const PlayButton = styled(ControlButton)<{ isPlaying: boolean; primary?: boolean }>`
  background-color: ${props => props.primary ? '#4CAF50' : '#F5F5F5'};
  color: ${props => props.primary ? 'white' : '#424242'};
  min-width: 80px;
  position: relative;
  padding-left: ${props => props.isPlaying ? '16px' : '22px'};
  
  &:before {
    content: '';
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: ${props => props.isPlaying ? '6px' : '0'};
    height: ${props => props.isPlaying ? '6px' : '0'};
    border-style: solid;
    border-width: ${props => props.isPlaying ? '0 2px' : '5px 0 5px 8px'};
    border-color: ${props => props.isPlaying ? 'transparent white' : 'transparent transparent transparent white'};
  }
  
  &:hover {
    background-color: ${props => props.primary ? '#388E3C' : '#E0E0E0'};
  }
  
  &:disabled {
    background-color: ${props => props.primary ? '#A5D6A7' : '#EEEEEE'};
    color: ${props => props.primary ? '#E8F5E9' : '#BDBDBD'};
  }
`; 