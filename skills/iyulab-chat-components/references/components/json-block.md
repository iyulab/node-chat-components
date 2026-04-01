# u-json-block

```ts
import '@iyulab/chat-components/dist/components/blocks/UJsonBlock.js';
```

**Tag:** `u-json-block`

Renders JSON data as a collapsible, interactive tree. Used inside `u-tool-block` to display tool call input and output.

```html
<!-- Basic usage -->
<u-json-block .value=${{ name: "Alice", age: 30, hobbies: ["reading", "coding"] }}></u-json-block>

<!-- Collapsed by default -->
<u-json-block .expanded=${false} .value=${complexData}></u-json-block>
```

Pass JSON via HTML attribute:

```html
<u-json-block value='{"key": "value", "count": 42}'></u-json-block>
```

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `JsonNode` | `{}` | JSON data to render (object, array, or primitive) |
| `expanded` | `boolean` | `true` | Initial expand state for all object/array nodes |

## JsonNode Type

```ts
type JsonValue  = string | number | boolean | null;
type JsonArray  = JsonNode[];
type JsonObject = { [key: string]: JsonNode };
type JsonNode   = JsonValue | JsonArray | JsonObject;
```
