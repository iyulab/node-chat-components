import { UcBarLoader } from './BarLoader';

export { UcBarLoader };

customElements.define('uc-bar-loader', UcBarLoader);

declare global {
  interface HTMLElementTagNameMap {
    'uc-bar-loader': UcBarLoader;
  }
}
