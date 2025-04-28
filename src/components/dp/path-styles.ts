import styled from 'styled-components';
import { ClimberPosition } from './types';

// 路径图整体容器
export const PathDiagram = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: relative;
`;

// 阶梯步骤容器
export const StairStep = styled.div<{ active: boolean; current: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 5px;
  position: relative;
  background-color: ${(props) => 
    props.current ? '#FFF9C4' : 
    props.active ? '#E8F5E9' : '#F5F5F5'};
  border: 2px solid ${(props) => 
    props.current ? '#FFC107' : 
    props.active ? '#4CAF50' : '#E0E0E0'};
  box-shadow: ${(props) => props.current ? '0 0 8px rgba(255, 193, 7, 0.5)' : 'none'};
  transition: all 0.3s ease;
  min-height: 50px;
  z-index: ${(props) => props.current ? 2 : 1};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

// 阶梯标签
export const StairLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #424242;
  min-width: 50px;
`;

// 阶梯值
export const StairValue = styled.div<{ highlight: boolean }>`
  font-size: ${(props) => props.highlight ? '16px' : '14px'};
  font-weight: ${(props) => props.highlight ? '700' : '500'};
  color: ${(props) => props.highlight ? '#D32F2F' : '#757575'};
  padding: ${(props) => props.highlight ? '4px 8px' : '2px 4px'};
  background-color: ${(props) => props.highlight ? 'rgba(255, 235, 238, 0.8)' : 'transparent'};
  border-radius: 4px;
  transition: all 0.3s ease;
`;

// 爬行路径线
export const ClimbingPath = styled.div<{ type: 'one' | 'two'; active: boolean }>`
  position: absolute;
  width: ${(props) => props.type === 'one' ? '80px' : '150px'};
  height: 30px;
  bottom: 50%;
  right: ${(props) => props.type === 'one' ? 'calc(100% - 10px)' : 'calc(100% - 10px)'};
  border-bottom: ${(props) => props.type === 'one' 
    ? '4px dashed #2196F3' 
    : '4px dashed #9C27B0'};
  border-left: ${(props) => props.type === 'one' 
    ? '4px dashed #2196F3' 
    : '4px dashed #9C27B0'};
  border-bottom-left-radius: 10px;
  opacity: ${(props) => props.active ? 1 : 0.5};
  pointer-events: none;
  z-index: 3;
  
  &:after {
    content: '';
    position: absolute;
    right: -6px;
    bottom: -10px;
    width: 0;
    height: 0;
    border-left: 8px solid ${(props) => props.type === 'one' ? '#2196F3' : '#9C27B0'};
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    transform: rotate(-45deg);
  }
`;

// 路径标签
export const PathLabel = styled.div<{ active: boolean }>`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: ${(props) => props.active ? '#FFFFFF' : '#F5F5F5'};
  color: ${(props) => props.active ? '#333333' : '#9E9E9E'};
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  white-space: nowrap;
  z-index: 4;
`;

// 阶梯水平线
export const StairLine = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #BDBDBD;
`;

// 动作指示器
export const ActionIndicator = styled.div<{ show: boolean }>`
  position: absolute;
  right: -10px;
  bottom: 30px;
  background-color: #E3F2FD;
  color: #1565C0;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  white-space: nowrap;
  opacity: ${(props) => props.show ? 1 : 0};
  transform: ${(props) => props.show ? 'translateX(0)' : 'translateX(20px)'};
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 10;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -6px;
    right: 15px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid #E3F2FD;
  }
`;

// 小人图标
export const ClimberIcon = styled.div<{ position: ClimberPosition }>`
  position: absolute;
  left: ${(props) => {
    switch(props.position) {
      case 'bottom': return '20px';
      case 'step1': return 'calc(50% - 80px)';
      case 'step2': return 'calc(50% - 150px)';
      default: return '20px';
    }
  }};
  bottom: ${(props) => {
    switch(props.position) {
      case 'bottom': return '10px';
      case 'step1': return '70px';
      case 'step2': return '120px';
      default: return '10px';
    }
  }};
  font-size: 20px;
  z-index: 100;
  transition: all 0.5s ease;
  animation: bounce 1s infinite alternate;
  
  @keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-5px); }
  }
`;

// 小人路径
export const ClimberPath = styled.div<{ position: 'step1' | 'step2' }>`
  position: absolute;
  bottom: ${(props) => props.position === 'step1' ? '40px' : '80px'};
  left: 20px;
  width: ${(props) => props.position === 'step1' ? '100px' : '150px'};
  height: 50px;
  border-top: 3px ${(props) => props.position === 'step1' ? 'solid #2196F3' : 'solid #9C27B0'};
  border-right: 3px ${(props) => props.position === 'step1' ? 'solid #2196F3' : 'solid #9C27B0'};
  border-top-right-radius: 20px;
  z-index: 1;
  
  &:after {
    content: '';
    position: absolute;
    top: -8px;
    right: -2px;
    width: 0;
    height: 0;
    border-bottom: 8px solid ${(props) => props.position === 'step1' ? '#2196F3' : '#9C27B0'};
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    transform: rotate(90deg);
  }
`;

// 路径图标题
export const GuideTitle = styled.h3`
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
`; 