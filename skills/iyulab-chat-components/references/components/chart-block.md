# u-chart-block

```ts
import '@iyulab/chat-components/dist/components-extra/UChartBlock.js';
```

**Tag:** `u-chart-block` — one of the 4 built-in **extra** blocks. Not part of the core entrypoint; import it (or the whole `/extra` subpath) explicitly. See [../extra-system.md](../extra-system.md).

Renders charts using Chart.js (statically imported). Supports PNG and JSON download, and a full-screen toggle. Automatically re-renders when the page theme changes.

```html
<!-- Bar chart -->
<u-chart-block
  type="bar"
  .data=${{
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{ label: 'Revenue', data: [100, 200, 150] }]
  }}
></u-chart-block>

<!-- Line chart with options -->
<u-chart-block
  type="line"
  .data=${{
    labels: ['A', 'B', 'C', 'D'],
    datasets: [{ label: 'Trend', data: [10, 40, 30, 60], fill: true }]
  }}
  .options=${{ plugins: { legend: { position: 'bottom' } } }}
></u-chart-block>
```

LLM output example (`block-json` code fence, rendered via `u-element-block`):

````
```block-json
{
  "tag": "u-chart-block",
  "properties": {
    "type": "bar",
    "data": {
      "labels": ["Jan", "Feb", "Mar"],
      "datasets": [{ "label": "Revenue", "data": [100, 200, 150] }]
    }
  }
}
```
````

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `ChartType` | `undefined` | Chart type: `'bar'`, `'line'`, `'pie'`, `'doughnut'`, `'radar'`, `'polarArea'`, `'bubble'`, `'scatter'` |
| `data` | `ChartData` | `undefined` | Chart.js data object with `labels` and `datasets` |
| `options` | `ChartOptions` | `undefined` | Chart.js options object |

## Features

| Feature | Description |
|---------|-------------|
| Download | Export chart as PNG or raw JSON data |
| Full screen | Toggle the chart viewport into full-screen mode |
| Theme sync | Watches `document.documentElement[theme]` and re-renders on change |

## Requires

`chart.js` (optional peer dependency) must be installed to use this component. It's imported statically at module load, not lazily.
