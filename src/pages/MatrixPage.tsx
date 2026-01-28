import { useReducer, useState, useEffect } from 'react';
import { animationReducer, AnimationState, AnimationTimeline } from '../state/animationSlice';
import { useAnimation } from '../hooks/useAnimation';
import MatrixFastPower from '../components/MatrixFastPower';
import CodePanel from '../components/CodePanel';
import DataInput from '../components/DataInput';
import AlgorithmThoughts from '../components/AlgorithmThoughts';

const initialState: AnimationState = {
  currentAlgorithm: 'matrix' as const,
  isPlaying: false,
  currentStep: 0,
  totalSteps: 0,
  staircase: { nodes: [], links: [] },
  matrix: [],
  formula: '',
  timeline: [],
  playbackSpeed: 1.0,
  stepStatuses: [],
  values: [],
  animationInProgress: false
};

function MatrixPage() {
  const [state, dispatch] = useReducer(animationReducer, initialState);
  const [stairsCount, setStairsCount] = useState(6);
  const [currentTimeline, setCurrentTimeline] = useState<AnimationTimeline | null>(null);
  const { restartAnimation } = useAnimation(state, dispatch, stairsCount);

  const handleStairsCountChange = (count: number) => {
    if (count >= 1 && count <= 45) {
      setStairsCount(count);
      dispatch({ type: 'animation/resetAnimation' });
      setTimeout(restartAnimation, 0);
    }
  };

  useEffect(() => {
    if (state.timeline && state.timeline.length > 0 && state.currentStep < state.timeline.length) {
      setCurrentTimeline(state.timeline[state.currentStep]);
    } else {
      setCurrentTimeline(null);
    }
  }, [state.timeline, state.currentStep]);

  return (
    <>
      <AlgorithmThoughts algorithm="matrix" />
      <div className="input-row">
        <DataInput 
          value={stairsCount} 
          onChange={handleStairsCountChange}
          min={1}
          max={20}
        />
      </div>
      
      <main className="app-content">
        <div className="left-panel">
          <h2>算法说明</h2>
          <div className="algorithm-description">
            <div>
              <h3>矩阵快速幂解法</h3>
              <p>通过矩阵求解斐波那契数列：</p>
              <ul>
                <li>构造矩阵 M = [[1,1],[1,0]]</li>
                <li>矩阵的n-1次幂M^(n-1)的[0,0]位置即为结果</li>
                <li>时间复杂度：O(log n)</li>
                <li>空间复杂度：O(1)</li>
              </ul>
            </div>
          </div>
          
          <div className="code-section">
            <h3>算法代码</h3>
            <div style={{ height: '280px' }}>
              <CodePanel state={state} />
            </div>
          </div>
        </div>
        
        <div className="center-panel">
          <h2 style={{
            textAlign: 'center',
            color: '#2196F3',
            margin: '0 0 10px 0',
            padding: '8px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontSize: '18px'
          }}>
            矩阵快速幂解法
          </h2>
          
          <MatrixFastPower 
            n={stairsCount}
            state={state}
            currentTimeline={currentTimeline}
          />
        </div>
      </main>
    </>
  );
}

export default MatrixPage;
