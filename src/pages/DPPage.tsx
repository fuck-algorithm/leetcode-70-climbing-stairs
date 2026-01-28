import { useReducer, useState, useCallback } from 'react';
import { animationReducer, AnimationState, INITIALIZE, AnimationTimeline } from '../state/animationSlice';
import { useAnimation } from '../hooks/useAnimation';
import SimpleDPVisualizer from '../components/dp/SimpleDPVisualizer';
import CodePanel from '../components/CodePanel';
import DataInput from '../components/DataInput';
import AlgorithmThoughts from '../components/AlgorithmThoughts';

const initialState: AnimationState = {
  currentAlgorithm: 'dp' as const,
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

function DPPage() {
  const [state, dispatch] = useReducer(animationReducer, initialState);
  const [stairsCount, setStairsCount] = useState(6);
  const { restartAnimation } = useAnimation(state, dispatch, stairsCount);

  const handleStairsCountChange = (count: number) => {
    if (count >= 1 && count <= 45) {
      setStairsCount(count);
      dispatch({ type: 'animation/resetAnimation' });
      setTimeout(restartAnimation, 0);
    }
  };

  const handleGenerateSolution = useCallback((solution: { 
    result: number; 
    timeline: AnimationTimeline[];
    stepsData?: {
      stepStatuses: ('uncalculated' | 'calculating' | 'calculated')[];
      values: number[];
    };
  }) => {
    if (!solution.timeline || solution.timeline.length === 0) {
      return;
    }
    const payload = {
      totalSteps: solution.timeline.length,
      values: solution.stepsData?.values || [],
      stepStatuses: solution.stepsData?.stepStatuses || [],
      timeline: solution.timeline
    };
    dispatch({ type: INITIALIZE, payload });
  }, [dispatch]);

  return (
    <>
      <AlgorithmThoughts algorithm="dp" />
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
              <h3>动态规划解法</h3>
              <p>爬楼梯问题可以用动态规划方法解决：</p>
              <ul>
                <li>基本情况：f(0) = 1, f(1) = 1</li>
                <li>状态转移方程：f(n) = f(n-1) + f(n-2)</li>
                <li>时间复杂度：O(n)</li>
                <li>空间复杂度：O(1) (使用滚动数组优化)</li>
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
            color: '#4CAF50',
            margin: '0 0 10px 0',
            padding: '8px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontSize: '18px'
          }}>
            动态规划解法
          </h2>
          
          <SimpleDPVisualizer
            n={stairsCount}
            state={state}
            onGenerateSolution={handleGenerateSolution}
            dispatch={dispatch}
          />
        </div>
      </main>
    </>
  );
}

export default DPPage;
