# u-message

```ts
import '@iyulab/chat-components/dist/components/message/UMessage.js';
```

**Tag:** `u-message`

Chat message wrapper component. Arranges content blocks via slots, shows a loading animation while the response streams in, and supports bubble or default visual styles.

```html
<!-- Default AI message -->
<u-message>
  <u-marked-block .value=${"## Hello\nMarkdown here."}></u-marked-block>
</u-message>

<!-- User message (right-aligned, bubble style) -->
<u-message position="right" variant="bubble">
  <u-text-block .value=${"Hello!"}></u-text-block>
</u-message>

<!-- Loading state (streaming) -->
<u-message loading>
  <u-marked-block .value=${"Streaming..."}></u-marked-block>
</u-message>

<!-- With header and footer slots -->
<u-message>
  <div slot="header">AI Assistant</div>
  <u-marked-block .value=${content}></u-marked-block>
  <div slot="footer">
    <u-copy-button .value=${content}></u-copy-button>
    <u-vote-button></u-vote-button>
  </div>
</u-message>
```

---

## Slots

| Name | Description |
|------|-------------|
| `header` | Area above the message body (avatar, name, etc.) |
| *(default)* | Message content blocks |
| `footer` | Area below the message body (buttons, etc.); hidden while `loading` |

## Properties

| Property | Type | Default | Reflect | Description |
|----------|------|---------|---------|-------------|
| `loading` | `boolean` | `false` | ✓ | Loading state. Shows three-dot animation; hides `footer` slot |
| `variant` | `'default'\|'bubble'` | `'default'` | ✓ | Visual style |
| `position` | `'left'\|'right'` | `'left'` | ✓ | Message alignment |

## CSS Parts

| Part | Description |
|------|-------------|
| `body` | Message body wrapper |
