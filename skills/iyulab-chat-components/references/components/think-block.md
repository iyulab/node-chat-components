# u-think-block

```ts
import '@iyulab/chat-components/dist/components/blocks/UThinkBlock.js';
```

**Tag:** `u-think-block`

Displays LLM reasoning (thinking) content. Shows "Thinking..." while loading and switches to "Thought" on completion. Content can be collapsed or expanded via a header click.

```html
<!-- Reasoning in progress -->
<u-think-block loading .value=${"Analyzing..."}></u-think-block>

<!-- Completed (default: collapsed) -->
<u-think-block .value=${"Full reasoning content here."}></u-think-block>

<!-- Expanded with auto-scroll during streaming -->
<u-think-block
  auto-scroll
  .collapsed=${false}
  .value=${streamingThought}
></u-think-block>
```

---

## Properties

| Property | Type | Default | Reflect | Description |
|----------|------|---------|---------|-------------|
| `value` | `string` | `undefined` | — | Reasoning text (rendered as markdown) |
| `loading` | `boolean` | `false` | ✓ | Loading state. Shows spinner, displays "Thinking..." label |
| `collapsed` | `boolean` | `true` | ✓ | Collapsed state. Toggle by clicking the header |
| `autoScroll` | `boolean` | `false` | — | (`auto-scroll`) Scrolls to bottom on each `value` update. Disables on user scroll interaction |

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `scrollToBottom()` | `boolean` | Smoothly scrolls the body to the bottom. Returns `true` if body element exists |

## CSS Parts

| Part | Description |
|------|-------------|
| `header` | Header row (icon + title + collapse toggle) |
| `body` | Scrollable content area |
