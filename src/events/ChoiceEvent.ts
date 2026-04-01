export interface ChoiceEventDetail {
  value: string;
}
export type ChoiceEvent = CustomEvent<ChoiceEventDetail>;

declare global {
  interface HTMLElementEventMap {
    'choice': ChoiceEvent;
  }
}