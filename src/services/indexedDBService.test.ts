import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  languageService, 
  playbackSpeedService, 
  starCacheService,
  type Language 
} from './indexedDBService';

describe('IndexedDB Service', () => {
  describe('Language Service', () => {
    /**
     * **Feature: algorithm-visualization-enhancement, Property 7: Language Preference Round-Trip**
     * **Validates: Requirements 5.6, 5.7**
     * 
     * For any language selection L saved to IndexedDB, reading the preference back 
     * should return the same language L.
     */
    it('Property 7: Language Preference Round-Trip', async () => {
      const languages: Language[] = ['java', 'python', 'golang', 'javascript'];
      
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...languages),
          async (language) => {
            // Save language
            await languageService.set(language);
            
            // Read it back
            const retrieved = await languageService.get();
            
            // Should be the same
            expect(retrieved).toBe(language);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Playback Speed Service', () => {
    /**
     * **Feature: algorithm-visualization-enhancement, Property 11: Playback Speed Persistence Round-Trip**
     * **Validates: Requirements 10.6**
     * 
     * For any playback speed S saved to IndexedDB, reading the speed back 
     * should return the same value S.
     */
    it('Property 11: Playback Speed Persistence Round-Trip', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.double({ min: 0.1, max: 4.0, noNaN: true }),
          async (speed) => {
            // Save speed
            await playbackSpeedService.set(speed);
            
            // Read it back
            const retrieved = await playbackSpeedService.get();
            
            // Should be the same (within floating point tolerance)
            expect(retrieved).toBeCloseTo(speed, 10);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Star Cache Service', () => {
    /**
     * **Feature: algorithm-visualization-enhancement, Property 1: GitHub Star Cache Validity**
     * **Validates: Requirements 2.4**
     * 
     * For any cached Star count with timestamp T, if the current time is within 1 hour of T, 
     * the cache should be valid; if the current time exceeds 1 hour from T, 
     * the cache should be invalid.
     */
    it('Property 1: GitHub Star Cache Validity - valid within 1 hour', () => {
      const cacheDuration = starCacheService.getCacheDuration();
      
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 10000 }), // star count
          fc.integer({ min: 0, max: cacheDuration - 1 }), // time elapsed (within valid range)
          (stars, timeElapsed) => {
            // Create a cache entry
            const cache = {
              stars,
              timestamp: Date.now() - timeElapsed,
            };
            
            // Cache should be valid
            expect(starCacheService.isValid(cache)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Property 1: GitHub Star Cache Validity - invalid after 1 hour', () => {
      const cacheDuration = starCacheService.getCacheDuration();
      
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 10000 }), // star count
          fc.integer({ min: cacheDuration, max: cacheDuration * 10 }), // time elapsed (beyond valid range)
          (stars, timeElapsed) => {
            // Create an expired cache entry
            const cache = {
              stars,
              timestamp: Date.now() - timeElapsed,
            };
            
            // Cache should be invalid
            expect(starCacheService.isValid(cache)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return false for null cache', () => {
      expect(starCacheService.isValid(null)).toBe(false);
    });

    it('should save and retrieve star cache', async () => {
      await starCacheService.set(42);
      const cache = await starCacheService.get();
      
      expect(cache).not.toBeNull();
      expect(cache?.stars).toBe(42);
      expect(starCacheService.isValid(cache)).toBe(true);
    });
  });
});
