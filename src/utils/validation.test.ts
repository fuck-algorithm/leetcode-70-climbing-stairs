import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateStairsInput, generateRandomStairs } from './validation';

describe('Validation Utils', () => {
  describe('validateStairsInput', () => {
    /**
     * **Feature: algorithm-visualization-enhancement, Property 3: Input Validation Correctness**
     * **Validates: Requirements 3.7, 3.8**
     * 
     * For any user input value V, if V is an integer in [1, 45], the validation should pass;
     * if V is outside this range or not a valid integer, the validation should fail.
     */
    it('Property 3: Input Validation Correctness - valid inputs pass', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 45 }),
          (value) => {
            const result = validateStairsInput(value);
            expect(result.isValid).toBe(true);
            expect(result.errorMessage).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Property 3: Input Validation Correctness - values below min fail', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -1000, max: 0 }),
          (value) => {
            const result = validateStairsInput(value);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Property 3: Input Validation Correctness - values above max fail', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 46, max: 1000 }),
          (value) => {
            const result = validateStairsInput(value);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Property 3: Input Validation Correctness - non-integer values fail', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1.1, max: 44.9, noNaN: true }).filter(n => !Number.isInteger(n)),
          (value) => {
            const result = validateStairsInput(value);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('请输入整数');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject empty string', () => {
      const result = validateStairsInput('');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('请输入楼梯阶数');
    });

    it('should reject non-numeric string', () => {
      const result = validateStairsInput('abc');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('请输入有效数字');
    });

    it('should accept valid string numbers', () => {
      const result = validateStairsInput('10');
      expect(result.isValid).toBe(true);
    });
  });

  describe('generateRandomStairs', () => {
    /**
     * **Feature: algorithm-visualization-enhancement, Property 2: Random Number Generation Range**
     * **Validates: Requirements 3.6**
     * 
     * For any invocation of the random generation function, the generated number 
     * should be an integer in the range [1, 45] inclusive.
     */
    it('Property 2: Random Number Generation Range', () => {
      fc.assert(
        fc.property(
          fc.constant(null), // We don't need input, just run the function
          () => {
            const result = generateRandomStairs();
            
            // Should be an integer
            expect(Number.isInteger(result)).toBe(true);
            
            // Should be in range [1, 45]
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(45);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should respect custom min/max', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 20 }),
          fc.integer({ min: 21, max: 45 }),
          (min, max) => {
            const result = generateRandomStairs(min, max);
            expect(result).toBeGreaterThanOrEqual(min);
            expect(result).toBeLessThanOrEqual(max);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
