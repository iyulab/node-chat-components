# u-text-block

```ts
import '@iyulab/chat-components/dist/components/blocks/UTextBlock.js';
```

**Tag:** `u-text-block`

Displays plain text or acts as an editable textarea. Used inside `u-prompt` as the input area.

```html
<!-- Read-only text display -->
<u-text-block .value=${"Hello!"}></u-text-block>

<!-- Editable textarea -->
<u-text-block
  editable
  placeholder="Type a message..."
  .minRows=${3}
  .maxRows=${10}
  .value=${inputValue}
  @input=${handleInput}
></u-text-block>
```

```ts
const block = document.querySelector('u-text-block');

block.addEventListener('input', () => {
  console.log(block.value);
});

block.focus();
```

---

## Properties

| Property | Type | Default | Reflect | Description |
|----------|------|---------|---------|-------------|
| `value` | `string` | `undefined` | — | Text content |
| `editable` | `boolean` | `false` | ✓ | Enables the textarea and focuses it on activation |
| `placeholder` | `string` | `undefined` | — | Placeholder shown in edit mode |
| `minRows` | `number` | `1` | — | Minimum visible rows |
| `maxRows` | `number` | `undefined` | — | Maximum rows before scrolling |
| `spellcheck` | `boolean` | `false` | — | Enables browser spell-check |

## Methods

| Method | Description |
|--------|-------------|
| `focus(options?)` | Focuses the inner textarea |

## Events

| Event | Description |
|-------|-------------|
| `input` | Fired on text change (re-dispatches the original `InputEvent`) |
