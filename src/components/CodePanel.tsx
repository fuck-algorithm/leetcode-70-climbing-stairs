import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AnimationState } from '../state/animationSlice';
import { languageService, type Language } from '../services/indexedDBService';
import { getCodeLineMapping } from '../utils/codeLineMapping';

interface CodePanelProps {
  state: AnimationState;
  n?: number;
}

// 代码数据
const CODE_DATA: Record<string, Record<Language, { code: string }>> = {
  dp: {
    java: {
      code: `class Solution {
    public int climbStairs(int n) {
        if (n <= 1) return 1;
        
        int[] dp = new int[n + 1];
        dp[0] = 1;
        dp[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        
        return dp[n];
    }
}`,
    },
    python: {
      code: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 1:
            return 1
        
        dp = [0] * (n + 1)
        dp[0] = 1
        dp[1] = 1
        
        for i in range(2, n + 1):
            dp[i] = dp[i - 1] + dp[i - 2]
        
        return dp[n]`,
    },
    golang: {
      code: `func climbStairs(n int) int {
    if n <= 1 {
        return 1
    }
    
    dp := make([]int, n+1)
    dp[0] = 1
    dp[1] = 1
    
    for i := 2; i <= n; i++ {
        dp[i] = dp[i-1] + dp[i-2]
    }
    
    return dp[n]
}`,
    },
    javascript: {
      code: `var climbStairs = function(n) {
    if (n <= 1) return 1;
    
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
};`,
    },
  },
  matrix: {
    java: {
      code: `class Solution {
    public int climbStairs(int n) {
        int[][] q = {{1, 1}, {1, 0}};
        int[][] res = pow(q, n);
        return res[0][0];
    }
    
    int[][] pow(int[][] a, int n) {
        int[][] ret = {{1, 0}, {0, 1}};
        while (n > 0) {
            if ((n & 1) == 1) {
                ret = multiply(ret, a);
            }
            n >>= 1;
            a = multiply(a, a);
        }
        return ret;
    }
    
    int[][] multiply(int[][] a, int[][] b) {
        int[][] c = new int[2][2];
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                c[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j];
            }
        }
        return c;
    }
}`,
    },
    python: {
      code: `class Solution:
    def climbStairs(self, n: int) -> int:
        def multiply(a, b):
            return [
                [a[0][0]*b[0][0] + a[0][1]*b[1][0],
                 a[0][0]*b[0][1] + a[0][1]*b[1][1]],
                [a[1][0]*b[0][0] + a[1][1]*b[1][0],
                 a[1][0]*b[0][1] + a[1][1]*b[1][1]]
            ]
        
        def matrix_pow(m, n):
            result = [[1, 0], [0, 1]]
            while n > 0:
                if n & 1:
                    result = multiply(result, m)
                n >>= 1
                m = multiply(m, m)
            return result
        
        q = [[1, 1], [1, 0]]
        res = matrix_pow(q, n)
        return res[0][0]`,
    },
    golang: {
      code: `func climbStairs(n int) int {
    q := [][]int{{1, 1}, {1, 0}}
    res := pow(q, n)
    return res[0][0]
}

func pow(a [][]int, n int) [][]int {
    ret := [][]int{{1, 0}, {0, 1}}
    for n > 0 {
        if n&1 == 1 {
            ret = multiply(ret, a)
        }
        n >>= 1
        a = multiply(a, a)
    }
    return ret
}

func multiply(a, b [][]int) [][]int {
    c := make([][]int, 2)
    for i := range c {
        c[i] = make([]int, 2)
    }
    for i := 0; i < 2; i++ {
        for j := 0; j < 2; j++ {
            c[i][j] = a[i][0]*b[0][j] + a[i][1]*b[1][j]
        }
    }
    return c
}`,
    },
    javascript: {
      code: `var climbStairs = function(n) {
    const multiply = (a, b) => {
        return [
            [a[0][0]*b[0][0] + a[0][1]*b[1][0],
             a[0][0]*b[0][1] + a[0][1]*b[1][1]],
            [a[1][0]*b[0][0] + a[1][1]*b[1][0],
             a[1][0]*b[0][1] + a[1][1]*b[1][1]]
        ];
    };
    
    const matrixPow = (m, n) => {
        let result = [[1, 0], [0, 1]];
        while (n > 0) {
            if (n & 1) result = multiply(result, m);
            n >>= 1;
            m = multiply(m, m);
        }
        return result;
    };
    
    const q = [[1, 1], [1, 0]];
    const res = matrixPow(q, n);
    return res[0][0];
};`,
    },
  },
  formula: {
    java: {
      code: `class Solution {
    public int climbStairs(int n) {
        double sqrt5 = Math.sqrt(5);
        double phi = (1 + sqrt5) / 2;
        double psi = (1 - sqrt5) / 2;
        double result = (Math.pow(phi, n + 1) - 
                        Math.pow(psi, n + 1)) / sqrt5;
        return (int) Math.round(result);
    }
}`,
    },
    python: {
      code: `class Solution:
    def climbStairs(self, n: int) -> int:
        import math
        sqrt5 = math.sqrt(5)
        phi = (1 + sqrt5) / 2
        psi = (1 - sqrt5) / 2
        result = (phi ** (n + 1) - psi ** (n + 1)) / sqrt5
        return round(result)`,
    },
    golang: {
      code: `import "math"

func climbStairs(n int) int {
    sqrt5 := math.Sqrt(5)
    phi := (1 + sqrt5) / 2
    psi := (1 - sqrt5) / 2
    result := (math.Pow(phi, float64(n+1)) - 
               math.Pow(psi, float64(n+1))) / sqrt5
    return int(math.Round(result))
}`,
    },
    javascript: {
      code: `var climbStairs = function(n) {
    const sqrt5 = Math.sqrt(5);
    const phi = (1 + sqrt5) / 2;
    const psi = (1 - sqrt5) / 2;
    const result = (Math.pow(phi, n + 1) - 
                   Math.pow(psi, n + 1)) / sqrt5;
    return Math.round(result);
};`,
    },
  },
};

const LANGUAGE_LABELS: Record<Language, string> = {
  java: 'Java',
  python: 'Python',
  golang: 'Go',
  javascript: 'JavaScript',
};

// 样式组件
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #1e1e1e;
`;

const TabBar = styled.div`
  display: flex;
  background: #2d2d2d;
  border-bottom: 1px solid #404040;
`;

const Tab = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
  padding: 6px 12px;
  border: none;
  background: ${props => props.isActive ? '#1e1e1e' : 'transparent'};
  color: ${props => props.isActive ? '#fff' : '#888'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid ${props => props.isActive ? '#4CAF50' : 'transparent'};
  
  &:hover {
    color: #fff;
    background: ${props => props.isActive ? '#1e1e1e' : '#333'};
  }
`;

const CodeContainer = styled.div`
  flex: 1;
  overflow: auto;
  padding: 0;
`;

const Pre = styled.pre`
  margin: 0;
  padding: 12px;
  font-family: 'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #d4d4d4;
  background: #1e1e1e;
  white-space: pre;
  overflow-x: auto;
`;

const LineNumber = styled.span`
  display: inline-block;
  width: 30px;
  color: #858585;
  text-align: right;
  padding-right: 12px;
  user-select: none;
`;

const CodeLineWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isHighlighted', 'isExecuting'].includes(prop),
})<{ isHighlighted?: boolean; isExecuting?: boolean }>`
  display: flex;
  align-items: center;
  background: ${props => {
    if (props.isExecuting) return 'rgba(76, 175, 80, 0.2)';
    if (props.isHighlighted) return 'rgba(255, 235, 59, 0.1)';
    return 'transparent';
  }};
  border-left: ${props => {
    if (props.isExecuting) return '3px solid #4CAF50';
    if (props.isHighlighted) return '3px solid #FFEB3B';
    return '3px solid transparent';
  }};
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const CodeContent = styled.span`
  flex: 1;
`;

const VariableValue = styled.span`
  color: #9CDCFE;
  font-size: 11px;
  margin-left: 16px;
  padding: 2px 6px;
  background: rgba(156, 220, 254, 0.1);
  border-radius: 3px;
  white-space: nowrap;
`;

// 语法高亮颜色
const COLORS = {
  keyword: '#569cd6',
  string: '#ce9178',
  number: '#b5cea8',
  comment: '#6a9955',
  function: '#dcdcaa',
  type: '#4ec9b0',
};

// 转义HTML特殊字符
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// 语法高亮处理
const applyHighlight = (line: string, language: Language): string => {
  const escaped = escapeHtml(line);
  let highlighted = escaped;
  
  const keywords: Record<Language, string[]> = {
    java: ['class', 'public', 'private', 'protected', 'static', 'final', 'int', 'double', 'void', 'return', 'if', 'else', 'for', 'while', 'new', 'this', 'true', 'false', 'null'],
    python: ['class', 'def', 'return', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'in', 'range', 'int', 'True', 'False', 'None', 'self', 'and', 'or', 'not'],
    golang: ['func', 'return', 'if', 'else', 'for', 'var', 'int', 'float64', 'make', 'range', 'import', 'package', 'true', 'false', 'nil'],
    javascript: ['var', 'const', 'let', 'function', 'return', 'if', 'else', 'for', 'while', 'new', 'this', 'true', 'false', 'null', 'undefined'],
  };
  
  // 处理注释
  if (language === 'python') {
    highlighted = highlighted.replace(/(#.*)$/g, `<span style="color: ${COLORS.comment};">$1</span>`);
  } else {
    highlighted = highlighted.replace(/(\/\/.*)$/g, `<span style="color: ${COLORS.comment};">$1</span>`);
  }
  
  // 处理字符串
  highlighted = highlighted.replace(/(&quot;[^&]*&quot;|&#039;[^&]*&#039;)/g, `<span style="color: ${COLORS.string};">$1</span>`);
  
  // 处理数字
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, `<span style="color: ${COLORS.number};">$1</span>`);
  
  // 处理关键字
  keywords[language].forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span style="color: ${COLORS.keyword};">$1</span>`);
  });
  
  // 处理函数名
  if (language === 'java' || language === 'javascript') {
    highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, `<span style="color: ${COLORS.function};">$1</span>(`);
  } else if (language === 'python') {
    highlighted = highlighted.replace(/\b(def)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, `<span style="color: ${COLORS.keyword};">$1</span> <span style="color: ${COLORS.function};">$2</span>`);
  } else if (language === 'golang') {
    highlighted = highlighted.replace(/\b(func)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, `<span style="color: ${COLORS.keyword};">$1</span> <span style="color: ${COLORS.function};">$2</span>`);
  }
  
  return highlighted;
};

const CodePanel: React.FC<CodePanelProps> = ({ state, n = 6 }) => {
  const [language, setLanguage] = useState<Language>('java');
  
  // 加载保存的语言偏好
  useEffect(() => {
    languageService.get().then(stored => {
      if (stored) {
        setLanguage(stored);
      }
    });
  }, []);
  
  // 切换语言
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    languageService.set(lang);
  };
  
  const algorithmKey = state.currentAlgorithm;
  const codeData = CODE_DATA[algorithmKey]?.[language];
  
  // 获取当前步骤的代码行映射
  const codeLineMapping = getCodeLineMapping(algorithmKey, state.currentStep, n);
  const highlightedLines = codeLineMapping.lineNumbers[language] || [];
  
  // 获取变量值映射
  const variablesByLine: Record<number, { name: string; value: string | number }[]> = {};
  if (codeLineMapping.variables) {
    codeLineMapping.variables.forEach(v => {
      const lineNum = v.line[language];
      if (!variablesByLine[lineNum]) {
        variablesByLine[lineNum] = [];
      }
      variablesByLine[lineNum].push({ name: v.name, value: v.value });
    });
  }
  
  if (!codeData) {
    return <Container>暂无代码</Container>;
  }
  
  const lines = codeData.code.split('\n');
  
  return (
    <Container>
      <TabBar>
        {(Object.keys(LANGUAGE_LABELS) as Language[]).map(lang => (
          <Tab
            key={lang}
            isActive={language === lang}
            onClick={() => handleLanguageChange(lang)}
          >
            {LANGUAGE_LABELS[lang]}
          </Tab>
        ))}
      </TabBar>
      <CodeContainer>
        <Pre>
          {lines.map((line, index) => {
            const lineNum = index + 1;
            const isHighlighted = highlightedLines.includes(lineNum);
            const lineVariables = variablesByLine[lineNum];
            const highlighted = applyHighlight(line, language);
            
            return (
              <CodeLineWrapper 
                key={index} 
                isHighlighted={isHighlighted}
                isExecuting={isHighlighted && highlightedLines.length === 1}
              >
                <LineNumber>{lineNum}</LineNumber>
                <CodeContent dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />
                {lineVariables && lineVariables.map((v, i) => (
                  <VariableValue key={i}>
                    {v.name} = {String(v.value)}
                  </VariableValue>
                ))}
              </CodeLineWrapper>
            );
          })}
        </Pre>
      </CodeContainer>
    </Container>
  );
};

export default CodePanel;
