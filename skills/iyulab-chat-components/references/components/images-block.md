# u-images-block

```ts
import '@iyulab/chat-components/dist/components-extra/UImagesBlock.js';
```

**Tag:** `u-images-block` — one of the 4 built-in **extra** blocks. Not part of the core entrypoint; import it (or the whole `/extra` subpath) explicitly. See [../extra-system.md](../extra-system.md).

Image gallery. Uses `u-carousel` for a horizontal slide layout, with a click-to-open lightbox. Shows up to 3 slides at once. Keyboard arrow keys navigate the lightbox.

Automatically rendered by `u-marked-block` from a `block-json` code fence via `u-element-block`.

```html
<!-- Direct usage -->
<u-images-block
  .items=${[
    { src: 'https://example.com/photo1.jpg', alt: 'First photo', caption: 'Seoul at night' },
    { src: 'https://example.com/photo2.jpg', caption: 'Busan beach' },
    { src: 'https://example.com/photo3.jpg' }
  ]}
></u-images-block>
```

LLM output example (`block-json` code fence):

````
```block-json
{
  "tag": "u-images-block",
  "properties": {
    "items": [
      { "src": "https://example.com/photo.jpg", "alt": "Description", "caption": "Caption" }
    ]
  }
}
```
````

---

## Sizing

Height comes from width: each slide is `4 / 3`, so the block is as tall as its column is wide.
Measured at 600px wide, that is ~222px.

⚠**A `max-height` on the host does *not* shrink the images, and that is deliberate.** Squeezing them
vertically would break the aspect ratio and distort the picture, so the block overflows **visibly**
instead — it never clips, and nothing becomes unreachable. To make it shorter, give it a narrower
column rather than a shorter host.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | `ImageSlide[]` | `[]` | Array of image slide objects |

## ImageSlide Type

```ts
interface ImageSlide {
  src: string;       // Image URL (required)
  alt?: string;      // Accessibility alt text
  caption?: string;  // Caption shown below the image
}
```

## Features

| Feature | Description |
|---------|-------------|
| Carousel | Up to 3 slides visible; draggable |
| Lightbox | Full-screen modal on image click |
| Keyboard | `←` `→` to navigate, `Esc` to close |
