import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AnimationState, AnimationTimeline } from '../state/animationSlice';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 主容器
const VisualizerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  padding: 20px;
  overflow: auto;
  background: radial-gradient(circle at 50% 50%, rgba(255, 243, 224, 0.3), rgba(255, 224, 178, 0.1));
`;

// 公式卡片容器
const FormulaCard = styled.div<{ active?: boolean }>`
  width: 100%;
  max-width: 800px;
  padding: 20px;
  margin: 15px 0;
  background: linear-gradient(135deg, #FFF8E1, #FFECB3);
  border-radius: 12px;
  box-shadow: ${props => props.active 
    ? '0 8px 20px rgba(255, 193, 7, 0.3), 0 0 15px rgba(255, 193, 7, 0.5)' 
    : '0 4px 10px rgba(0, 0, 0, 0.1)'};
  border-left: 5px solid #FFC107;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(255, 193, 7, 0.4), 0 0 20px rgba(255, 193, 7, 0.6);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle at top right, rgba(255, 235, 59, 0.3), transparent 70%);
    border-radius: 0 12px 0 100%;
  }
`;

// 公式标题
const FormulaTitle = styled.h3`
  font-size: 20px;
  color: #FF6F00;
  margin-bottom: 15px;
  text-align: center;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
`;

// 公式显示区域
const FormulaDisplay = styled.div`
  font-family: 'Cambria Math', 'Times New Roman', serif;
  font-size: 22px;
  color: #212121;
  text-align: center;
  padding: 15px;
  margin: 10px 0;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
  position: relative;
  
  .variable {
    color: #FF6F00;
    font-weight: bold;
  }
  
  .constant {
    color: #0288D1;
  }
  
  .operator {
    color: #616161;
    margin: 0 2px;
  }
  
  .highlight {
    background-color: rgba(255, 235, 59, 0.3);
    padding: 0 3px;
    border-radius: 3px;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { background-color: rgba(255, 235, 59, 0.3); }
    50% { background-color: rgba(255, 235, 59, 0.6); }
  }
`;

// 公式解释
const FormulaExplanation = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #5D4037;
  margin-top: 15px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  border-left: 3px solid #FFA000;
`;

// 图表容器
const ChartContainer = styled.div`
  width: 100%;
  max-width: 800px;
  height: 300px;
  margin: 20px 0;
  padding: 15px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

// 数轴容器
const NumberLineContainer = styled.div`
  width: 100%;
  max-width: 800px;
  height: 80px;
  margin: 15px 0;
  padding: 10px;
  position: relative;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// 数轴线
const NumberLine = styled.div`
  width: 95%;
  height: 2px;
  background-color: #757575;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-right: 8px solid #757575;
    transform: translate(-100%, -50%);
  }
  
  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 8px solid #757575;
    transform: translate(100%, -50%);
  }
`;

// 数轴标记点
const NumberMarker = styled.div<{ position: number; color: string; special?: boolean }>`
  position: absolute;
  left: ${props => props.position}%;
  top: 50%;
  width: ${props => props.special ? '12px' : '8px'};
  height: ${props => props.special ? '12px' : '8px'};
  background-color: ${props => props.color};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
  
  &:after {
    content: attr(data-value);
    position: absolute;
    top: ${props => props.special ? '-25px' : '-20px'};
    left: 50%;
    transform: translateX(-50%);
    font-size: ${props => props.special ? '14px' : '12px'};
    font-weight: ${props => props.special ? 'bold' : 'normal'};
    color: ${props => props.color};
    white-space: nowrap;
  }
`;

// 黄金矩形容器
const GoldenRectangleContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 黄金矩形
const GoldenRectangle = styled.div<{ active?: boolean }>`
  width: 260px;
  height: 161px; /* 黄金比例: 1.618 */
  background: linear-gradient(135deg, #FFF8E1, #FFD54F);
  border: 2px solid #FFC107;
  border-radius: 4px;
  position: relative;
  box-shadow: ${props => props.active 
    ? '0 8px 16px rgba(255, 193, 7, 0.4)' 
    : '0 4px 8px rgba(0, 0, 0, 0.1)'};
  transition: all 0.5s ease;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 1px dashed rgba(255, 152, 0, 0.5);
    box-sizing: border-box;
    pointer-events: none;
  }
  
  &:after {
    content: 'φ = 1.618...';
    position: absolute;
    right: -60px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #FF6F00;
    font-weight: bold;
  }
`;

// 黄金比例标记
const GoldenRatio = styled.div`
  margin-top: 15px;
  font-size: 16px;
  color: #FF6F00;
  text-align: center;
  
  span {
    font-weight: bold;
  }
`;

// 步骤说明面板
const StepPanel = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 15px;
  margin: 15px 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

// 步骤标题
const StepTitle = styled.h3`
  font-size: 18px;
  color: #FF6F00;
  margin-bottom: 10px;
`;

// 步骤描述
const StepDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #5D4037;
`;

// 代码块
const CodeBlock = styled.pre`
  background-color: #FFF8E1;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #FFC107;
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  overflow-x: auto;
  margin: 10px 0;
  color: #5D4037;
