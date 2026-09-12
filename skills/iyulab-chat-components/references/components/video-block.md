# u-video-block

```ts
import '@iyulab/chat-components/dist/components-extra/UVideoBlock.js';
```

**Tag:** `u-video-block` — one of the 4 built-in **extra** blocks. Not part of the core entrypoint; import it (or the whole `/extra` subpath) explicitly. See [../extra-system.md](../extra-system.md).

Embeds a video from YouTube, Vimeo, or a direct file URL. Automatically detects the platform from the URL and selects the appropriate player.

```html
<!-- YouTube -->
<u-video-block src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></u-video-block>

<!-- Vimeo -->
<u-video-block src="https://vimeo.com/123456789"></u-video-block>

<!-- Direct video file -->
<u-video-block
  src="https://example.com/video.mp4"
  poster="https://example.com/thumbnail.jpg"
  ratio="4:3"
></u-video-block>
```

LLM output example (`block-json` code fence, rendered via `u-element-block`):

````
```block-json
{
  "tag": "u-video-block",
  "properties": {
    "src": "https://www.youtube.com/watch?v=VIDEO_ID"
  }
}
```
````

---

## Sizing

Height comes from width through `ratio` (`16:9` by default), capped at `max-width: 800px`. Measured
at 600px wide, a 16:9 video is ~342px tall. This holds for both branches — the embed iframe
(YouTube/Vimeo) and the native `<video>` element.

⚠**A `max-height` on the host does *not* shrink the video, and that is deliberate** — the same
reason as the image block: vertical squeezing would break the aspect ratio. The block overflows
**visibly** rather than clipping. Use `ratio`, or a narrower column, to change its height.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `src` | `string` | `undefined` | Video URL: YouTube, Vimeo, or direct file |
| `poster` | `string` | `undefined` | Poster image URL for direct video files |
| `ratio` | `'16:9'\|'4:3'\|'1:1'` | `'16:9'` | Aspect ratio |

## Supported Platforms

| Platform | URL Pattern | Embed Method |
|----------|-------------|--------------|
| YouTube | `youtube.com`, `youtu.be` | `youtube.com/embed/{id}` iframe |
| Vimeo | `vimeo.com` | `player.vimeo.com/video/{id}` iframe |
| Other | any URL | Native `<video>` element |
