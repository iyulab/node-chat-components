import { BarBounceLoader } from './BarBounceLoader.js';
import { BarRotateLoader } from './BarRotateLoader.js';
import { DotBounceLoader } from './DotBounceLoader.js';
import { DotRotateLoader } from './DotRotateLoader.js';
import { RingStretchLoader } from './RingStretchLoader.js';
import { RingRotateLoader } from './RingRotateLoader.js';
import { HourglassRotateLoader } from './HourglassRotateLoader.js';
import { PulseLoader } from "./PulseLoader.js";

export { BarBounceLoader };
export { BarRotateLoader };
export { DotBounceLoader };
export { DotRotateLoader };
export { RingStretchLoader };
export { RingRotateLoader };
export { HourglassRotateLoader };
export { PulseLoader };

BarBounceLoader.define('uc-bar-bounce-loader');
BarRotateLoader.define("uc-bar-rotate-loader");
DotBounceLoader.define('uc-dot-bounce-loader');
DotRotateLoader.define('uc-dot-rotate-loader');
RingStretchLoader.define('uc-ring-stretch-loader');
RingRotateLoader.define("uc-ring-rotate-loader");
HourglassRotateLoader.define("uc-hourglass-rotate-loader");
PulseLoader.define("uc-pulse-loader");

declare global {
  interface HTMLElementTagNameMap {
    'uc-bar-bounce-loader': BarBounceLoader;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-bar-rotate-loader": BarRotateLoader;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'uc-dot-bounce-loader': DotBounceLoader;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'uc-dot-rotate-loader': DotRotateLoader;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'uc-ring-stretch-loader': RingStretchLoader;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-ring-rotate-loader": RingRotateLoader;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-hourglass-rotate-loader": HourglassRotateLoader;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-pulse-loader": PulseLoader;
  }
}
