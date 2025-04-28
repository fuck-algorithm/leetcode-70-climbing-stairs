// 小人状态枚举
export const CLIMBER_STATE = {
  STANDING: 0,
  CLIMBING_ONE: 1,
  CLIMBING_TWO: 2,
  CELEBRATING: 3,
  THINKING: 4
};

// 颜色常量
export const COLORS = {
  UNCALCULATED: '#E0E0E0', // 未计算阶梯颜色
  CALCULATING: '#FFC107',  // 计算中阶梯颜色
  CALCULATED: '#4CAF50',   // 已计算阶梯颜色
  CURRENT: '#FF5722',      // 当前阶梯边框颜色
  PATH_ONE: '#2196F3',     // 爬1阶路径颜色
  PATH_TWO: '#9C27B0',     // 爬2阶路径颜色
  CLIMBER: '#FF5722',      // 小人颜色
  BUBBLE_BG: '#FFFFFF',    // 气泡背景色
  BUBBLE_BORDER: '#9E9E9E' // 气泡边框色
};

// 动画阶段枚举
export enum ANIMATION_PHASE {
  NONE,
  PREPARE_TO_CLIMB,
  CLIMBING,
  REACHED_TOP,
  CELEBRATING
} 