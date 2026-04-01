# u-code-block

```ts
import '@iyulab/chat-components/dist/components/blocks/UCodeBlock.js';
```

**Tag:** `u-code-block`

Syntax-highlighted code block powered by Highlight.js. Shows a language label, clipboard copy button, and loading spinner. Automatically rendered inside `u-marked-block` for fenced code blocks.

```html
<!-- Direct usage -->
<u-code-block lang="typescript" .value=${"const x: number = 42;"}></u-code-block>

<!-- Without header -->
<u-code-block lang="json" headless .value=${JSON.stringify({key: 'value'}, null, 2)}></u-code-block>

<!-- Loading state (streaming) -->
<u-code-block lang="python" loading .value=${"def hello():"}></u-code-block>

<!-- Inject code via slot -->
<u-code-block lang="javascript">
  console.log("Hello from slot");
</u-code-block>
```

---

## Properties

| Property | Type | Default | Reflect | Description |
|----------|------|---------|---------|-------------|
| `lang` | `string` | `'plaintext'` | ✓ | Code language. Falls back to `plaintext` if not supported by Highlight.js |
| `value` | `string` | `undefined` | — | Code content. Can also be set via slot `textContent` |
| `loading` | `boolean` | `false` | ✓ | Loading state. Replaces the code icon with a spinner in the header |
| `headless` | `boolean` | `false` | ✓ | Hides the header (language label + copy button) |

## Slots

| Name | Description |
|------|-------------|
| *(default, hidden)* | Code text injected directly as content; updates `value` on `slotchange` |
