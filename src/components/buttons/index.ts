import { AttachButton } from "./AttachButton";
import { CopyButton } from "./CopyButton";
import { SendButton } from "./SendButton";
import { ThinkButton } from "./ThinkButton";

export { AttachButton };
export { CopyButton };
export { SendButton };
export { ThinkButton };

AttachButton.define("uc-attach-button");
CopyButton.define("uc-copy-button");
SendButton.define("uc-send-button");
ThinkButton.define("uc-think-button");

declare global {
  interface HTMLElementTagNameMap {
    "uc-attach-button": AttachButton;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-copy-button": CopyButton;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-send-button": SendButton;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-think-button": ThinkButton;
  }
}
