/**
 * Color validation utilities for ensuring no purple colors are used
 * **Feature: algorithm-visualization-enhancement, Property 14: No Purple Color Usage**
 * **Validates: Requirements 13.2**
 */

/**
 * Convert hex color to HSL
 * @param hex - Hex color string (e.g., "#FF5722" or "FF5722")
 * @returns HSL values { h: 0-360, s: 0-100, l: 0-100 } or null if invalid
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  if (hex.length !== 6) {
    return null;
  }
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  
  let h = 0;
  let s = 0;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Check if a color is purple (hue between 260-330 degrees)
 * This includes violet, purple, magenta, and blue-violet (indigo) colors
 * @param hex - Hex color string
 * @returns true if the color is purple, false otherwise
 */
export function isPurpleColor(hex: string): boolean {
  const hsl = hexToHSL(hex);
  if (!hsl) return false;
  
  // Purple hues are typically between 260-330 degrees
  // This includes indigo (around 230-260) and violet/magenta (270-330)
  // Also check for saturation > 20% to exclude grays
  return hsl.h >= 260 && hsl.h <= 330 && hsl.s > 20;
}

/**
 * Extract all hex colors from a string
 * @param content - String content to search
 * @returns Array of hex color strings found
 */
export function extractHexColors(content: string): string[] {
  const hexPattern = /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/g;
  const matches = content.match(hexPattern) || [];
  return [...new Set(matches)]; // Remove duplicates
}

/**
 * Validate that no purple colors are present in the given colors
 * @param colors - Array of hex color strings
 * @returns Object with validation result and any purple colors found
 */
export function validateNoPurpleColors(colors: string[]): { 
  isValid: boolean; 
  purpleColors: string[] 
} {
  const purpleColors = colors.filter(isPurpleColor);
  return {
    isValid: purpleColors.length === 0,
    purpleColors
  };
}

// List of all colors used in the application (for testing)
export const APPLICATION_COLORS = [
  // Primary colors
  '#4CAF50', // Green (DP)
  '#2196F3', // Blue (Matrix)
  '#FF9800', // Orange (Formula)
  
  // Text colors
  '#333', '#333333',
  '#555', '#555555',
  '#666', '#666666',
  '#757575',
  '#424242',
  '#616161',
  '#999', '#999999',
  '#213547',
  
  // Background colors
  '#fff', '#ffffff',
  '#f0f0f0',
  '#f8f9fa',
  '#f9f9f9',
  '#FAFAFA',
  '#F5F5F5',
  '#E0E0E0',
  '#EEEEEE',
  '#E8F5E9',
  '#E3F2FD',
  '#FFF8E1',
  '#BBDEFB',
  '#1a1a1a',
  
  // Accent colors
  '#FF5722', // Highlight
  '#f44336', // Error red
  '#D32F2F', // Dark red
  '#FFC107', // Amber
  '#FFB300', // Dark amber
  '#FF6F00', // Deep orange
  
  // Blue shades
  '#1976D2',
  '#1565C0',
  '#42A5F5',
  '#0288D1',
  
  // Green shades
  '#2e7d32', '#2E7D32',
  '#45a049',
  
  // Brown shades
  '#5D4037',
  
  // Gray shades
  '#9E9E9E',
  '#ddd', '#dddddd',
];
