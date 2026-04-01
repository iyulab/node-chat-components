# u-vote-button

```ts
import '@iyulab/chat-components/dist/components/buttons/UVoteButton.js';
```

**Tag:** `u-vote-button`

Thumbs-up / thumbs-down vote button pair. Clicking a button toggles its active state; clicking the same button again resets back to `none`.

```html
<!-- Basic usage -->
<u-vote-button></u-vote-button>

<!-- Pre-set state -->
<u-vote-button value="up"></u-vote-button>

<!-- With tooltips -->
<u-vote-button>
  <span slot="up">Helpful</span>
  <span slot="down">Not helpful</span>
</u-vote-button>
```

```ts
const voteBtn = document.querySelector('u-vote-button');

voteBtn.addEventListener('change', () => {
  console.log('vote:', voteBtn.value); // 'up' | 'down' | 'none'
});
```

---

## Slots

| Name | Description |
|------|-------------|
| `up` | Tooltip text for the thumbs-up button |
| `down` | Tooltip text for the thumbs-down button |

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `'none'\|'up'\|'down'` | `'none'` | Current vote state |

## Events

| Event | Description |
|-------|-------------|
| `change` | Fired when vote state changes (`bubbles: true, composed: true`) |

## CSS Parts

| Part | Description |
|------|-------------|
| `up-btn` | Thumbs-up button |
| `down-btn` | Thumbs-down button |
| `icon` | Button icon |
