import { useEffect } from 'react';

interface InitializationProps {
  n: number;
  width: number;
  height: number;
  setStairsPositions: (positions: { x: number, y: number }[]) => void;
  setClimberPosition: (position: { x: number, y: number }) => void;
  setTargetPosition: (position: { x: number, y: number }) => void;
  setIsInitialized: (initialized: boolean) => void;
  drawCanvas: () => void;
}

// 初始化楼梯位置的钩子
export const useStairInitialization = ({
  n,
  width,
  height,
  setStairsPositions,
  setClimberPosition,
  setTargetPosition,
  setIsInitialized,
  drawCanvas
}: InitializationProps) => {
  // 初始化楼梯位置
  useEffect(() => {
    console.log("初始化楼梯位置, n =", n);
    // 确保楼梯数量能完全显示算法所需的步骤
    const stepsCount = n + 1; // 从0阶到n阶
    const positions = [];
    
    // 使用更精确的楼梯位置计算
    // 计算每个阶梯的位置 - 确保垂直与水平方向的均匀分布
    for (let i = 0; i < stepsCount; i++) {
      // 水平方向上从左至右均匀分布，垂直方向从底部向上
      const horizontalStep = width * 0.6 / (stepsCount > 1 ? stepsCount - 1 : 1);
      const verticalStep = height * 0.6 / (stepsCount > 1 ? stepsCount - 1 : 1);
      
      // 对较高楼梯添加轻微水平偏移以产生阶梯效果
      const horizontalOffset = i * 0.5;
      
      const x = width * 0.2 + i * horizontalStep + horizontalOffset;
      const y = height * 0.85 - i * verticalStep;
      
      positions.push({ x, y });
    }
    
    setStairsPositions(positions);
    
    // 设置小人初始位置在第0阶楼梯上
    if (positions.length > 0) {
      const initialPos = positions[0]; // 0阶楼梯
      const initialPosition = {
        x: initialPos.x, 
        y: initialPos.y - 30 // 站在楼梯上方
      };
      
      setClimberPosition(initialPosition);
      setTargetPosition(initialPosition);
      
      console.log("初始化小人位置在第0阶楼梯:", initialPosition);
    }
    
    // 设置初始化完成标志
    setIsInitialized(true);
    
    // 强制在下一个渲染周期绘制
    requestAnimationFrame(() => {
      drawCanvas();
    });
  }, [n, width, height, setStairsPositions, setClimberPosition, setTargetPosition, setIsInitialized, drawCanvas]);
}; 