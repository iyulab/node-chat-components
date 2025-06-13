import { TextBlock } from "./TextBlock";
import { MarkdownBlock } from "./MarkdownBlock";
import { ThinkingBlock } from "./ThinkingBlock";
import { ToolBlock } from "./ToolBlock";
import { CodeBlock } from "./CodeBlock";

export { TextBlock };
export { MarkdownBlock };
export { ThinkingBlock };
export { ToolBlock };
export { CodeBlock };

TextBlock.define("uc-text-block");
MarkdownBlock.define("uc-markdown-block")
ThinkingBlock.define("uc-thinking-block");
ToolBlock.define("uc-tool-block");
CodeBlock.define("uc-code-block");

declare global {
  interface HTMLElementTagNameMap {
    "uc-text-block": TextBlock;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-markdown-block": MarkdownBlock;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-thinking-block": ThinkingBlock;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-tool-block": ToolBlock;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-code-block": CodeBlock;
  }
}
