import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  hexToHSL, 
  isPurpleColor, 
  extractHexColors, 
  validateNoPurpleColors,
  APPLICATION_COLORS 
} from './colorValidation';

/**
 * **Feature: algorithm-visualization-enhancement, Property 14: No Purple Color Usage**
 * **Validates: Requirements 13.2**
 * 
 * For any rendered element in the DOM, its computed color values 
 * (color, background-color, border-color) should not contain purple hues 
 * (hue values between 270-330 degrees in HSL).
 */

describe('Color Validation Property Tests', () => {
  describe('hexToHSL', () => {
    it('should correctly convert known colors', () => {
      // Red
      const red = hexToHSL('#FF0000');
      expect(red?.h).toBe(0);
      expect(red?.s).toBe(100);
      expect(red?.l).toBe(50);
      
      // Green
      const green = hexToHSL('#00FF00');
      expect(green?.h).toBe(120);
      
      // Blue
      const blue = hexToHSL('#0000FF');
      expect(blue?.h).toBe(240);
      
      // Purple (should be around 270-300)
      const purple = hexToHSL('#800080');
      expect(purple?.h).toBe(300);
    });

    it('should handle 3-digit hex colors', () => {
      const white = hexToHSL('#FFF');
      expect(white?.l).toBe(100);
      
      const black = hexToHSL('#000');
      expect(black?.l).toBe(0);
    });

    it('should return null for invalid hex', () => {
      expect(hexToHSL('invalid')).toBeNull();
      expect(hexToHSL('#GGG')).toBeNull();
      expect(hexToHSL('#12')).toBeNull();
    });
  });

  describe('isPurpleColor', () => {
    it('should identify purple colors correctly', () => {
      // Known purple colors (hue 260-330)
      expect(isPurpleColor('#800080')).toBe(true); // Purple (hue 300)
      expect(isPurpleColor('#9400D3')).toBe(true); // Dark Violet (hue 282)
      expect(isPurpleColor('#8B008B')).toBe(true); // Dark Magenta (hue 300)
      expect(isPurpleColor('#BA55D3')).toBe(true); // Medium Orchid (hue 288)
      expect(isPurpleColor('#9932CC')).toBe(true); // Dark Orchid (hue 280)
      expect(isPurpleColor('#8A2BE2')).toBe(true); // Blue Violet (hue 271)
    });

    it('should not identify non-purple colors as purple', () => {
      // Blue colors
      expect(isPurpleColor('#2196F3')).toBe(false);
      expect(isPurpleColor('#1976D2')).toBe(false);
      expect(isPurpleColor('#0000FF')).toBe(false);
      
      // Green colors
      expect(isPurpleColor('#4CAF50')).toBe(false);
      expect(isPurpleColor('#00FF00')).toBe(false);
      
      // Red colors
      expect(isPurpleColor('#FF0000')).toBe(false);
      expect(isPurpleColor('#f44336')).toBe(false);
      
      // Orange colors
      expect(isPurpleColor('#FF9800')).toBe(false);
      expect(isPurpleColor('#FF5722')).toBe(false);
      
      // Gray colors (low saturation)
      expect(isPurpleColor('#808080')).toBe(false);
      expect(isPurpleColor('#333333')).toBe(false);
    });
  });

  describe('Property 14: No Purple Color Usage', () => {
    /**
     * Property test: All application colors should not be purple
     */
    it('should verify all application colors are not purple', () => {
      const result = validateNoPurpleColors(APPLICATION_COLORS);
      
      if (!result.isValid) {
        console.error('Purple colors found:', result.purpleColors);
      }
      
      expect(result.isValid).toBe(true);
      expect(result.purpleColors).toHaveLength(0);
    });

    /**
     * Property test: For any valid hex color that is not purple,
     * isPurpleColor should return false
     */
    it('should correctly identify non-purple colors', () => {
      // Generate random non-purple hex colors (hue 0-259 or 331-360)
      const nonPurpleHexArbitrary = fc.integer({ min: 0, max: 360 })
        .filter(h => h < 260 || h > 330)
        .chain(h => {
          // Generate a color with this hue
          const s = fc.integer({ min: 30, max: 100 });
          const l = fc.integer({ min: 20, max: 80 });
          return fc.tuple(fc.constant(h), s, l);
        })
        .map(([h, s, l]) => {
          // Convert HSL to hex
          const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
          const x = c * (1 - Math.abs((h / 60) % 2 - 1));
          const m = l / 100 - c / 2;
          
          let r = 0, g = 0, b = 0;
          if (h < 60) { r = c; g = x; b = 0; }
          else if (h < 120) { r = x; g = c; b = 0; }
          else if (h < 180) { r = 0; g = c; b = x; }
          else if (h < 240) { r = 0; g = x; b = c; }
          else if (h < 300) { r = x; g = 0; b = c; }
          else { r = c; g = 0; b = x; }
          
          const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
          return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        });

      fc.assert(
        fc.property(nonPurpleHexArbitrary, (hex) => {
          return !isPurpleColor(hex);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property test: For any valid hex color that is purple,
     * isPurpleColor should return true
     */
    it('should correctly identify purple colors', () => {
      // Generate random purple hex colors (hue 265-325, safely within 260-330)
      const purpleHexArbitrary = fc.integer({ min: 265, max: 325 })
        .chain(h => {
          // Generate a color with this hue and sufficient saturation
          const s = fc.integer({ min: 30, max: 100 });
          const l = fc.integer({ min: 20, max: 80 });
          return fc.tuple(fc.constant(h), s, l);
        })
        .map(([h, s, l]) => {
          // Convert HSL to hex
          const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
          const x = c * (1 - Math.abs((h / 60) % 2 - 1));
          const m = l / 100 - c / 2;
          
          let r = 0, g = 0, b = 0;
          if (h < 60) { r = c; g = x; b = 0; }
          else if (h < 120) { r = x; g = c; b = 0; }
          else if (h < 180) { r = 0; g = c; b = x; }
          else if (h < 240) { r = 0; g = x; b = c; }
          else if (h < 300) { r = x; g = 0; b = c; }
          else { r = c; g = 0; b = x; }
          
          const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
          return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        });

      fc.assert(
        fc.property(purpleHexArbitrary, (hex) => {
          return isPurpleColor(hex);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('extractHexColors', () => {
    it('should extract hex colors from CSS content', () => {
      const css = `
        color: #333;
        background-color: #4CAF50;
        border: 1px solid #ddd;
      `;
      const colors = extractHexColors(css);
      expect(colors).toContain('#333');
      expect(colors).toContain('#4CAF50');
      expect(colors).toContain('#ddd');
    });

    it('should handle 6-digit and 3-digit hex colors', () => {
      const content = '#FFF #000000 #abc #AABBCC';
      const colors = extractHexColors(content);
      expect(colors).toHaveLength(4);
    });

    it('should remove duplicates', () => {
      const content = '#333 #333 #333';
      const colors = extractHexColors(content);
      expect(colors).toHaveLength(1);
    });
  });
});
