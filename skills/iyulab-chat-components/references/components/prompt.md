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

<!-- With file attach button -->
<u-prompt>
  <u-attach-button slot="left-actions" multiple accept="image/*,application/pdf">
    Attach
  </u-attach-button>
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

// Wire up file attach button
prompt.addEventListener('attach', (e) => {
  const { files } = e.detail;
  prompt.files = [
    ...(prompt.files ?? []),
    ...files.map(f => ({
      type: 'file' as const,
      name: f.name,
      size: f.size,
      mimeType: f.type,
      status: 'idle' as const,
    }))
  ];
});

// Programmatic submit
prompt.submit();
```

---

## Slots

| Name | Description |
|------|-------------|
| `header` | Area above the input |
| `left-actions` | Left side of the control bar (e.g. attach button) |
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

| Event | Detail | Description |
|-------|--------|-------------|
| `send` | `unknown` | Fired on Enter or send button click |
| `stop` | `unknown` | Fired on send button click while loading |
| `remove` | `RemoveEventDetail` | Fired when an attached file's remove button is clicked |

## CSS Parts

| Part | Description |
|------|-------------|
| `input` | Text input area (`u-text-block`) |
| `files` | File attachment preview area |
| `control` | Bottom control row (actions + send button) |
| `send-btn` | Send / stop button |
