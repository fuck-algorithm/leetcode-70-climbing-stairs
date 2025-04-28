import styled from 'styled-components';

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

export const ControlButton = styled.button<{ disabled?: boolean, primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background-color: ${props => props.disabled 
    ? '#E0E0E0' 
    : props.primary 
      ? '#2196F3' 
      : '#F5F5F5'};
  color: ${props => props.disabled 
    ? '#9E9E9E' 
    : props.primary 
      ? 'white' 
      : '#424242'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.disabled 
      ? '#E0E0E0' 
      : props.primary 
        ? '#1976D2' 
        : '#EEEEEE'};
  }
`;

export const PlayButton = styled(ControlButton)<{ isPlaying: boolean }>`
  background-color: ${props => props.isPlaying ? '#4CAF50' : '#2196F3'};
  
  &:hover {
    background-color: ${props => props.isPlaying ? '#43A047' : '#1976D2'};
  }
`; 