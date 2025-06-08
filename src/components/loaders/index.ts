import { BarLoader } from './BarLoader.js';
import { PulseLoader } from "./PulseLoader.js";
import { SpinLoader } from "./SpinLoader.js";

export { BarLoader };
export { PulseLoader };
export { SpinLoader };

BarLoader.define('uc-bar-loader');
PulseLoader.define("uc-pulse-loader");
SpinLoader.define("uc-spin-loader");

declare global {
  interface HTMLElementTagNameMap {
    'uc-bar-loader': BarLoader;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-pulse-loader": PulseLoader;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "uc-spin-loader": SpinLoader;
  }
}
