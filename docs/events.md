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

---

## Listening in TypeScript

Because the events are declared in `HTMLElementEventMap`, TypeScript infers the correct `detail` type:

```ts
import '@iyulab/chat-components'; // registers event map declarations

const prompt = document.querySelector('u-prompt')!;

// Fully typed
prompt.addEventListener('send', () => { /* void */ });
prompt.addEventListener('stop', () => { /* void */ });
```

---

## Firing Events (Component Authors)

Components use the `fire()` helper from `UElement`:

```ts
// Fires a composed, bubbling CustomEvent
this.fire<SendEventDetail>('send');
```
