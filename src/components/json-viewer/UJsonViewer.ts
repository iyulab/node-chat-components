import { UJsonViewer } from './UJsonViewer.component.js';

UJsonViewer.define('u-json-viewer');

declare global {
  interface HTMLElementTagNameMap {
    'u-json-viewer': UJsonViewer;
  }
}

export { UJsonViewer };