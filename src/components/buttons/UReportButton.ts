import { UReportButton } from './UReportButton.component.js';

UReportButton.define('u-report-button');

declare global {
  interface HTMLElementTagNameMap {
    'u-report-button': UReportButton;
  }
}

export { UReportButton };
