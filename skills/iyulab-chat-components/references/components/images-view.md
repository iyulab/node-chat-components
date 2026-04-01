# u-images-view

```ts
import '@iyulab/chat-components/dist/components/views/UImagesView.js';
```

**Tag:** `u-images-view`

Image gallery view. Uses `u-carousel` for a horizontal slide layout, with a click-to-open lightbox. Shows up to 3 slides at once. Keyboard arrow keys navigate the lightbox.

Automatically rendered by `u-marked-block` from a `view-json` code block.

```html
<!-- Direct usage -->
<u-images-view
  .items=${[
    { src: 'https://example.com/photo1.jpg', alt: 'First photo', caption: 'Seoul at night' },
    { src: 'https://example.com/photo2.jpg', caption: 'Busan beach' },
    { src: 'https://example.com/photo3.jpg' }
  ]}
></u-images-view>
```

LLM output example (`view-json` code block):

````
```view-json
{
  "tag": "u-images-view",
  "properties": {
    "items": [
      { "src": "https://example.com/photo.jpg", "alt": "Description", "caption": "Caption" }
    ]
  }
}
```
````

---

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
