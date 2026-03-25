import { describe, it, expect } from 'vitest';
import { validateFileType, validateFileSize } from './storage';

describe('storage utility functions', () => {
  describe('validateFileType', () => {
    it('returns true for allowed file types', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      expect(validateFileType(file, ['image/png', 'image/jpeg'])).toBe(true);
    });

    it('returns false for disallowed file types', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      expect(validateFileType(file, ['image/png', 'image/jpeg'])).toBe(false);
    });

    it('returns false when no file is provided', () => {
      expect(validateFileType(undefined, ['image/png'])).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('returns true if file size is within limits', () => {
      const content = new Array(1024 * 1024).fill('a').join(''); // 1MB
      const file = new File([content], 'test.png', { type: 'image/png' });
      expect(validateFileSize(file, 2)).toBe(true);
    });

    it('returns false if file size exceeds limits', () => {
      const content = new Array(1024 * 1024 * 3).fill('a').join(''); // 3MB
      const file = new File([content], 'test.png', { type: 'image/png' });
      expect(validateFileSize(file, 2)).toBe(false);
    });
  });
});
