# u-table-block

```ts
import '@iyulab/chat-components/dist/components/blocks/UTableBlock.js';
```

**Tag:** `u-table-block`

Renders tabular data with column sorting, search filtering, and CSV/XLS download. Automatically rendered inside `u-marked-block` for markdown tables.

Extends `UDataElement`, so data can also be injected via a `<script type="application/json">` slot.

```html
<!-- Direct data binding -->
<u-table-block
  .headers=${[
    { text: 'Name', align: 'left' },
    { text: 'Age', align: 'center' },
    { text: 'Score', align: 'right' }
  ]}
  .rows=${[
    [{ text: 'Alice', align: 'left' }, { text: '30', align: 'center' }, { text: '95', align: 'right' }],
    [{ text: 'Bob',   align: 'left' }, { text: '25', align: 'center' }, { text: '88', align: 'right' }]
  ]}
></u-table-block>

<!-- JSON slot injection -->
<u-table-block>
  <script type="application/json">
    {
      "headers": [{ "text": "Name", "align": "left" }],
      "rows": [[{ "text": "Alice", "align": "left" }]]
    }
  </script>
</u-table-block>
```

---

## Sizing

The table area caps at **480px** and scrolls inside that cap; below it the block is content-sized.
Measured at 600px wide: 40 rows give a 480px table area with ~1,000px to scroll, 2 rows give ~108px
and no scrollbar. That default keeps a long table from swallowing the conversation.

**A `max-height` (or `height`) on the host wins.** The table area shrinks to fit it and still
scrolls, so no rows become unreachable:

```css
u-table-block { max-height: 200px; }
```

There is no size property or custom property for this — the host is the lever.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `headers` | `TableCell[]` | `[]` | Header cells, each with `text`, optional `html` and `align` |
| `rows` | `TableCell[][]` | `[]` | Row data; each row is an array of `TableCell` |

## CSS Parts

| Part | Description |
|------|-------------|
| `sort-button` | A column header's sort toggle |

## TableCell Type

```ts
interface TableCell {
  text: string;
  html?: string;
  align: 'left' | 'center' | 'right' | null;
}
```

`text` is plain text: it is shown as written (markup in it appears as characters), and search, sort and the
CSV/XLS downloads use it. For a formatted cell, also give `html` — trusted markup that only the screen uses; search,
sort and downloads still read `text`. `u-marked-block` fills both from its markdown renderer. Never put an untrusted
string in `html`.

## Features

| Feature | Description |
|---------|-------------|
| Column sort | Click a header to sort asc/desc |
| Search filter | Search bar filters rows by `text` (debounced) and highlights the matches without changing the cell markup (CSS Custom Highlight API; no highlight where the browser lacks it) |
| CSV download | Downloads current filtered/sorted data as CSV |
| XLS download | Downloads as Excel file |
