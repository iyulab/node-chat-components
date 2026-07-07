# u-prompt

```ts
import '@iyulab/chat-components/dist/components/prompt/UPrompt.js';
```

**Tag:** `u-prompt`

Chat input component. Combines a text input area, file attachment previews, and an integrated send/stop button.

```html
<!-- Basic usage -->
<u-prompt placeholder="Type a message..."></u-prompt>

<!-- Loading (streaming) state -->
<u-prompt loading></u-prompt>

<!-- Custom actions via slots (there is no built-in attach button) -->
<u-prompt>
  <button slot="left-actions" @click=${openFilePicker}>Attach</button>
</u-prompt>
```

```ts
const prompt = document.querySelector('u-prompt');

// Send event
prompt.addEventListener('send', () => {
  console.log('value:', prompt.value);
  console.log('files:', prompt.files);
});

// Stop event (fired when send button is clicked while loading=true)
prompt.addEventListener('stop', () => {
  console.log('stopped');
});

// Attaching files (no built-in picker — wire up your own <input type="file">)
prompt.files = [
  ...(prompt.files ?? []),
  { type: 'file' as const, name: 'photo.png', size: 12345, mimeType: 'image/png' }
];

// Programmatic submit
prompt.submit();
```

---

## Slots

| Name | Description |
|------|-------------|
| `header` | Area above the input |
| `left-actions` | Left side of the control bar (e.g. a custom attach button) |
| `right-actions` | Right side of the control bar |
| `footer` | Area below the input |

## Properties

| Property | Type | Default | Reflect | Description |
|----------|------|---------|---------|-------------|
| `loading` | `boolean` | `false` | ✓ | Loading state. Send button becomes a stop button |
| `value` | `string` | `undefined` | — | Text input value |
| `files` | `FileBlockItem[]` | `undefined` | — | Attached file list |
| `placeholder` | `string` | `undefined` | — | Input placeholder text |
| `minRows` | `number` | `1` | — | Minimum textarea rows |
| `maxRows` | `number` | `10` | — | Maximum textarea rows (scrolls beyond) |

## Methods

| Method | Description |
|--------|-------------|
| `submit()` | Programmatically submit. Fires `stop` if loading, otherwise fires `send` (only when value or files present) |

## Events

Both `send` and `stop` are dispatched with `bubbles: false, composed: false` — listen directly on the `u-prompt` element, they won't bubble past it.

| Event | Detail | Description |
|-------|--------|-------------|
| `send` | `SendEventDetail` (`{ value, files? }`) | Fired on Enter or send button click (only when there's a value or files) |
| `stop` | `StopEventDetail` (`{}`) | Fired on send button click while loading |
| `remove` | `RemoveEventDetail` | Fired when an attached file's remove button is clicked |

## CSS Parts

| Part | Description |
|------|-------------|
| `input` | Text input area (`u-text-block`) |
| `files` | File attachment preview area |
| `control` | Bottom control row (actions + send button) |
| `send-btn` | Send / stop button |
