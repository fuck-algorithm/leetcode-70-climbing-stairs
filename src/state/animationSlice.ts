import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义动画状态接口
export interface AnimationState {
  currentAlgorithm: 'dp' | 'matrix' | 'formula';
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  staircase: {
    nodes: { x: number; y: number; value: number; id: number; status?: 'uncalculated' | 'calculating' | 'calculated' }[];
    links: { source: number; target: number }[];
  };
  matrix: number[][];
  formula: string;
  timeline: AnimationTimeline[];
  playbackSpeed: number;
  stepStatuses: ('uncalculated' | 'calculating' | 'calculated')[];
  values: number[];
  animationInProgress: boolean;
}

export interface AnimationTimeline {
  timestamp: number;
  description: string;
  visualChanges: {
    nodeUpdates: { 
      index: number; 
      props: Partial<{ 
        x: number; 
        y: number; 
        value: number;
        status: 'uncalculated' | 'calculating' | 'calculated';
      }>
    }[];
    matrixUpdates: { row: number; col: number; value: number }[];
    formulaUpdate: string | null;
  };
  interactionPoints: { event: 'click' | 'drag'; element: string; action: () => void }[];
  explanation?: {
    simple: string;
    detailed: string;
    expert: string;
  };
  code?: string | null;
}

// 初始状态
const initialState: AnimationState = {
  currentAlgorithm: 'dp',
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

// 动作类型常量 - 用于内部引用
const _PLAY_PAUSE = 'animation/playPause';
const _RESET_ANIMATION = 'animation/resetAnimation';
const _UPDATE_STAIRCASE = 'animation/updateStaircase';
const _UPDATE_MATRIX = 'animation/updateMatrix';
const _UPDATE_FORMULA = 'animation/updateFormula';
const _SET_ALGORITHM = 'animation/setAlgorithm';
const _SET_CURRENT_STEP = 'animation/setCurrentStep';
const _SET_PLAYBACK_SPEED = 'animation/setPlaybackSpeed';
export const INITIALIZE = 'animation/initialize';
const _UPDATE_STEP_DATA = 'animation/updateStepData';
const _SET_ANIMATION_STATE = 'animation/setAnimationState';

// 导出动作类型常量供外部使用
export const ACTION_TYPES = {
  PLAY_PAUSE: _PLAY_PAUSE,
  RESET_ANIMATION: _RESET_ANIMATION,
  UPDATE_STAIRCASE: _UPDATE_STAIRCASE,
  UPDATE_MATRIX: _UPDATE_MATRIX,
  UPDATE_FORMULA: _UPDATE_FORMULA,
  SET_ALGORITHM: _SET_ALGORITHM,
  SET_CURRENT_STEP: _SET_CURRENT_STEP,
  SET_PLAYBACK_SPEED: _SET_PLAYBACK_SPEED,
  INITIALIZE,
  UPDATE_STEP_DATA: _UPDATE_STEP_DATA,
  SET_ANIMATION_STATE: _SET_ANIMATION_STATE
};

// 创建 slice
const animationSlice = createSlice({
  name: 'animation',
  initialState,
  reducers: {
    // 初始化动画状态
    initialize(state: AnimationState, action: PayloadAction<{
      totalSteps: number;
      values: number[];
      stepStatuses: ('uncalculated' | 'calculating' | 'calculated')[];
      timeline: AnimationTimeline[];
    }>) {
      console.log("初始化动画状态，接收的数据:", JSON.stringify({
        totalSteps: action.payload.totalSteps,
        valuesLength: action.payload.values?.length || 0,
        statusesLength: action.payload.stepStatuses?.length || 0,
        timelineLength: action.payload.timeline?.length || 0
      }));
      
      // 检查时间线数据
      if (!action.payload.timeline || action.payload.timeline.length === 0) {
        console.error("警告：初始化动画时收到的时间线为空或不存在!");
      }
      
      // 检查步骤数据的完整性
      if (action.payload.totalSteps !== action.payload.timeline?.length) {
        console.warn(`步骤数量不匹配: totalSteps=${action.payload.totalSteps}, timelineLength=${action.payload.timeline?.length || 0}`);
      }
      
      state.isPlaying = false;
      state.currentStep = 0;
      state.totalSteps = action.payload.totalSteps || 0;
      state.values = action.payload.values || [];
      state.stepStatuses = action.payload.stepStatuses || [];
      state.timeline = action.payload.timeline || [];
      
      console.log("动画初始化完成:", {
        totalSteps: state.totalSteps,
        valuesLength: state.values.length,
        statusesLength: state.stepStatuses.length,
        timelineLength: state.timeline.length
      });
    },
    
    // 播放/暂停动画
    playPause(state: AnimationState) {
      state.isPlaying = !state.isPlaying;
      console.log("播放状态切换:", state.isPlaying);
    },
    
    // 重置动画
    resetAnimation(state: AnimationState) {
      state.isPlaying = false;
      state.currentStep = 0;
      state.animationInProgress = false; // 重置时停止所有动画
      console.log("动画已重置");
    },
    
    // 设置当前步骤
    setCurrentStep(state: AnimationState, action: PayloadAction<number>) {
      if (action.payload >= 0 && action.payload < state.totalSteps) {
        state.currentStep = action.payload;
        console.log("当前步骤设置为:", state.currentStep);
      }
    },
    
    // 下一步
    nextStep(state: AnimationState) {
      if (state.currentStep < state.totalSteps - 1) {
        state.currentStep += 1;
        console.log("前进到下一步:", state.currentStep);
      } else {
        state.isPlaying = false;
        console.log("动画结束，暂停播放");
      }
    },
    
    // 设置播放速度
    setPlaybackSpeed(state: AnimationState, action: PayloadAction<number>) {
      if (action.payload > 0) {
        state.playbackSpeed = action.payload;
        console.log("播放速度设置为:", state.playbackSpeed);
      }
    },
    
    // 添加更新楼梯状态的reducer
    updateStaircase(state: AnimationState, action: PayloadAction<AnimationState['staircase']>) {
      state.staircase = action.payload;
    },
    
    // 添加更新矩阵的reducer
    updateMatrix(state: AnimationState, action: PayloadAction<AnimationState['matrix']>) {
      state.matrix = action.payload;
    },
    
    // 添加更新公式的reducer
    updateFormula(state: AnimationState, action: PayloadAction<string>) {
      state.formula = action.payload;
    },
    
    // 添加设置算法的reducer
    setAlgorithm(state: AnimationState, action: PayloadAction<AnimationState['currentAlgorithm']>) {
      state.currentAlgorithm = action.payload;
    },
    
    // 添加更新步骤数据的reducer
    updateStepData(state: AnimationState, action: PayloadAction<{ 
      stepStatuses: AnimationState['stepStatuses']; 
      values: AnimationState['values'] 
    }>) {
      state.stepStatuses = action.payload.stepStatuses;
      state.values = action.payload.values;
    },
    
    // 添加设置动画状态的reducer
    setAnimationState(state: AnimationState, action: PayloadAction<{
      animationInProgress?: boolean;
    }>) {
      if (action.payload.animationInProgress !== undefined) {
        state.animationInProgress = action.payload.animationInProgress;
        console.log("动画进行状态设置为:", state.animationInProgress);
      }
    }
  }
});

// 导出 actions
export const {
  initialize,
  playPause,
  resetAnimation,
  setCurrentStep,
  nextStep,
  setPlaybackSpeed,
  updateStaircase,
  updateMatrix,
  updateFormula,
  setAlgorithm,
  updateStepData,
  setAnimationState
} = animationSlice.actions;

// 导出 reducer
export default animationSlice.reducer;

// 为了兼容App.tsx中的导入，添加animationReducer作为reducer的别名导出
export const animationReducer = animationSlice.reducer; 