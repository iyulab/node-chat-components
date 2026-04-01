# u-chart-view

```ts
import '@iyulab/chat-components/dist/components/views/UChartView.js';
```

**Tag:** `u-chart-view`

Renders charts using Chart.js (lazy-loaded). Supports PNG and JSON download. Automatically re-renders when the page theme changes.

```html
<!-- Bar chart -->
<u-chart-view
  type="bar"
  .data=${{
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{ label: 'Revenue', data: [100, 200, 150] }]
  }}
></u-chart-view>

<!-- Line chart with options -->
<u-chart-view
  type="line"
  .data=${{
    labels: ['A', 'B', 'C', 'D'],
    datasets: [{ label: 'Trend', data: [10, 40, 30, 60], fill: true }]
  }}
  .options=${{ plugins: { legend: { position: 'bottom' } } }}
></u-chart-view>
```

LLM output example (`view-json` code block):

````
```view-json
{
  "tag": "u-chart-view",
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
| Lazy load | Chart.js is dynamically imported on first render |
| Download | Export chart as PNG or raw JSON data |
| Theme sync | Watches `document.documentElement[theme]` and re-renders on change |
