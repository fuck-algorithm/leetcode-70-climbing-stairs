// 定义动画状态接口
export interface AnimationState {
  currentAlgorithm: 'dp' | 'matrix' | 'formula';
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  staircase: {
    nodes: { x: number; y: number; value: number; id: number }[];
    links: { source: number; target: number }[];
  };
  matrix: number[][];
  formula: string;
  timeline: AnimationTimeline[];
  playbackSpeed: number;
}

export interface AnimationTimeline {
  timestamp: number;
  description: string;
  visualChanges: {
    nodeUpdates: { index: number; props: Partial<{ x: number; y: number; value: number }> }[];
    matrixUpdates: { row: number; col: number; value: number }[];
    formulaUpdate: string | null;
  };
  interactionPoints: { event: 'click' | 'drag'; element: string; action: () => void }[];
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
  playbackSpeed: 1.0
};

// 动作类型
export const PLAY_PAUSE = 'animation/playPause';
export const RESET_ANIMATION = 'animation/resetAnimation';
export const UPDATE_STAIRCASE = 'animation/updateStaircase';
export const UPDATE_MATRIX = 'animation/updateMatrix';
export const UPDATE_FORMULA = 'animation/updateFormula';
export const SET_ALGORITHM = 'animation/setAlgorithm';
export const SET_CURRENT_STEP = 'animation/setCurrentStep';
export const SET_PLAYBACK_SPEED = 'animation/setPlaybackSpeed';
export const INITIALIZE = 'animation/initialize';

// 动作创建器
export const playPause = () => ({ type: PLAY_PAUSE });
export const resetAnimation = () => ({ type: RESET_ANIMATION });
export const updateStaircase = (staircase: AnimationState['staircase']) => ({ 
  type: UPDATE_STAIRCASE, 
  payload: staircase 
});
export const updateMatrix = (matrix: AnimationState['matrix']) => ({ 
  type: UPDATE_MATRIX, 
  payload: matrix 
});
export const updateFormula = (formula: string) => ({ 
  type: UPDATE_FORMULA, 
  payload: formula 
});
export const setAlgorithm = (algorithm: AnimationState['currentAlgorithm']) => ({ 
  type: SET_ALGORITHM, 
  payload: algorithm 
});
export const setCurrentStep = (step: number) => ({
  type: SET_CURRENT_STEP,
  payload: step
});
export const setPlaybackSpeed = (speed: number) => ({
  type: SET_PLAYBACK_SPEED,
  payload: speed
});

// Reducer函数
export function animationReducer(state = initialState, action: any): AnimationState {
  switch (action.type) {
    case PLAY_PAUSE:
      return { ...state, isPlaying: !state.isPlaying };
    case RESET_ANIMATION:
      return { 
        ...initialState, 
        currentAlgorithm: state.currentAlgorithm, 
        playbackSpeed: state.playbackSpeed 
      };
    case UPDATE_STAIRCASE:
      return { ...state, staircase: action.payload };
    case UPDATE_MATRIX:
      return { ...state, matrix: action.payload };
    case UPDATE_FORMULA:
      return { ...state, formula: action.payload };
    case SET_ALGORITHM:
      return { 
        ...initialState, 
        currentAlgorithm: action.payload,
        playbackSpeed: state.playbackSpeed
      };
    case SET_CURRENT_STEP:
      const newStep = Math.max(0, Math.min(action.payload, state.totalSteps > 0 ? state.totalSteps - 1 : 0));
      return { ...state, currentStep: newStep };
    case SET_PLAYBACK_SPEED:
      return { ...state, playbackSpeed: Math.max(0.1, action.payload) };
    case INITIALIZE:
      return { 
        ...state, 
        timeline: action.payload.timeline || [],
        totalSteps: action.payload.timeline ? action.payload.timeline.length : 0,
        staircase: action.payload.staircase || { nodes: [], links: [] },
        matrix: action.payload.matrix || [],
        formula: action.payload.formula || '',
        currentStep: 0
      };
    default:
      return state;
  }
} 