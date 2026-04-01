# u-tool-block

```ts
import '@iyulab/chat-components/dist/components/blocks/UToolBlock.js';
```

**Tag:** `u-tool-block`

Displays a tool call's input and output as collapsible JSON trees. Used to show LLM tool usage inline in a message.

```html
<!-- Tool call in progress -->
<u-tool-block loading title="search_web"></u-tool-block>

<!-- Completed tool call -->
<u-tool-block
  title="search_web"
  .input=${{ query: "weather today" }}
  .output=${{ results: ["Sunny, 25°C"] }}
></u-tool-block>

<!-- Expanded by default -->
<u-tool-block
  title="code_execution"
  .collapsed=${false}
  .input=${{ code: "print('hello')" }}
  .output=${{ stdout: "hello\n" }}
></u-tool-block>
```

Pass JSON via HTML attribute (uses `jsonAttrConverter`):

```html
<u-tool-block
  title="calculator"
  input='{"expression": "2 + 2"}'
  output='{"result": 4}'
></u-tool-block>
```

---

## Properties

| Property | Type | Default | Reflect | Description |
|----------|------|---------|---------|-------------|
| `title` | `string` | `''` | — | Tool name shown in the header (falls back to 'Tool Usage') |
| `loading` | `boolean` | `false` | ✓ | Loading state. Shows spinner in header |
| `collapsed` | `boolean` | `true` | ✓ | Collapsed state. Toggle by clicking the header |
| `input` | `JsonNode` | `undefined` | — | Tool input JSON |
| `output` | `JsonNode` | `undefined` | — | Tool output JSON |

## CSS Parts

| Part | Description |
|------|-------------|
| `body` | Input / output display area |
