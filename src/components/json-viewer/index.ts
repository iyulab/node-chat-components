import { JsonViewer } from './JsonViewer';

JsonViewer.define('u-json-viewer');

declare global {
  interface HTMLElementTagNameMap {
    'u-json-viewer': JsonViewer;
  }
}

export { JsonViewer };