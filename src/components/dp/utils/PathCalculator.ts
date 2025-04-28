// 计算爬楼梯路径
export const calculateClimbingPath = (
  fromIndex: number,
  toIndex: number,
  stairsPositions: { x: number, y: number }[]
): { x: number, y: number }[] => {
  if (fromIndex >= stairsPositions.length || toIndex >= stairsPositions.length) return [];
  
  const fromPos = stairsPositions[fromIndex];
  const toPos = stairsPositions[toIndex];
  const pathPoints = [];
  
  // 生成平滑的贝塞尔曲线路径
  const steps = 20; // 路径点数量
  
  // 确定控制点 - 制造弧线效果
  const controlX = (fromPos.x + toPos.x) / 2;
  const controlY = Math.min(fromPos.y, toPos.y) - 50; // 控制点在上方
  
  // 生成贝塞尔曲线点
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // 二次贝塞尔曲线公式
    const x = (1 - t) * (1 - t) * fromPos.x + 
              2 * (1 - t) * t * controlX + 
              t * t * toPos.x;
    const y = (1 - t) * (1 - t) * (fromPos.y - 20) + 
              2 * (1 - t) * t * controlY + 
              t * t * (toPos.y - 20);
    pathPoints.push({x, y});
  }
  
  return pathPoints;
}; 