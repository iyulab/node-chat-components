import { UQuestionsWidget } from "./UQuestionsWidget.component.js";

UQuestionsWidget.define("u-questions-widget");

declare global {
  interface HTMLElementTagNameMap {
    "u-questions-widget": UQuestionsWidget;
  }
}

export { UQuestionsWidget };
