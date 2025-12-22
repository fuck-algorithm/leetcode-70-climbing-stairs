import { useState, useEffect } from 'react';
import styled from 'styled-components';

interface DataInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
`;

const Label = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const NumberInput = styled.input`
  width: 60px;
  padding: 6px 10px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: #ddd;
  margin: 0 8px;
`;

const PresetLabel = styled.span`
  font-size: 13px;
  color: #666;
`;

const PresetButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
  padding: 4px 12px;
  border: 1px solid ${props => props.isActive ? '#4CAF50' : '#ddd'};
  background: ${props => props.isActive ? '#e8f5e9' : 'white'};
  color: ${props => props.isActive ? '#2e7d32' : '#666'};
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #4CAF50;
    background: #f1f8e9;
  }
`;

const RandomButton = styled.button`
  padding: 4px 12px;
  border: 1px solid #2196F3;
  background: white;
  color: #2196F3;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e3f2fd;
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const ErrorMessage = styled.span`
  color: #f44336;
  font-size: 12px;
  margin-left: 8px;
`;

const PRESETS = [2, 3, 5, 6, 10];

export default function DataInput({ value, onChange, min = 1, max = 45 }: DataInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [error, setError] = useState('');

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const validateAndUpdate = (newValue: string) => {
    setInputValue(newValue);
    setError('');

    if (newValue === '') {
      return;
    }

    const num = parseInt(newValue, 10);
    
    if (isNaN(num)) {
      setError('请输入有效数字');
      return;
    }
    
    if (num < min) {
      setError(`最小值为 ${min}`);
      return;
    }
    
    if (num > max) {
      setError(`最大值为 ${max}`);
      return;
    }
    
    onChange(num);
  };

  const handleBlur = () => {
    if (inputValue === '' || error) {
      setInputValue(value.toString());
      setError('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleRandom = () => {
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
    setInputValue(randomValue.toString());
    setError('');
    onChange(randomValue);
  };

  return (
    <InputContainer>
      <Label>楼梯阶数 n =</Label>
      <InputWrapper>
        <NumberInput
          type="number"
          value={inputValue}
          onChange={(e) => validateAndUpdate(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputWrapper>
      
      <Divider />
      
      <PresetLabel>示例:</PresetLabel>
      {PRESETS.map(preset => (
        <PresetButton
          key={preset}
          isActive={value === preset}
          onClick={() => {
            setInputValue(preset.toString());
            setError('');
            onChange(preset);
          }}
        >
          n={preset}
        </PresetButton>
      ))}
      
      <RandomButton onClick={handleRandom}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        随机
      </RandomButton>
    </InputContainer>
  );
}