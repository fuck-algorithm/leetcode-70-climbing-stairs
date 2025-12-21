import { useState } from 'react';
import styled from 'styled-components';

interface AlgorithmThoughtsProps {
  algorithm: 'dp' | 'matrix' | 'formula';
}

const ThoughtsButton = styled.button`
  position: fixed;
  top: 15px;
  right: 170px;
  z-index: 9998;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const Title = styled.h2`
  margin: 0 0 16px 0;
  color: #333;
  font-size: 20px;
  padding-right: 40px;
`;

const Section = styled.div`
  margin-bottom: 20px;
  
  h3 {
    color: #4CAF50;
    font-size: 16px;
    margin: 0 0 8px 0;
  }
  
  p {
    color: #555;
    line-height: 1.6;
    margin: 0 0 12px 0;
  }
  
  ul {
    margin: 0;
    padding-left: 20px;
    color: #555;
    
    li {
      margin-bottom: 6px;
      line-height: 1.5;
    }
  }
`;

const Formula = styled.div`
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  color: #333;
  margin: 12px 0;
  border-left: 4px solid #4CAF50;
`;

const Complexity = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 12px;
  
  span {
    background: #e8f5e9;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    color: #2e7d32;
  }
`;

const algorithmData = {
  dp: {
    title: '动态规划解法思路',
    sections: [
      {
        title: '问题分析',
        content: '爬楼梯问题是一个经典的动态规划问题。假设你正在爬楼梯，需要 n 阶才能到达楼顶。每次你可以爬 1 或 2 个台阶，问有多少种不同的方法可以爬到楼顶。'
      },
      {
        title: '状态定义',
        content: '定义 dp[i] 表示爬到第 i 阶楼梯的方法数。'
      },
      {
        title: '状态转移方程',
        formula: 'dp[i] = dp[i-1] + dp[i-2]',
        explanation: '要到达第 i 阶，可以从第 i-1 阶爬 1 阶，或从第 i-2 阶爬 2 阶。所以到达第 i 阶的方法数等于到达第 i-1 阶和第 i-2 阶的方法数之和。'
      },
      {
        title: '初始条件',
        list: [
          'dp[0] = 1：到达起点（第0阶）有1种方法，即不爬',
          'dp[1] = 1：到达第1阶有1种方法，即爬1阶'
        ]
      },
      {
        title: '复杂度分析',
        time: 'O(n)',
        space: 'O(1)（使用滚动数组优化后）'
      }
    ]
  },
  matrix: {
    title: '矩阵快速幂解法思路',
    sections: [
      {
        title: '问题转化',
        content: '爬楼梯问题本质上是求斐波那契数列的第 n 项。我们可以利用矩阵乘法来加速计算。'
      },
      {
        title: '矩阵表示',
        formula: '[F(n), F(n-1)] = [F(1), F(0)] × M^(n-1)',
        explanation: '其中 M = [[1,1],[1,0]]，通过矩阵快速幂可以在 O(log n) 时间内计算 M^(n-1)。'
      },
      {
        title: '快速幂原理',
        list: [
          '将指数 n 转换为二进制表示',
          '利用 M^n = M^(n/2) × M^(n/2) 的性质',
          '通过反复平方来减少乘法次数'
        ]
      },
      {
        title: '复杂度分析',
        time: 'O(log n)',
        space: 'O(1)'
      }
    ]
  },
  formula: {
    title: '通项公式解法思路',
    sections: [
      {
        title: '数学背景',
        content: '斐波那契数列存在一个优美的通项公式，称为比内公式（Binet\'s Formula）。'
      },
      {
        title: '通项公式',
        formula: 'F(n) = (φ^n - ψ^n) / √5',
        explanation: '其中 φ = (1+√5)/2 ≈ 1.618（黄金比例），ψ = (1-√5)/2 ≈ -0.618。'
      },
      {
        title: '公式推导',
        list: [
          '斐波那契递推式的特征方程为 x² = x + 1',
          '解得两个特征根 φ 和 ψ',
          '通解形式为 F(n) = Aφ^n + Bψ^n',
          '代入初始条件求得 A = 1/√5, B = -1/√5'
        ]
      },
      {
        title: '注意事项',
        content: '由于浮点数精度问题，当 n 较大时可能会有误差。实际应用中需要注意精度处理。'
      },
      {
        title: '复杂度分析',
        time: 'O(1)（或 O(log n) 如果考虑幂运算）',
        space: 'O(1)'
      }
    ]
  }
};

export default function AlgorithmThoughts({ algorithm }: AlgorithmThoughtsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const data = algorithmData[algorithm];

  return (
    <>
      <ThoughtsButton onClick={() => setIsOpen(true)}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
        算法思路
      </ThoughtsButton>
      
      <Modal isOpen={isOpen} onClick={() => setIsOpen(false)}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
          <Title>{data.title}</Title>
          
          {data.sections.map((section, index) => (
            <Section key={index}>
              <h3>{section.title}</h3>
              {section.content && <p>{section.content}</p>}
              {section.formula && (
                <>
                  <Formula>{section.formula}</Formula>
                  {section.explanation && <p>{section.explanation}</p>}
                </>
              )}
              {section.list && (
                <ul>
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {section.time && (
                <Complexity>
                  <span>时间复杂度: {section.time}</span>
                  <span>空间复杂度: {section.space}</span>
                </Complexity>
              )}
            </Section>
          ))}
        </ModalContent>
      </Modal>
    </>
  );
}