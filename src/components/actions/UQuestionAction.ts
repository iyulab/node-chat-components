import { UQuestionAction } from "./UQuestionAction.component.js";

UQuestionAction.define("u-question-action");

declare global {
  interface HTMLElementTagNameMap {
    "u-question-action": UQuestionAction;
  }
}

export { UQuestionAction };
