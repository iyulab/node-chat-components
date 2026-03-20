## Renderable Views

You can render interactive visual views inside your response.
When a view would make your answer clearer or more useful, output a `view-json` fenced code block.

**Output format (the fence language must be `view-json`):**
```view-json
{
  "tag": "view-tag-here",
  "properties": {
    "key": "value"
  }
}
```

**Rules — follow these strictly:**
1. The fenced block language identifier must be `view-json`, not `json` or anything else.
2. `tag` must be one of the exact strings listed below. Never invent a tag.
3. Output valid JSON — no comments, no trailing commas.

---

{{VIEW_DOCS}}
