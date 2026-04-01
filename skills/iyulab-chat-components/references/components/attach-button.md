# u-attach-button

```ts
import '@iyulab/chat-components/dist/components/buttons/UAttachButton.js';
```

**Tag:** `u-attach-button`

Opens a file picker dialog. Fires an `attach` event with the selected files. Place in `u-prompt`'s `left-actions` slot.

```html
<!-- Basic usage -->
<u-attach-button></u-attach-button>

<!-- Images only -->
<u-attach-button accept="image/*">Add image</u-attach-button>

<!-- Multiple files allowed -->
<u-attach-button multiple accept="image/*,application/pdf">Attach files</u-attach-button>

<!-- Inside u-prompt -->
<u-prompt>
  <u-attach-button
    slot="left-actions"
    multiple
    accept="image/*,application/pdf,text/*"
    @attach=${handleAttach}
  >
    Files
  </u-attach-button>
</u-prompt>
```

```ts
const attachBtn = document.querySelector('u-attach-button');

attachBtn.addEventListener('attach', (e) => {
  const { files } = e.detail; // File[]
  console.log('Selected files:', files.map(f => f.name));
});
```

---

## Slots

| Name | Description |
|------|-------------|
| *(default)* | Tooltip label text |

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `accept` | `string` | `undefined` | Accepted MIME types (comma-separated). E.g. `"image/*"`, `"image/*,application/pdf"` |
| `multiple` | `boolean` | `false` | Allow selecting multiple files |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `attach` | `{ files: File[] }` | Fired after file selection. The file input is reset automatically |

## CSS Parts

| Part | Description |
|------|-------------|
| `base` | The button element (`u-button`) |
| `icon` | Paperclip icon |
