import { AttachButton } from "./AttachButton";
import { CopyButton } from "./CopyButton";
import { SendButton } from "./SendButton";

export { AttachButton };
export { CopyButton };
export { SendButton };

AttachButton.define("uc-attach-button");
CopyButton.define("uc-copy-button");
SendButton.define("uc-send-button");

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
