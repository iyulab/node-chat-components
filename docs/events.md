# Events

All custom events bubble and are composed (cross shadow DOM boundary) unless noted otherwise.

---

## Component Events

### `u-prompt`

| Event | Type | Detail | Description |
|-------|------|--------|-------------|
| `send` | `CustomEvent` | `unknown` | Fired when the user presses Enter (without Shift) or clicks the send button. Only fires if `value` or `files` is non-empty |
| `stop` | `CustomEvent` | `unknown` | Fired when the send button is clicked while `loading` is `true` |
| `remove` | `RemoveEvent` | `RemoveEventDetail` | Fired when an attached file's remove button is clicked inside the prompt |

### `u-attach-button`

| Event | Type | Detail | Description |
|-------|------|--------|-------------|
| `attach` | `CustomEvent<AttachEventDetail>` | `{ files: File[] }` | Fired after the user selects files. The hidden `<input>` is reset automatically |

### `u-question-intent`

| Event | Type | Detail | Description |
|-------|------|--------|-------------|
| `choice` | `CustomEvent<ChoiceEventDetail>` | `{ value: string }` | Fired when a choice button is clicked. `value` is the text of the clicked choice |

### `u-vote-button`

| Event | Type | Detail | Description |
|-------|------|--------|-------------|
| `change` | `Event` | — | Fired when the vote state changes (`none → up`, `none → down`, `up → none`, `down → none`) |

### `u-file-block`

| Event | Type | Detail | Description |
|-------|------|--------|-------------|
| `remove` | `RemoveEvent` | `RemoveEventDetail` | Fired when the remove button is clicked. If the event is not `preventDefault()`ed, the element removes itself from the DOM |

---

## Event Type Declarations

All events are declared in `src/events/` and augment `HTMLElementEventMap` for TypeScript support.

### `SendEvent`

```ts
// src/events/SendEvent.ts
export type SendEventDetail = unknown;
export type SendEvent = CustomEvent<SendEventDetail>;

declare global {
  interface HTMLElementEventMap { 'send': SendEvent; }
}
```

### `StopEvent`

```ts
// src/events/StopEvent.ts
export type StopEventDetail = unknown;
export type StopEvent = CustomEvent<StopEventDetail>;

declare global {
  interface HTMLElementEventMap { 'stop': StopEvent; }
}
```

### `AttachEvent`

```ts
// src/events/AttachEvent.ts
export interface AttachEventDetail { files: File[]; }
export type AttachEvent = CustomEvent<AttachEventDetail>;

declare global {
  interface HTMLElementEventMap { 'attach': AttachEvent; }
}
```

### `ChoiceEvent`

```ts
// src/events/ChoiceEvent.ts
export interface ChoiceEventDetail { value: string; }
export type ChoiceEvent = CustomEvent<ChoiceEventDetail>;

declare global {
  interface HTMLElementEventMap { 'choice': ChoiceEvent; }
}
```

---

## Listening in TypeScript

Because the events are declared in `HTMLElementEventMap`, TypeScript infers the correct `detail` type:

```ts
import '@iyulab/chat-components'; // registers event map declarations

const prompt = document.querySelector('u-prompt')!;
const attachBtn = document.querySelector('u-attach-button')!;
const intent = document.querySelector('u-question-intent')!;

// Fully typed
prompt.addEventListener('send', () => { /* void */ });
prompt.addEventListener('stop', () => { /* void */ });

attachBtn.addEventListener('attach', (e) => {
  e.detail.files; // File[]
});

intent.addEventListener('choice', (e) => {
  e.detail.value; // string
});
```

---

## Firing Events (Component Authors)

Components use the `fire()` helper from `UElement`:

```ts
// Fires a composed, bubbling CustomEvent
this.fire<SendEventDetail>('send');
this.fire<AttachEventDetail>('attach', { detail: { files } });
this.fire<ChoiceEventDetail>('choice', { detail: { value } });
```
