import { JsonViewer } from './JsonViewer';

export { JsonViewer };

JsonViewer.define('uc-json-viewer');

declare global {
  interface HTMLElementTagNameMap {
    'uc-json-viewer': JsonViewer;
  }
}
