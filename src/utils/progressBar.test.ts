import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { progressToStep, stepToProgress } from './progressBar';

describe('Progress Bar Utils', () => {
  /**
   * **Feature: algorithm-visualization-enhancement, Property 12: Progress Bar Step Mapping**
   * **Validates: Requirements 10.8**
   * 
   * For any progress bar position P (0-100%), dragging to P should set the current step 
   * to a valid step index within [0, totalSteps - 1].
   */
  it('Property 12: Progress Bar Step Mapping - valid step range', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 100, noNaN: true }),
        fc.integer({ min: 1, max: 100 }),
        (progressPercent, totalSteps) => {
          const step = progressToStep(progressPercent, totalSteps);
          
          // Step should be a non-negative integer
          expect(Number.isInteger(step)).toBe(true);
          expect(step).toBeGreaterThanOrEqual(0);
          
          // Step should not exceed totalSteps - 1
          expect(step).toBeLessThan(totalSteps);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 12: Progress Bar Step Mapping - boundary values', () => {
    // 0% should map to step 0
    expect(progressToStep(0, 10)).toBe(0);
    
    // 100% should map to last step
    expect(progressToStep(100, 10)).toBe(9);
    
    // 50% should map to middle step
    expect(progressToStep(50, 10)).toBe(5);
  });

  it('should handle edge cases', () => {
    // Single step
    expect(progressToStep(50, 1)).toBe(0);
    
    // Zero steps
    expect(progressToStep(50, 0)).toBe(0);
    
    // Negative progress (should clamp to 0)
    expect(progressToStep(-10, 10)).toBe(0);
    
    // Progress > 100 (should clamp to max)
    expect(progressToStep(150, 10)).toBe(9);
  });

  it('stepToProgress should be inverse of progressToStep for boundary values', () => {
    const totalSteps = 10;
    
    // First step
    expect(stepToProgress(0, totalSteps)).toBe(0);
    
    // Last step
    expect(stepToProgress(9, totalSteps)).toBe(100);
  });

  it('round-trip consistency for step values', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 99 }),
        fc.integer({ min: 2, max: 100 }),
        (step, totalSteps) => {
          // Ensure step is valid for totalSteps
          const validStep = Math.min(step, totalSteps - 1);
          
          // Convert step to progress and back
          const progress = stepToProgress(validStep, totalSteps);
          const recoveredStep = progressToStep(progress, totalSteps);
          
          // Should recover the same step
          expect(recoveredStep).toBe(validStep);
        }
      ),
      { numRuns: 100 }
    );
  });
});
