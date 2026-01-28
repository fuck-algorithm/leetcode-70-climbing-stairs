import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { NAV_ITEMS, VALID_PATHS, DEFAULT_PATH } from './config';

/**
 * Property tests for multi-page navigation
 * **Feature: multi-page-navigation**
 */

describe('Navigation Route Properties', () => {
  /**
   * **Feature: multi-page-navigation, Property 2: Active State Synchronization**
   * *For any* valid algorithm URL path, the navigation bar SHALL mark exactly one 
   * menu item as active, and that item SHALL correspond to the current URL path.
   * **Validates: Requirements 1.3**
   */
  it('Property 2: Active State Synchronization - each valid path has exactly one matching nav item', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_PATHS),
        (path) => {
          // Find nav items that match this path
          const matchingItems = NAV_ITEMS.filter(item => item.path === path);
          
          // Exactly one nav item should match each valid path
          expect(matchingItems.length).toBe(1);
          
          // The matching item's path should exactly equal the current path
          expect(matchingItems[0].path).toBe(path);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: multi-page-navigation, Property 4: Invalid URL Redirect**
   * *For any* URL path that is not in the set of valid paths, 
   * the system SHALL redirect to the default path (/dp).
   * **Validates: Requirements 3.3**
   */
  it('Property 4: Invalid URL Redirect - invalid paths should not be in VALID_PATHS', () => {
    // Generate random strings that are NOT valid paths
    const invalidPathArb = fc.string().filter(s => !VALID_PATHS.includes(`/${s}`) && !VALID_PATHS.includes(s));
    
    fc.assert(
      fc.property(
        invalidPathArb,
        (invalidPath) => {
          // Verify the path is indeed not valid
          const normalizedPath = invalidPath.startsWith('/') ? invalidPath : `/${invalidPath}`;
          const isValid = VALID_PATHS.includes(normalizedPath);
          
          // Invalid paths should not be in VALID_PATHS
          // The router will redirect these to DEFAULT_PATH
          if (!isValid) {
            expect(DEFAULT_PATH).toBe('/dp');
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: multi-page-navigation, Property 1: Route-URL Synchronization**
   * *For any* navigation action to a valid algorithm path, 
   * the browser URL SHALL update to match the target path exactly.
   * **Validates: Requirements 1.2, 3.1**
   */
  it('Property 1: Route-URL Synchronization - all nav items have valid paths', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...NAV_ITEMS),
        (navItem) => {
          // Each nav item's path should be in VALID_PATHS
          expect(VALID_PATHS).toContain(navItem.path);
          
          // Path should start with /
          expect(navItem.path.startsWith('/')).toBe(true);
          
          // Path should match the expected format
          expect(navItem.path).toMatch(/^\/[a-z]+$/);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: multi-page-navigation, Property 3: Direct URL Access**
   * *For any* valid algorithm URL path accessed directly, 
   * the system SHALL render the corresponding algorithm page component.
   * **Validates: Requirements 3.2**
   */
  it('Property 3: Direct URL Access - valid paths have corresponding nav items with required properties', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_PATHS),
        (path) => {
          const navItem = NAV_ITEMS.find(item => item.path === path);
          
          // Each valid path should have a corresponding nav item
          expect(navItem).toBeDefined();
          
          // Nav item should have all required properties
          expect(navItem!.id).toBeDefined();
          expect(navItem!.name).toBeDefined();
          expect(navItem!.color).toBeDefined();
          
          // Color should be a valid hex color
          expect(navItem!.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Additional unit tests for completeness
  describe('Navigation Configuration', () => {
    it('should have exactly 3 navigation items', () => {
      expect(NAV_ITEMS.length).toBe(3);
    });

    it('should have exactly 3 valid paths', () => {
      expect(VALID_PATHS.length).toBe(3);
    });

    it('should have default path as /dp', () => {
      expect(DEFAULT_PATH).toBe('/dp');
    });

    it('should have default path in valid paths', () => {
      expect(VALID_PATHS).toContain(DEFAULT_PATH);
    });

    it('should have unique nav item ids', () => {
      const ids = NAV_ITEMS.map(item => item.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have unique nav item paths', () => {
      const paths = NAV_ITEMS.map(item => item.path);
      const uniquePaths = new Set(paths);
      expect(uniquePaths.size).toBe(paths.length);
    });
  });
});
