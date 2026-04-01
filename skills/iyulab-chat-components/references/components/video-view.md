# u-video-view

```ts
import '@iyulab/chat-components/dist/components/views/UVideoView.js';
```

**Tag:** `u-video-view`

Embeds a video from YouTube, Vimeo, or a direct file URL. Automatically detects the platform from the URL and selects the appropriate player.

```html
<!-- YouTube -->
<u-video-view src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></u-video-view>

<!-- Vimeo -->
<u-video-view src="https://vimeo.com/123456789"></u-video-view>

<!-- Direct video file -->
<u-video-view
  src="https://example.com/video.mp4"
  poster="https://example.com/thumbnail.jpg"
  ratio="4:3"
></u-video-view>
```

LLM output example (`view-json` code block):

````
```view-json
{
  "tag": "u-video-view",
  "properties": {
    "src": "https://www.youtube.com/watch?v=VIDEO_ID"
  }
}
```
````

---

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
