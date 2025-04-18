import { useReducer, useState } from 'react'
import './App.css'
import CanvasComponent from './components/CanvasComponent'
import ControlPanel from './components/ControlPanel'
import { useAnimation } from './hooks/useAnimation'
import { animationReducer, AnimationState } from './state/animationSlice'
import GitHubCorner from './components/GitHubCorner'
import BackToHot100 from './components/BackToHot100'

// 初始状态
const initialState: AnimationState = {
  currentAlgorithm: 'dp' as const,
  isPlaying: false,
  currentStep: 0,
  totalSteps: 0,
  staircase: { nodes: [], links: [] },
  matrix: [],
  formula: '',
  timeline: [],
  playbackSpeed: 1.0
};

function App() {
  // 使用useReducer代替Redux，因为是单个文件应用
  const [state, dispatch] = useReducer(animationReducer, initialState);
  
  // 楼梯阶数配置
  const [stairsCount, setStairsCount] = useState(6);
  
  // 使用动画钩子
  const { restartAnimation } = useAnimation(state, dispatch, stairsCount);
  
  const handleStairsCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    if (count >= 1 && count <= 20) {
      setStairsCount(count);
      // 重置和初始化动画
      dispatch({ type: 'animation/resetAnimation' });
      setTimeout(restartAnimation, 0);
    }
  };
  
  return (
    <div className="app-container">
      <BackToHot100 />
      <GitHubCorner />
      <header className="app-header">
        <h1>爬楼梯问题算法可视化</h1>
        <div className="stairs-config">
          <label>
            楼梯阶数: 
            <input
              type="number"
              min="1"
              max="20"
              value={stairsCount}
              onChange={handleStairsCountChange}
              className="stairs-input"
            />
          </label>
        </div>
      </header>
      
      <main className="app-content">
        <div className="left-panel">
          <h2>算法说明</h2>
          <div className="algorithm-description">
            {state.currentAlgorithm === 'dp' && (
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
            )}
            
            {state.currentAlgorithm === 'matrix' && (
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
            )}
            
            {state.currentAlgorithm === 'formula' && (
              <div>
                <h3>通项公式解法</h3>
                <p>比内公式（Binet's Formula）：</p>
                <ul>
                  <li>f(n) = (1/√5) * [((1+√5)/2)^n - ((1-√5)/2)^n]</li>
                  <li>时间复杂度：O(1)</li>
                  <li>空间复杂度：O(1)</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="center-panel">
          <CanvasComponent 
            state={state}
            width={600}
            height={400}
          />
          <ControlPanel state={state} dispatch={dispatch} />
        </div>
      </main>
    </div>
  )
}

export default App
