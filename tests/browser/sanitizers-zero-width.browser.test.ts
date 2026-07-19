import { describe, it, expect } from 'vitest';
import { stripZeroWidth, escapeHtmlHref } from '../../src/utilities/sanitizers.js';

/**
 * Regression for the ZWJ defect surfaced when eslint was first made to actually
 * run on this package (Cycle 93).
 *
 * `stripZeroWidth` removed U+200D (ZERO WIDTH JOINER) along with the other
 * invisible characters. ZWJ is what binds emoji sequences together, so any chat
 * message containing a family/profession emoji was silently decomposed into its
 * parts (👨‍👩‍👧 → 👨👩👧) — `UMarkedBlock` applies this to message bodies.
 *
 * The two call sites have opposite requirements, so they now use different
 * character sets: display preserves ZWJ, URL sanitization still strips it
 * (a `java<ZWJ>script:` payload must not survive).
 */
describe('zero-width sanitization', () => {
  const ZWSP = '​';
  const ZWJ = '‍';
  const BOM = '﻿';
  const FAMILY = '\u{1F468}‍\u{1F469}‍\u{1F467}';

  describe('stripZeroWidth (display path)', () => {
    it('removes invisible characters', () => {
      expect(stripZeroWidth(`he${ZWSP}llo${BOM}`)).toBe('hello');
    });

    it('preserves ZWJ so emoji sequences survive', () => {
      expect(stripZeroWidth(FAMILY)).toBe(FAMILY);
      expect(stripZeroWidth(`${ZWSP}${FAMILY}`)).toBe(FAMILY);
    });

    it('returns the input unchanged when there is nothing to strip', () => {
      expect(stripZeroWidth('plain text')).toBe('plain text');
    });

    it('is not affected by lastIndex across repeated calls (global regex reuse)', () => {
      const dirty = `a${ZWSP}b${ZWSP}c`;
      expect(stripZeroWidth(dirty)).toBe('abc');
      expect(stripZeroWidth(dirty)).toBe('abc');
      expect(stripZeroWidth(dirty)).toBe('abc');
    });
  });

  describe('escapeHtmlHref (URL path)', () => {
    it('still strips ZWJ used to obfuscate a dangerous protocol', () => {
      expect(escapeHtmlHref(`java${ZWJ}script:alert(1)`)).not.toContain('javascript:');
    });

    it('strips other zero-width obfuscation too', () => {
      expect(escapeHtmlHref(`java${ZWSP}script:alert(1)`)).not.toContain('javascript:');
    });

    it('leaves a safe URL usable', () => {
      expect(escapeHtmlHref('https://example.com/a?b=1')).toContain('example.com');
    });
  });
});