`;

// 进度条
const ProgressIndicator = styled.div`
  width: 100%;
  max-width: 800px;
  height: 6px;
  background-color: #EEEEEE;
  border-radius: 3px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const Progress = styled.div<{ percent: number }>`
  height: 100%;
  width: ${props => props.percent}%;
  background-color: #FFC107;
  border-radius: 3px;
  transition: width 0.3s ease;
`;

// 详细程度选择器
const DetailLevelSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
`;

const DetailButton = styled.button<{ active: boolean }>`
  padding: 5px 15px;
  background-color: ${props => props.active ? '#FFC107' : '#EEEEEE'};
  color: ${props => props.active ? 'white' : '#757575'};
  border: none;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#FFB300' : '#E0E0E0'};
  }
`;

// 组件属性接口
interface FormulaVisualizerProps {
  n: number;
  state: AnimationState;
  currentTimeline: AnimationTimeline | null;
}

// 通项公式可视化组件
const FormulaVisualizer: React.FC<FormulaVisualizerProps> = ({ n, state, currentTimeline }) => {
  const [detailLevel, setDetailLevel] = useState<'simple' | 'detailed' | 'expert'>('simple');
  const [chartData, setChartData] = useState<any>(null);
  
  // 黄金比例常数
  const PHI = (1 + Math.sqrt(5)) / 2; // 约等于1.618...
  const NEG_PHI_INV = (1 - Math.sqrt(5)) / 2; // 约等于-0.618...
  
  // 计算进度百分比
  const progressPercent = state.totalSteps > 0 
    ? ((state.currentStep + 1) / state.totalSteps) * 100 
    : 0;
  
  // 使用通项公式计算斐波那契数
  const fibonacciFormula = (num: number): number => {
    return Math.round((Math.pow(PHI, num) - Math.pow(NEG_PHI_INV, num)) / Math.sqrt(5));
  };
  
  // 生成图表数据
  useEffect(() => {
    const labels = Array.from({ length: 16 }, (_, i) => i.toString());
    
    const phiData = labels.map(label => Math.pow(PHI, parseInt(label)));
    const negPhiInvData = labels.map(label => Math.pow(NEG_PHI_INV, parseInt(label)));
    const combinedData = labels.map(label => {
      const idx = parseInt(label);
      return (Math.pow(PHI, idx) - Math.pow(NEG_PHI_INV, idx)) / Math.sqrt(5);
    });
    const fibValues = labels.map(label => fibonacciFormula(parseInt(label)));
    
    const data = {
      labels,
      datasets: [
        {
          label: 'φ^n',
          data: phiData,
          borderColor: '#FFC107',
          backgroundColor: 'rgba(255, 193, 7, 0.2)',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.1
        },
        {
          label: '(-1/φ)^n',
          data: negPhiInvData,
          borderColor: '#3F51B5',
          backgroundColor: 'rgba(63, 81, 181, 0.2)',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.1
        },
        {
          label: '(φ^n - (-1/φ)^n) / √5',
          data: combinedData,
          borderColor: '#9C27B0',
          backgroundColor: 'rgba(156, 39, 176, 0.2)',
          borderWidth: 3,
          pointRadius: 4,
          tension: 0.1
        },
        {
          label: 'F(n)',
          data: fibValues,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderWidth: 2,
          pointRadius: 4,
          pointStyle: 'rectRot',
          tension: 0
        }
      ]
    };
    
    setChartData(data);
  }, []);
  
  // 图表选项
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            if (Math.abs(Number(value)) > 100) {
              return Number(value).toExponential(1);
            }
            return value;
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (Math.abs(context.parsed.y) > 100) {
                label += context.parsed.y.toExponential(2);
              } else {
                label += context.parsed.y.toFixed(2);
              }
            }
            return label;
          }
        }
      }
    }
  };
  
  // 渲染公式
  const renderFormula = (highlight: number = 0) => {
    const parts = [
      { type: 'text', content: 'F(n) = ' },
      { type: 'fraction', content: '1', divided: '√5' },
      { type: 'operator', content: ' × ' },
      { type: 'bracket', content: '[' },
      { type: 'fraction', content: '1 + √5', divided: '2', highlight: highlight === 1 },
      { type: 'superscript', content: 'n', highlight: highlight === 1 },
      { type: 'operator', content: ' - ' },
      { type: 'bracket', content: '(' },
      { type: 'fraction', content: '1 - √5', divided: '2', highlight: highlight === 2 },
      { type: 'superscript', content: 'n', highlight: highlight === 2 },
      { type: 'bracket', content: ')' },
      { type: 'bracket', content: ']' }
    ];
    
    return (
      <FormulaDisplay>
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return <span key={index}>{part.content}</span>;
          } else if (part.type === 'operator') {
            return <span key={index} className="operator">{part.content}</span>;
          } else if (part.type === 'bracket') {
            return <span key={index} className="operator">{part.content}</span>;
          } else if (part.type === 'fraction') {
            const className = `${part.highlight ? 'highlight' : ''}`;
            return (
              <span key={index} className={className} style={{ display: 'inline-block' }}>
                <span className="constant">{part.content}</span>
                {part.divided && (
                  <>
                    <span style={{ margin: '0 2px' }}>/</span>
                    <span className="constant">{part.divided}</span>
                  </>
                )}
              </span>
            );
          } else if (part.type === 'superscript') {
            const className = `${part.highlight ? 'highlight' : ''}`;
            return (
              <sup key={index} className={className}>
                <span className="variable">{part.content}</span>
              </sup>
            );
          }
          return null;
        })}
      </FormulaDisplay>
    );
  };
  
  // 渲染数轴
  const renderNumberLine = () => {
    return (
      <NumberLineContainer>
        <NumberLine />
        <NumberMarker 
          position={50} 
          color="#757575" 
          data-value="0"
        />
        <NumberMarker 
          position={89.1} // 1.618 映射到0-100的位置
          color="#FFC107" 
          special 
          data-value="φ ≈ 1.618"
        />
        <NumberMarker 
          position={19.1} // -0.618 映射到0-100的位置
          color="#3F51B5" 
          special 
          data-value="-1/φ ≈ -0.618"
        />
      </NumberLineContainer>
    );
  };
  
  // 渲染黄金矩形
  const renderGoldenRectangle = () => {
    return (
      <GoldenRectangleContainer>
        <GoldenRectangle active={state.currentStep > 4} />
        <GoldenRatio>
          黄金比例: <span>φ = {PHI.toFixed(6)}...</span>
        </GoldenRatio>
      </GoldenRectangleContainer>
    );
  };
  
  // 获取当前步骤的说明
  const getCurrentExplanation = () => {
    if (!currentTimeline || !currentTimeline.explanation) {
      return '通项公式法是求解斐波那契数列的最直接方法，时间复杂度为O(1)。';
    }
    
    return currentTimeline.explanation[detailLevel] || currentTimeline.explanation.simple;
  };
  
  return (
    <VisualizerContainer>
      {/* 进度指示器 */}
      <ProgressIndicator>
        <Progress percent={progressPercent} />
      </ProgressIndicator>
      
      {/* 标题和步骤说明 */}
      <FormulaTitle>通项公式解法 - 爬楼梯问题</FormulaTitle>
      
      {/* 当前步骤说明 */}
      {currentTimeline && (
        <StepPanel>
          <StepTitle>{currentTimeline.description}</StepTitle>
          <DetailLevelSelector>
            <DetailButton 
              active={detailLevel === 'simple'} 
              onClick={() => setDetailLevel('simple')}
            >
              简洁
            </DetailButton>
            <DetailButton 
              active={detailLevel === 'detailed'} 
              onClick={() => setDetailLevel('detailed')}
            >
              详细
            </DetailButton>
            <DetailButton 
              active={detailLevel === 'expert'} 
              onClick={() => setDetailLevel('expert')}
            >
              专家
            </DetailButton>
          </DetailLevelSelector>
          <StepDescription>
            {getCurrentExplanation()}
          </StepDescription>
          {currentTimeline.code && (
            <CodeBlock>{currentTimeline.code}</CodeBlock>
          )}
        </StepPanel>
      )}
      
      {/* 公式展示 */}
      <FormulaCard active={state.currentStep > 2}>
        <FormulaTitle>斐波那契数列通项公式 (比内公式)</FormulaTitle>
        {renderFormula(state.currentStep % 3 === 0 ? 1 : state.currentStep % 3 === 1 ? 2 : 0)}
        <FormulaExplanation>
          这个优雅的公式允许我们直接计算第n个斐波那契数，而无需递推。
          其中φ = (1+√5)/2 ≈ 1.618是黄金比例，(-1/φ) = (1-√5)/2 ≈ -0.618是其负倒数。
          由于|(-1/φ)|&lt;1，当n很大时，第二项((-1/φ)^n)接近于0，可以忽略不计。
        </FormulaExplanation>
      </FormulaCard>
      
      {/* 数轴展示 */}
      {renderNumberLine()}
      
      {/* 图表可视化 */}
      <ChartContainer>
        {chartData && <Line data={chartData} options={chartOptions} />}
      </ChartContainer>
      
      {/* 黄金矩形 */}
      {renderGoldenRectangle()}
      
      {/* 结果展示 */}
      <FormulaCard>
        <FormulaTitle>计算结果</FormulaTitle>
        <FormulaDisplay>
          <span>F({n}) = {fibonacciFormula(n)}</span>
        </FormulaDisplay>
        <FormulaExplanation>
          根据通项公式计算得到，爬到第{n}阶楼梯共有{fibonacciFormula(n)}种不同的方法。
          这一结果与动态规划和矩阵快速幂算法的结果完全一致，但计算速度最快。
        </FormulaExplanation>
      </FormulaCard>
    </VisualizerContainer>
  );
};

export default FormulaVisualizer; 