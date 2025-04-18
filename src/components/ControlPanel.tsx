import React from 'react';
import { 
  playPause, 
  resetAnimation, 
  setAlgorithm, 
  setCurrentStep, 
  setPlaybackSpeed,
  AnimationState 
} from '../state/animationSlice';

interface ControlPanelProps {
  state: AnimationState;
  dispatch: (action: any) => void; // Redux dispatch 函数
}

const ControlPanel: React.FC<ControlPanelProps> = ({ state, dispatch }) => {
  // 切换算法
  const handleAlgorithmChange = (algorithm: AnimationState['currentAlgorithm']) => {
    dispatch(setAlgorithm(algorithm));
    dispatch(resetAnimation());
  };
  
  // 播放/暂停动画
  const handlePlayPause = () => {
    dispatch(playPause());
  };
  
  // 重置动画
  const handleReset = () => {
    dispatch(resetAnimation());
  };
  
  // 步进控制
  const handleStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const step = parseInt(e.target.value, 10);
    dispatch(setCurrentStep(step));
  };

  // 上一步
  const handlePreviousStep = () => {
    if (state.currentStep > 0) {
      dispatch(setCurrentStep(state.currentStep - 1));
      // 如果正在播放，则暂停
      if (state.isPlaying) {
        dispatch(playPause());
      }
    }
  };

  // 下一步
  const handleNextStep = () => {
    if (state.currentStep < state.totalSteps - 1) {
      dispatch(setCurrentStep(state.currentStep + 1));
       // 如果正在播放，则暂停
      if (state.isPlaying) {
        dispatch(playPause());
      }
    }
  };

  // 处理播放速度变化
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseFloat(e.target.value);
    dispatch(setPlaybackSpeed(speed));
  };

  return (
    <div className="control-panel" style={styles.container}>
      <div style={styles.section}>
        <h3 style={styles.heading}>爬楼梯算法</h3>
        <div style={styles.buttonGroup}>
          <button 
            style={{
              ...styles.algorithmButton,
              backgroundColor: state.currentAlgorithm === 'dp' ? '#4CAF50' : '#e0e0e0',
              color: state.currentAlgorithm === 'dp' ? 'white' : 'black'
            }}
            onClick={() => handleAlgorithmChange('dp')}
          >
            动态规划
          </button>
          <button 
            style={{
              ...styles.algorithmButton,
              backgroundColor: state.currentAlgorithm === 'matrix' ? '#2196F3' : '#e0e0e0',
              color: state.currentAlgorithm === 'matrix' ? 'white' : 'black'
            }}
            onClick={() => handleAlgorithmChange('matrix')}
          >
            矩阵快速幂
          </button>
          <button 
            style={{
              ...styles.algorithmButton,
              backgroundColor: state.currentAlgorithm === 'formula' ? '#9C27B0' : '#e0e0e0',
              color: state.currentAlgorithm === 'formula' ? 'white' : 'black'
            }}
            onClick={() => handleAlgorithmChange('formula')}
          >
            通项公式
          </button>
        </div>
      </div>
      
      <div style={styles.section}>
        <h3 style={styles.heading}>动画控制</h3>
        <div style={styles.buttonGroup}>
          <button 
            style={styles.controlButton} 
            onClick={handlePreviousStep}
            disabled={state.currentStep === 0}
          >
            上一步
          </button>
          <button style={styles.controlButton} onClick={handlePlayPause}>
            {state.isPlaying ? '暂停' : '播放'}
          </button>
          <button 
            style={styles.controlButton} 
            onClick={handleNextStep}
            disabled={state.currentStep >= state.totalSteps - 1}
           >
            下一步
          </button>
          <button style={styles.controlButton} onClick={handleReset}>
            重置
          </button>
        </div>
        
        <div style={styles.sliderContainer}>
          <span>步骤: {state.currentStep} / {state.totalSteps > 0 ? state.totalSteps -1 : 0}</span>
          <input 
            type="range" 
            min="0" 
            max={state.totalSteps > 0 ? state.totalSteps - 1 : 0} 
            value={state.currentStep} 
            onChange={handleStepChange}
            style={styles.slider}
            disabled={state.totalSteps === 0}
          />
        </div>

        <div style={styles.speedControlContainer}>
           <label htmlFor="speedControl">播放速度: {state.playbackSpeed.toFixed(1)}x</label>
          <input
            id="speedControl"
            type="range"
            min="0.1"
            max="4"
            step="0.1"
            value={state.playbackSpeed}
            onChange={handleSpeedChange}
            style={styles.slider}
          />
        </div>
      </div>
      
      <div style={styles.description}>
        {state.timeline[state.currentStep]?.description || '准备开始动画演示'}
      </div>
    </div>
  );
};

// 组件样式
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  section: {
    marginBottom: '15px'
  },
  heading: {
    fontSize: '16px',
    marginBottom: '8px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const
  },
  algorithmButton: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  controlButton: {
    padding: '6px 12px',
    backgroundColor: '#555',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  sliderContainer: {
    marginTop: '15px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px'
  },
  speedControlContainer: {
    marginTop: '15px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px'
  },
  slider: {
    width: '100%'
  },
  description: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    border: '1px solid #ddd',
    minHeight: '20px',
    fontSize: '14px'
  }
};

export default ControlPanel; 