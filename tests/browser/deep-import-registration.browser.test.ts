import { describe, it, expect } from 'vitest';
// Only these two modules — the deep-import path. Nothing else may register their children here.
import '../../src/components/prompt/UPrompt.js';
import '../../src/components/blocks/UTableBlock.js';

/**
 * A deep import registers everything the component renders. `u-prompt` rendered `<u-text-block>` (its input) and
 * `u-table-block` rendered `<u-input>` (its search box), each importing the class for a type only — the build dropped
 * both imports, so with a deep import the prompt had no input and the table no search box.
 */
describe('deep imports register what they render', () => {
  it('u-prompt registers u-text-block', () => {
    expect(customElements.get('u-text-block')).toBeDefined();
  });
  it('u-table-block registers u-input', () => {
    expect(customElements.get('u-input')).toBeDefined();
  });
});
