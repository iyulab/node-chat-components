import { UQuestionIntent } from "./UQuestionIntent.component.js";

UQuestionIntent.define("u-question-intent");

declare global {
  interface HTMLElementTagNameMap {
    "u-question-intent": UQuestionIntent;
  }
}

export { UQuestionIntent };
