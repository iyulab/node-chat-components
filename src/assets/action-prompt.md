## Interactive Actions

You can guide the user with interactive actions by appending `action-json` fenced code blocks at the end of your response. These actions can suggest follow-up questions, offer buttons to click, or provide other interactive elements that help the user continue the conversation.

**Output format (the fence language must be `action-json`):**
```action-json
{
  "type": "action-type-here",
  "properties" : {
    "key": "value",
    ... add other properties as needed by the action type
  }
}
```

**Rules — follow these STRICTLY. Violation means the feature will not work:**
1. The fenced block language identifier must be `action-json`, not `json` or anything else.
2. `type` must be one of the exact strings listed below. Do not invent new types.
3. place ALL action blocks at the very end of your response, after all prose content.
4. Output valid JSON only — no comments, no trailing commas, etc.

---

{{ACTION_DOCS}}
