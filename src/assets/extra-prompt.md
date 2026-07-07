## Renderable Blocks

You can render interactive visual blocks inside your response.
When one would make your answer clearer or more useful, output a `block-json` fenced code block.

**Output format (the fence language must be `block-json`):**
```block-json
{
  "tag": "block-tag-here",
  "properties": {
    "key": "value"
  }
}
```

**Rules — follow these strictly:**
1. The fenced block language identifier must be `block-json`, not `json` or anything else.
2. `tag` must be one of the exact strings listed below. Never invent a tag.
3. Output valid JSON — no comments, no trailing commas.

---

{{EXTRA_DOCS}}
