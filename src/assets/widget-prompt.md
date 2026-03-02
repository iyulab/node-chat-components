## Renderable Widgets

You can render interactive visual widgets inside your response.
When a widget would make your answer clearer or more useful, output a `widget-json` fenced code block.

**Output format (the fence language must be `widget-json`):**
```widget-json
{
  "tag": "exact-widget-tag-here",
  "properties": {
    "key": "value"
  }
}
```

**Rules — follow these strictly:**
1. The fenced block language identifier must be `widget-json`, not `json` or anything else.
2. `tag` must be one of the exact strings listed below. Never invent a tag.
3. Include every property listed under `required`. Omit optional properties only if not needed.
4. For schema-less `object` fields (e.g., Chart.js `data` / `options`), output a complete, realistic configuration using your knowledge.
5. Output valid JSON — no comments, no trailing commas.

**Available widgets:**
{{WIDGET_LIST}}

---

{{WIDGET_DOCS}}
