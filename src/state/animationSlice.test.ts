import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  animationReducer, 
  setAlgorithm, 
  resetAnimation,
  setCurrentStep,
  playPause,
  type AnimationState 
} from './animationSlice';

// 创建初始状态
const createInitialState = (): AnimationState => ({
  currentAlgorithm: 'dp',
  isPlaying: false,
  currentStep: 0,
  totalSteps: 10,
  staircase: { nodes: [], links: [] },
  matrix: [],
  formula: '',
  timeline: [],
  playbackSpeed: 1.0,
  stepStatuses: [],
  values: [],
  animationInProgress: false,
});

describe('Animation Slice', () => {
  /**
   * **Feature: algorithm-visualization-enhancement, Property 4: Algorithm Switch State Reset**
   * **Validates: Requirements 4.3**
   * 
   * For any algorithm switch from algorithm A to algorithm B, the animation state 
   * should be reset to step 0 with isPlaying set to false.
   */
  it('Property 4: Algorithm Switch State Reset', () => {
    const algorithms = ['dp', 'matrix', 'formula'] as const;
    
    fc.assert(
      fc.property(
        fc.constantFrom(...algorithms), // from algorithm
        fc.constantFrom(...algorithms), // to algorithm
        fc.integer({ min: 0, max: 100 }), // current step before switch
        fc.boolean(), // isPlaying before switch
        (fromAlgo, toAlgo, currentStep, isPlaying) => {
          // Create state with some progress
          const state: AnimationState = {
            ...createInitialState(),
            currentAlgorithm: fromAlgo,
            currentStep,
            totalSteps: 100,
            isPlaying,
            animationInProgress: isPlaying,
          };
          
          // Switch algorithm
          const newState = animationReducer(state, setAlgorithm(toAlgo));
          
          // Verify state is reset
          expect(newState.currentAlgorithm).toBe(toAlgo);
          expect(newState.currentStep).toBe(0);
          expect(newState.isPlaying).toBe(false);
          expect(newState.animationInProgress).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reset animation to initial state', () => {
    const state: AnimationState = {
      ...createInitialState(),
      currentStep: 5,
      isPlaying: true,
      animationInProgress: true,
    };
    
    const newState = animationReducer(state, resetAnimation());
    
    expect(newState.currentStep).toBe(0);
    expect(newState.isPlaying).toBe(false);
    expect(newState.animationInProgress).toBe(false);
  });

  it('should set current step within valid range', () => {
    const state = createInitialState();
    
    // Valid step
    const newState = animationReducer(state, setCurrentStep(5));
    expect(newState.currentStep).toBe(5);
    
    // Invalid step (out of range) - should not change
    const invalidState = animationReducer(state, setCurrentStep(100));
    expect(invalidState.currentStep).toBe(0);
  });

  it('should toggle play/pause', () => {
    const state = createInitialState();
    
    // Play
    const playingState = animationReducer(state, playPause());
    expect(playingState.isPlaying).toBe(true);
    
    // Pause
    const pausedState = animationReducer(playingState, playPause());
    expect(pausedState.isPlaying).toBe(false);
  });
});
