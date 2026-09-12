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
    <!-- Add your own action buttons here (e.g. @iyulab/components's copy-button) -->
  </div>
</u-message>
```

---

## Sizing

Content-sized: the bubble is as tall as what you put in it.

⚠**A `max-height` on the host does *not* fold the content, and that is deliberate.** A message that
hides part of itself cannot be read, and the conversation stream around it already scrolls. The
block overflows **visibly** rather than clipping. Constrain the stream, not the message.

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
