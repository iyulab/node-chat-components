# u-copy-button

```ts
import '@iyulab/chat-components/dist/components/buttons/UCopyButton.js';
```

**Tag:** `u-copy-button`

Copies text to the clipboard on click. The icon switches to a checkmark temporarily to confirm the action. Used inside `u-code-block` for code copying.

```html
<!-- Basic usage -->
<u-copy-button .value=${"Text to copy"}></u-copy-button>

<!-- With tooltip text -->
<u-copy-button .value=${"code content"}>Copy</u-copy-button>

<!-- Custom reset delay (default: 1000ms) -->
<u-copy-button .value=${"text"} .delay=${2000}></u-copy-button>
```

Typical placement in a message footer:

```html
<u-message>
  <u-marked-block slot="default" .value=${content}></u-marked-block>
  <div slot="footer">
    <u-copy-button .value=${content}>Copy</u-copy-button>
  </div>
</u-message>
```

---

## Slots

| Name | Description |
|------|-------------|
| *(default)* | Tooltip label text |

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `undefined` | Text to copy to clipboard |
| `delay` | `number` | `1000` | Time in ms before the icon resets after copying. `0` resets immediately |
