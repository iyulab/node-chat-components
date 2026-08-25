# u-marked-block

```ts
import '@iyulab/chat-components/dist/components/blocks/UMarkedBlock.js';
```

**Tag:** `u-marked-block`

Renders markdown text to HTML. Supports KaTeX math equations, code syntax highlighting, inline citation tag injection, and special handling for `block-json` code fences (the [extra system](../extra-system.md)). Applying an 80ms debounce makes it suitable for LLM streaming.

**Special code fence:**
- `` ```block-json `` → automatically rendered via [`u-element-block`](./element-block.md)
- All other HTML inside markdown is escaped to prevent XSS

Tracks a `streaming` state internally (resets a 1500ms idle timer on every `value` update). A `block-json` extra's `loading` stays `true` until both its own fence is closed and the message has been idle for 1500ms.

```html
<!-- Basic markdown -->
<u-marked-block value="# Hello\n\nThis is **bold** and `code`."></u-marked-block>

<!-- Math equations -->
<u-marked-block value="Euler's identity: $e^{i\pi} + 1 = 0$"></u-marked-block>

<!-- With citation references -->
<u-marked-block
  .value=${"The Earth orbits the Sun."}
  .refs=${[{
    startIndex: 4,
    endIndex: 9,
    label: '[1]',
    sources: [{ type: 'web', url: 'https://...', title: 'Source' }]
  }]}
></u-marked-block>
```

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `undefined` | Markdown text to render |
| `refs` | `ReferenceCitation[]` | `undefined` | Citation list. `u-ref-tag` elements are automatically inserted at `startIndex`/`endIndex` positions |

## CSS Custom Properties

Vendored from GitHub's markdown theme — light values shown, dark auto-applies via
`light-dark()`.

| Property | Description |
|----------|-------------|
| `--fgColor-default` / `--fgColor-muted` / `--fgColor-accent` | Body text / secondary text / link color |
| `--bgColor-default` / `--bgColor-muted` / `--bgColor-neutral-muted` / `--bgColor-attention-muted` | Body / code+table-stripe / hr+badge / warning-callout background |
| `--borderColor-default` / `--borderColor-muted` / `--borderColor-neutral-muted` | Table and blockquote border weights |
| `--focus-outlineColor` | Link focus outline |
| `--fontStack-monospace` | Inline code and code-fence font stack |
| `--base-size-4` / `-8` / `-16` / `-24` / `-40` | Spacing scale used throughout (margins, padding, gaps) |
| `--base-text-weight-normal` / `-medium` / `-semibold` | Font-weight scale (body / table header / heading) |

## ReferenceCitation Type

```ts
interface ReferenceCitation {
  startIndex: number;    // Start character index in the markdown text
  endIndex: number;      // End character index
  label?: string;        // Display label, e.g. "[1]" or "(Smith, 2023)"
  sources: ReferenceSource[];
}
```
