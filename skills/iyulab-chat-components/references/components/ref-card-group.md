# u-ref-card-group

```ts
import '@iyulab/chat-components/dist/components/references/URefCardGroup.js';
```

**Tag:** `u-ref-card-group`

Groups multiple `u-ref-card` elements into a paginated slider. Previous/next navigation and a page indicator appear automatically when there are 2 or more cards.

Used automatically by `u-marked-block` when processing citation data.

```html
<u-ref-card-group>
  <u-ref-card type="web" url="https://example.com/1" title="First Source"></u-ref-card>
  <u-ref-card type="web" url="https://example.com/2" title="Second Source"></u-ref-card>
  <u-ref-card type="document" title="Internal Doc"></u-ref-card>
</u-ref-card-group>
```

```ts
const group = document.querySelector('u-ref-card-group');

// Navigate to a specific card
group.switch(1); // go to second card
group.switch(-1); // wraps to last card
```

---

## Slots

| Name | Description |
|------|-------------|
| *(default)* | `u-ref-card` elements |

## Methods

| Method | Description |
|--------|-------------|
| `switch(index)` | Navigate to the card at `index`. Wraps around on out-of-bounds values |
