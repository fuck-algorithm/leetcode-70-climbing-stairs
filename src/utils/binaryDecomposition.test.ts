import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { toBinaryBits, fromBinaryBits, verifyBinaryDecomposition } from './binaryDecomposition';

describe('Binary Decomposition', () => {
  /**
   * **Feature: algorithm-visualization-enhancement, Property 10: Binary Decomposition Correctness**
   * **Validates: Requirements 8.3**
   * 
   * For any input n, the binary representation displayed should equal n 
   * when converted back to decimal.
   */
  it('Property 10: Binary Decomposition Correctness - round trip', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        (n) => {
          const bits = toBinaryBits(n);
          const recovered = fromBinaryBits(bits);
          
          expect(recovered).toBe(n);
          expect(verifyBinaryDecomposition(n, bits)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 10: Binary Decomposition Correctness - bits are valid', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        (n) => {
          const bits = toBinaryBits(n);
          
          // All bits should be 0 or 1
          bits.forEach(bit => {
            expect(bit === 0 || bit === 1).toBe(true);
          });
          
          // First bit should be 1 (no leading zeros)
          if (n > 0) {
            expect(bits[0]).toBe(1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle known values', () => {
    expect(toBinaryBits(1)).toEqual([1]);
    expect(toBinaryBits(2)).toEqual([1, 0]);
    expect(toBinaryBits(3)).toEqual([1, 1]);
    expect(toBinaryBits(4)).toEqual([1, 0, 0]);
    expect(toBinaryBits(5)).toEqual([1, 0, 1]);
    expect(toBinaryBits(6)).toEqual([1, 1, 0]);
    expect(toBinaryBits(7)).toEqual([1, 1, 1]);
    expect(toBinaryBits(8)).toEqual([1, 0, 0, 0]);
  });

  it('should handle edge case n=0', () => {
    expect(toBinaryBits(0)).toEqual([0]);
    expect(fromBinaryBits([0])).toBe(0);
  });

  it('should handle negative numbers', () => {
    expect(toBinaryBits(-1)).toEqual([0]);
  });
});
