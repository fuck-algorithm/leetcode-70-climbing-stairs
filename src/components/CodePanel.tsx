import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AnimationState } from '../state/animationSlice';

interface CodePanelProps {
  state: AnimationState;
}

type Language = 'java' | 'python' | 'golang' | 'javascript';

const LANGUAGE_STORAGE_KEY = 'preferred_code_language';

// 从IndexedDB获取语言偏好
const getStoredLanguage = async (): Promise<Language | null> => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored as Language | null;
  } catch {
    return null;
  }
};

// 保存语言偏好到IndexedDB
const storeLanguage = (lang: Language): void => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // 忽略存储错误
  }
};

// 代码数据
const CODE_DATA: Record<string, Record<Language, { code: string; highlightLines?: number[] }>> = {
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

const Tab = styled.button<{ isActive: boolean }>`
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

const CodeLine = styled.div<{ isHighlighted?: boolean }>`
  display: flex;
  background: ${props => props.isHighlighted ? 'rgba(255, 235, 59, 0.1)' : 'transparent'};
  border-left: ${props => props.isHighlighted ? '3px solid #FFEB3B' : '3px solid transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const CodeContent = styled.span`
  flex: 1;
`;

// 简单的语法高亮
const highlightCode = (code: string, language: Language): React.ReactNode[] => {
  const lines = code.split('\n');
  
  return lines.map((line, index) => {
    let highlighted = line;
    
    // 关键字高亮
    const keywords: Record<Language, string[]> = {
      java: ['class', 'public', 'private', 'int', 'return', 'if', 'for', 'while', 'new', 'void'],
      python: ['class', 'def', 'return', 'if', 'for', 'while', 'import', 'from', 'in', 'range', 'int'],
      golang: ['func', 'return', 'if', 'for', 'var', 'int', 'make', 'range', 'import', 'package'],
      javascript: ['var', 'const', 'let', 'function', 'return', 'if', 'for', 'while', 'new'],
    };
    
    // 简单的高亮处理
    keywords[language].forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span style="color: #569cd6;">$1</span>`);
    });
    
    // 字符串高亮
    highlighted = highlighted.replace(/(["'])(.*?)\1/g, '<span style="color: #ce9178;">$&</span>');
    
    // 数字高亮
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span style="color: #b5cea8;">$1</span>');
    
    // 注释高亮
    highlighted = highlighted.replace(/(\/\/.*$)/g, '<span style="color: #6a9955;">$1</span>');
    highlighted = highlighted.replace(/(#.*$)/g, '<span style="color: #6a9955;">$1</span>');
    
    return (
      <CodeLine key={index}>
        <LineNumber>{index + 1}</LineNumber>
        <CodeContent dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />
      </CodeLine>
    );
  });
};

const CodePanel: React.FC<CodePanelProps> = ({ state }) => {
  const [language, setLanguage] = useState<Language>('java');
  
  // 加载保存的语言偏好
  useEffect(() => {
    getStoredLanguage().then(stored => {
      if (stored) {
        setLanguage(stored);
      }
    });
  }, []);
  
  // 切换语言
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    storeLanguage(lang);
  };
  
  const algorithmKey = state.currentAlgorithm;
  const codeData = CODE_DATA[algorithmKey]?.[language];
  
  if (!codeData) {
    return <Container>暂无代码</Container>;
  }
  
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
          {highlightCode(codeData.code, language)}
        </Pre>
      </CodeContainer>
    </Container>
  );
};

export default CodePanel;