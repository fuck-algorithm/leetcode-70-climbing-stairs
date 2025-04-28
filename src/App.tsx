import { useReducer, useState, useCallback, useEffect } from 'react'
import './App.css'
import CanvasComponent from './components/CanvasComponent'
import ControlPanel from './components/ControlPanel'
import CodePanel from './components/CodePanel'
import { useAnimation } from './hooks/useAnimation'
import { animationReducer, AnimationState, INITIALIZE, AnimationTimeline } from './state/animationSlice'
import GitHubCorner from './components/GitHubCorner'
import BackToHot100 from './components/BackToHot100'
import MatrixFastPower from './components/MatrixFastPower'
import FormulaVisualizer from './components/FormulaVisualizer'
import SimpleDPVisualizer from './components/dp/SimpleDPVisualizer'

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
  playbackSpeed: 1.0,
  stepStatuses: [],
  values: [],
  animationInProgress: false
};

function App() {
  // 使用useReducer代替Redux，因为是单个文件应用
  const [state, dispatch] = useReducer(animationReducer, initialState);
  
  // 楼梯阶数配置
  const [stairsCount, setStairsCount] = useState(6);
  
  // 当前算法的时间线
  const [currentTimeline, setCurrentTimeline] = useState<AnimationTimeline | null>(null);
  
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
  
  // 处理生成解决方案
  const handleGenerateSolution = useCallback((solution: { 
    result: number; 
    timeline: AnimationTimeline[];
    stepsData?: {
      stepStatuses: ('uncalculated' | 'calculating' | 'calculated')[];
      values: number[];
    };
  }) => {
    console.log("App 收到生成的解决方案:", {
      hasResult: !!solution.result,
      timelineLength: solution.timeline?.length || 0,
      stepsDataValues: solution.stepsData?.values?.length || 0,
      stepsDataStatuses: solution.stepsData?.stepStatuses?.length || 0
    });
    
    // 验证接收到的数据
    if (!solution.timeline || solution.timeline.length === 0) {
      console.error("警告: 接收到的解决方案没有时间线数据!");
      return;
    }
    
    // 构建有效的payload，包含合理的默认值
    const payload = {
      totalSteps: solution.timeline.length,
      values: solution.stepsData?.values || [],
      stepStatuses: solution.stepsData?.stepStatuses || [],
      timeline: solution.timeline
    };
    
    console.log("初始化动画状态，payload信息:", {
      totalSteps: payload.totalSteps,
      valuesLength: payload.values.length,
      statusesLength: payload.stepStatuses.length,
      timelineLength: payload.timeline.length
    });
    
    dispatch({ type: INITIALIZE, payload });
  }, [dispatch]);
  
  // 选择算法类型
  const handleSelectAlgorithm = (algorithm: 'dp' | 'matrix' | 'formula') => {
    dispatch({ type: 'animation/setCurrentAlgorithm', payload: algorithm });
    dispatch({ type: 'animation/resetAnimation' });
    setTimeout(restartAnimation, 0);
  };
  
  // 更新当前时间线
  useEffect(() => {
    if (state.timeline && state.timeline.length > 0 && state.currentStep < state.timeline.length) {
      setCurrentTimeline(state.timeline[state.currentStep]);
    } else {
      setCurrentTimeline(null);
    }
  }, [state.timeline, state.currentStep]);
  
  const renderVisualization = () => {
    switch (state.currentAlgorithm) {
      case 'dp':
        return (
          <SimpleDPVisualizer
            n={stairsCount}
            state={state}
            onGenerateSolution={handleGenerateSolution}
            dispatch={dispatch}
          />
        );
      case 'matrix':
        return (
          <MatrixFastPower 
            n={stairsCount}
            state={state}
            currentTimeline={currentTimeline}
          />
        );
      case 'formula':
        return (
          <FormulaVisualizer 
            n={stairsCount}
            state={state}
            currentTimeline={currentTimeline}
          />
        );
      default:
        // 对于其他算法，暂时保留原始的可视化方式
        return (
          <>
            <CanvasComponent 
              state={state}
              width={window.innerWidth * 0.65}
              height={window.innerHeight * 0.7}
            />
            <ControlPanel state={state} dispatch={dispatch} />
          </>
        );
    }
  };
  
  // 渲染算法选择器
  const renderAlgorithmSelector = () => {
    const algorithms = [
      { id: 'dp', name: '动态规划', color: '#4CAF50' },
      { id: 'matrix', name: '矩阵快速幂', color: '#7E57C2' },
      { id: 'formula', name: '通项公式', color: '#FFC107' }
    ];
    
    return (
      <div className="algorithm-selector">
        {algorithms.map(algo => (
          <button 
            key={algo.id}
            className={`algorithm-button ${state.currentAlgorithm === algo.id ? 'active' : ''}`}
            style={{ 
              borderColor: algo.color,
              backgroundColor: state.currentAlgorithm === algo.id ? algo.color : 'transparent',
              color: state.currentAlgorithm === algo.id ? 'white' : algo.color
            }}
            onClick={() => handleSelectAlgorithm(algo.id as 'dp' | 'matrix' | 'formula')}
          >
            {algo.name}
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="app-container">
      <BackToHot100 />
      <GitHubCorner />
      <header className="app-header">
        <h1>爬楼梯问题算法可视化</h1>
        <div className="stairs-config">
          {renderAlgorithmSelector()}
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
          
          {/* 添加代码面板 */}
          <div className="code-section">
            <h3>算法代码</h3>
            <div style={{ height: '280px' }}>
              <CodePanel state={state} />
            </div>
          </div>
        </div>
        
        <div className="center-panel">
          {/* 标题 */}
          <h2 style={{
            textAlign: 'center',
            color: state.currentAlgorithm === 'dp' ? '#2196F3' : 
                 state.currentAlgorithm === 'matrix' ? '#7E57C2' : 
                 '#FF6F00',
            margin: '0 0 20px 0',
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {state.currentAlgorithm === 'dp' ? '动态规划解法' : 
             state.currentAlgorithm === 'matrix' ? '矩阵快速幂解法' : 
             '通项公式解法'} - 爬楼梯问题
          </h2>
          
          {/* 渲染具体算法可视化 */}
          {renderVisualization()}
        </div>
      </main>
    </div>
  )
}

export default App
