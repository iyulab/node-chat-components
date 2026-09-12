# u-code-block

```ts
import '@iyulab/chat-components/dist/components/blocks/UCodeBlock.js';
```

**Tag:** `u-code-block`

Syntax-highlighted code block powered by Highlight.js. Shows a language label and a clipboard copy button (from `@iyulab/components`). Automatically rendered inside `u-marked-block` for fenced code blocks.

```html
<!-- Direct usage -->
<u-code-block lang="typescript" .value=${"const x: number = 42;"}></u-code-block>

<!-- Without header -->
<u-code-block lang="json" headless .value=${JSON.stringify({key: 'value'}, null, 2)}></u-code-block>

<!-- Inject code via slot -->
<u-code-block lang="javascript">
  console.log("Hello from slot");
</u-code-block>
```

---

## Sizing

**There is no vertical cap.** Long code grows to its content rather than folding — measured: 200
lines render about 4,100px tall, with no vertical scrollbar of its own. Only long *lines* scroll,
horizontally, inside the code area.

That is deliberate, and it differs from [`u-table-block`](table-block.md), which caps at 480px:
folded code cannot be read, and the conversation the block sits in already scrolls.

Fenced code inside [`u-marked-block`](marked-block.md) renders as a nested `u-code-block`, so it
follows this same contract.

## Properties

| Property | Type | Default | Reflect | Description |
|----------|------|---------|---------|-------------|
| `lang` | `string` | `'plaintext'` | ✓ | Code language. Falls back to `plaintext` if not supported by Highlight.js |
| `value` | `string` | `undefined` | — | Code content. Can also be set via slot `textContent` |
| `headless` | `boolean` | `false` | ✓ | Hides the header (language label + copy button) |

## Slots

| Name | Description |
|------|-------------|
| *(default, hidden)* | Code text injected directly as content; updates `value` on `slotchange` |

## CSS Custom Properties

Highlight.js syntax theme — light values shown, dark auto-applies via `light-dark()`.

| Property | Description |
|----------|-------------|
| `--hljs-background-color` | Code block background |
| `--hljs-text-color` | Default text color |
| `--hljs-keyword-color` | Keywords |
| `--hljs-string-color` | Strings |
| `--hljs-comment-color` | Comments |
| `--hljs-entity-color` | Function/class names |
| `--hljs-entity-tag-color` | HTML/XML tag names |
| `--hljs-constant-color` | Constants and numbers |
| `--hljs-variable-color` | Variables and template literals |
| `--hljs-markup-heading-color` | Markdown headings |
| `--hljs-markup-list-color` | Markdown list bullets |
| `--hljs-addition-color` / `--hljs-addition-bg-color` | Diff addition text / background |
| `--hljs-deletion-color` / `--hljs-deletion-bg-color` | Diff deletion text / background |
