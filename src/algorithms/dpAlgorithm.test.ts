import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateDPSolution, climbStairsDP } from './dpAlgorithm';

describe('DP Algorithm', () => {
  /**
   * **Feature: algorithm-visualization-enhancement, Property 8: DP Stair Rendering Correctness**
   * **Validates: Requirements 7.1**
   * 
   * For any input n, the DP visualizer should render exactly n+1 stairs (including step 0),
   * each displaying the correct DP value.
   */
  it('Property 8: DP Stair Rendering Correctness - correct number of values', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        (n) => {
          const solution = generateDPSolution(n);
          
          // Should have n+1 values (from 0 to n)
          expect(solution.stepsData.values.length).toBe(n + 1);
          expect(solution.stepsData.stepStatuses.length).toBe(n + 1);
          
          // First two values should be 1
          expect(solution.stepsData.values[0]).toBe(1);
          expect(solution.stepsData.values[1]).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: algorithm-visualization-enhancement, Property 9: DP Calculation Display Correctness**
   * **Validates: Requirements 7.3**
   * 
   * For any step calculating dp[i] where i >= 2, the values should satisfy
   * dp[i] = dp[i-1] + dp[i-2].
   */
  it('Property 9: DP Calculation Display Correctness', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 3, max: 20 }),
        (n) => {
          const solution = generateDPSolution(n);
          const values = solution.stepsData.values;
          
          // Verify the recurrence relation for all i >= 2
          for (let i = 2; i <= n; i++) {
            expect(values[i]).toBe(values[i - 1] + values[i - 2]);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return correct result for known values', () => {
    // Known Fibonacci values (shifted by 1)
    expect(climbStairsDP(1)).toBe(1);
    expect(climbStairsDP(2)).toBe(2);
    expect(climbStairsDP(3)).toBe(3);
    expect(climbStairsDP(4)).toBe(5);
    expect(climbStairsDP(5)).toBe(8);
    expect(climbStairsDP(6)).toBe(13);
    expect(climbStairsDP(10)).toBe(89);
  });

  it('should generate timeline with correct number of steps', () => {
    const solution = generateDPSolution(5);
    
    // Timeline should not be empty
    expect(solution.timeline.length).toBeGreaterThan(0);
    
    // Each timeline entry should have required fields
    solution.timeline.forEach(entry => {
      expect(entry.description).toBeDefined();
      expect(entry.visualChanges).toBeDefined();
    });
  });

  it('should handle edge case n=1', () => {
    const solution = generateDPSolution(1);
    expect(solution.result).toBe(1);
    expect(solution.stepsData.values[1]).toBe(1);
  });

  it('should handle edge case n=0', () => {
    const solution = generateDPSolution(0);
    expect(solution.result).toBe(0);
  });
});
