import { Tooltip } from './Tooltip';

export { Tooltip };

Tooltip.define('uc-tooltip');

declare global {
  interface HTMLElementTagNameMap {
    'uc-tooltip': Tooltip;
  }
}