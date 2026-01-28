import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getCodeLineMapping, getDPCodeLineMapping } from './codeLineMapping';

describe('Code Line Mapping', () => {
  /**
   * **Feature: algorithm-visualization-enhancement, Property 5: Code Line Highlighting Consistency**
   * **Validates: Requirements 5.4**
   * 
   * For any animation step S with code line mapping M, the highlighted code lines 
   * should be valid line numbers (positive integers).
   */
  it('Property 5: Code Line Highlighting Consistency - all line numbers are valid', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 20 }), // step index
        fc.integer({ min: 2, max: 20 }), // n value
        (stepIndex, n) => {
          const mapping = getDPCodeLineMapping(stepIndex, n);
          
          // All line numbers should be positive integers
          const languages = ['java', 'python', 'golang', 'javascript'] as const;
          languages.forEach(lang => {
            const lines = mapping.lineNumbers[lang];
            lines.forEach(line => {
              expect(Number.isInteger(line)).toBe(true);
              expect(line).toBeGreaterThanOrEqual(0);
            });
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: algorithm-visualization-enhancement, Property 6: Variable Display State Consistency**
   * **Validates: Requirements 5.5**
   * 
   * For any animation step S with variable state V, the variable values should be defined
   * and have valid line mappings.
   */
  it('Property 6: Variable Display State Consistency', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 4, max: 20 }), // step index (loop steps)
        fc.integer({ min: 3, max: 15 }), // n value
        (stepIndex, n) => {
          const mapping = getDPCodeLineMapping(stepIndex, n);
          
          if (mapping.variables) {
            mapping.variables.forEach(variable => {
              // Variable should have a name
              expect(variable.name).toBeDefined();
              expect(typeof variable.name).toBe('string');
              expect(variable.name.length).toBeGreaterThan(0);
              
              // Variable should have a value
              expect(variable.value).toBeDefined();
              
              // Variable should have valid line mappings
              const languages = ['java', 'python', 'golang', 'javascript'] as const;
              languages.forEach(lang => {
                const line = variable.line[lang];
                expect(Number.isInteger(line)).toBe(true);
                expect(line).toBeGreaterThan(0);
              });
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return correct mapping for initialization step', () => {
    const mapping = getCodeLineMapping('dp', 3, 6);
    
    // Initialization step should highlight dp[0] = 1 and dp[1] = 1 lines
    expect(mapping.lineNumbers.java).toContain(5);
    expect(mapping.lineNumbers.java).toContain(6);
    expect(mapping.lineNumbers.java).toContain(7);
  });

  it('should return mapping with step index', () => {
    const mapping = getCodeLineMapping('dp', 5, 6);
    expect(mapping.stepIndex).toBe(5);
  });

  it('should handle different algorithms', () => {
    const dpMapping = getCodeLineMapping('dp', 0, 6);
    const matrixMapping = getCodeLineMapping('matrix', 0, 6);
    const formulaMapping = getCodeLineMapping('formula', 0, 6);
    
    expect(dpMapping.stepIndex).toBe(0);
    expect(matrixMapping.stepIndex).toBe(0);
    expect(formulaMapping.stepIndex).toBe(0);
  });
});
