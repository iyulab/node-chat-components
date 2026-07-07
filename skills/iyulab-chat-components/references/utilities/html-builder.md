# HtmlBuilder

```ts
import { HtmlBuilder } from '@iyulab/chat-components';
```

Utility for building custom-element HTML strings, used internally by `u-marked-block` to inject `u-ref-tag`, `u-ref-card-group`, `u-code-block`, and `u-element-block` markup while rendering markdown. Useful if you're pre-building HTML fragments to feed into `u-marked-block` (e.g. custom preprocessing) instead of writing template strings by hand.

```ts
HtmlBuilder.build('u-ref-tag', { href: 'https://example.com', disabled: true }, 'Click');
// → '<u-ref-tag href="https://example.com" disabled>Click</u-ref-tag>'
```

---

## API

### `HtmlBuilder.build(tag, attrs?, content?): string`

| Param | Type | Description |
|-------|------|-------------|
| `tag` | `string` | Custom element tag name (e.g. `"u-ref-tag"`) |
| `attrs` | `Record<string, string \| boolean \| object \| null \| undefined>` | Attribute map (default `{}`) |
| `content` | `string` | Inner HTML string, assumed already safe — no internal escaping (default `''`) |

**Attribute value rules:**

| Value | Result |
|-------|--------|
| `null` / `undefined` | Attribute omitted |
| `false` | Attribute omitted |
| `true` | Key only, no value (e.g. `disabled`) |
| `object` | `JSON.stringify`'d, then HTML-attribute-escaped |
| `href` / `src` keys | Escaped via the URL-safe escaper (blocks `javascript:` etc.) |
| other `string` | HTML-attribute-escaped |
